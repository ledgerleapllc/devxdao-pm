import { Table, useTable, Button } from '@shared/partials';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAssignedJobs2 } from '../../../../../../../stores/api/admin/actions';
import { formatDate, formatPrice, detectTypeUser } from '@shared/core/utils';
import { DEFAULT_API_RECORDS } from '@shared/core/constant';
import './style.scss';
import { Link } from 'react-router-dom';

export const CompletedAssignTable = ({ outParams, user }) => {
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

  const fetchData =(pageValue = page, paramsValue = params) => {
    dispatch(
      getAssignedJobs2({ role: detectTypeUser(user), status: 'completed', ...paramsValue, page_id: pageValue, limit: DEFAULT_API_RECORDS }, (results, isHasMore) => {
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

  useEffect(() => {
    fetchData();
  }, []);


  const milestoneStep = (row) => {
    const index = row.milestones.findIndex(x => x.id === row.milestone_id);
    return `${index + 1}/${row.milestones.length}`;
  }

  const handleSort = async (key, direction) => {
    const newParams = {
      sort_key: key,
      sort_direction: direction,
    };
    setParams(newParams);
    resetData();
    fetchData(1, newParams);
  };

  return (
    <Table
      {...register}
      className="assign-table h-full"
      onLoadMore={fetchData}
      hasMore={hasMore}
      dataLength={data.length}
      onSort={handleSort}
    >
      <Table.Header>
        <Table.HeaderCell sortKey="milestone_review.assigned_at">
          <p>Date Assigned</p>
        </Table.HeaderCell>
        <Table.HeaderCell sortKey="milestone_review.reviewed_at">
          <p>Date Completed</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Completed By</p>
        </Table.HeaderCell>
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
          <p>Status</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Action</p>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker">
        {data.map((row, ind) => (
          <Table.BodyRow key={ind}>
            <Table.BodyCell>
              <p>{formatDate(row.assigned_at)}</p>
            </Table.BodyCell>
            <Table.BodyCell>
              <p>{formatDate(row.reviewed_at)}</p>
            </Table.BodyCell>
            <Table.BodyCell>
              <p className="break-words">{row.email}</p>
            </Table.BodyCell>
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
              <p>
                {row.milestone_review_status === 'denied' && 'Denied'}
                {row.milestone_review_status === 'approved' && 'Success'}
              </p>
            </Table.BodyCell>
            <Table.BodyCell>
              <Link to={`/app/assign/${row.milestone_review_id}`}>
                <Button color="primary" size="xs">View</Button>
              </Link>
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
}
