import { Card, CardHeader, CardBody } from '@shared/partials';
import { useState } from 'react';
import { JobsTable } from './components/tables/JobsTable';

const JobsList = () => {
  const [params, setParams] = useState();
  return (
    <Card className="h-full flex-1 min-h-0">
      <CardHeader>
        <div className="w-full flex justify-between">
          <h2>Job Board</h2>
          <input
            className="text-xs"
            type="text"
            placeholder="Search..."
            value={params?.search}
            onChange={e => setParams({ search: e.target.value?.trim() || null })}
          />
        </div>
      </CardHeader>
      <CardBody>
        <JobsTable outParams={params}/>
      </CardBody>
    </Card>
  )
}

export default JobsList;