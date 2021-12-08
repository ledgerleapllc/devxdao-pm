import { Table, useTable, Button } from '@shared/partials';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getJobs } from '../../../../../../stores/api/admin/actions';
import './style.scss';
import { formatDate, formatPrice } from '@shared/core/utils';
import { useHistory } from 'react-router';
import { DEFAULT_API_RECORDS } from '@shared/core/constant';

export const JobsTable = ({ outParams }) => {
  const {
    data,
    register,
    hasMore,
    appendData,
    setHasMore,
    setPage,
    page,
    params,
    setParams,
    resetData
  } = useTable();
  const dispatch = useDispatch();
  let history = useHistory();

  
  const fetchData =(pageValue = page, paramsValue = params) => {
    dispatch(
      getJobs({ ...paramsValue, page_id: pageValue, limit: DEFAULT_API_RECORDS }, (results, isHasMore) => {
        setHasMore(isHasMore);
        appendData(results);
        setPage(prev => prev + 1);
      })
    );
  }

  const milestoneStep = (row) => {
    const index = row.milestones.findIndex(x => x.id === row.milestone_id);
    return `${index + 1}/${row.milestones.length}`;
  }

  const gotoAssign = (row) => {
    history.push(`/app/job-board/${row.milestone_review_id}`);
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

  return (
    <Table
      {...register}
      className="jobs-table h-full"
      onLoadMore={fetchData}
      hasMore={hasMore}
      dataLength={data.length}
    >
      <Table.Header>
        <Table.HeaderCell>
          <p>Date Submitted</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Status</p>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <p>Proposal Number</p>
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
          <p>Actions</p>
        </Table.HeaderCell>
      </Table.Header>
      <Table.Body className="padding-tracker">
        {data.map((row, ind) => (
          <Table.BodyRow key={ind}>
            <Table.BodyCell>
              <p>{formatDate(row.submitted_time)}</p>
            </Table.BodyCell>
            <Table.BodyCell>
              <p>Unassigned</p>
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
              <Button color="primary" size="xs" onClick={() => gotoAssign(row)}>Assign</Button>
            </Table.BodyCell>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  )
}
