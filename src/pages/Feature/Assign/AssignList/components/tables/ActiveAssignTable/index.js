import { Table, useTable, Button } from '@shared/partials';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAssignedJobs1 } from '../../../../../../../stores/api/admin/actions';
import { formatDate, formatPrice, detectTypeUser } from '@shared/core/utils';
import { DEFAULT_API_RECORDS } from '@shared/core/constant';
import './style.scss';
import { Link } from 'react-router-dom';

export const ActiveAssignTable = ({ outParams, user }) => {
  const {
    data,
    register,
    hasMore,
    appendData,
    setHasMore,
    setPage,
    setParams,
    page,
    params,
    resetData,
  } = useTable();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData =(pageValue = page, paramsValue = params) => {
    dispatch(
      getAssignedJobs1({ role: detectTypeUser(user), status: 'active', ...paramsValue, page_id: pageValue, limit: DEFAULT_API_RECORDS }, (results, isHasMore) => {
        setHasMore(isHasMore);
        appendData(results);
        setPage(prev => prev + 1);
      })
    );
  }

  useEffect(() => {
    if (outParams) {
      setParams(outParams);
      resetData();
      fetchData(1, outParams);
    }
  }, [outParams]);

  const milestoneStep = (row) => {
    const index = row.milestones.findIndex(x => x.id === row.milestone_id);
    return `${index + 1}/${row.milestones.length}`;
  }

  return (
    <Table
      {...register}
      className="active-assign-table h-full"
      onLoadMore={fetchData}
      hasMore={hasMore}
      dataLength={data.length}
    >
      <Table.Header>
        <Table.HeaderCell>
          <p>Date Submitted</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="milestone.submitted_time">
          <p>Date Assigned</p>
        </Table.HeaderCell>
        {/* <Table.HeaderCell>
          <p>Assignee</p>
        </Table.HeaderCell> */}
        <Table.HeaderCell>
          <p>Proposal #</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Proposal Title</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Milestone #</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Amount</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Action</p>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker">
        {data.map((row, ind) => (
          <Table.BodyRow key={ind}>
            <Table.BodyCell>
              <p>{formatDate(row.submitted_time)}</p>
            </Table.BodyCell>
            <Table.BodyCell>
              <p>{formatDate(row.assigned_at)}</p>
            </Table.BodyCell>
            {/* <Table.BodyCell>
              <p className="break-words">{row.email}</p>
            </Table.BodyCell> */}
            <Table.BodyCell>
              <p>{row.proposal_id}</p>
            </Table.BodyCell>
            <Table.BodyCell>
              <p>{row.proposal_title}</p>
            </Table.BodyCell>
            <Table.BodyCell>
              <p>{milestoneStep(row)}</p>
              <p>Submission {row.time_submit}</p>
            </Table.BodyCell>
            <Table.BodyCell>
              <p>{formatPrice(row.grant)}</p>
            </Table.BodyCell>
            <Table.BodyCell>
              <Link to={`/app/assign/${row.milestone_review_id}`}>
                <Button color="primary" size="xs">Review</Button>
              </Link>
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
}
