import { Card, CardHeader, CardBody, Tab } from '@shared/partials';
import { useState } from 'react';
import { ActiveAssignTable } from './components/tables/ActiveAssignTable';
import { CompletedAssignTable } from './components/tables/CompletedAssignTable';
import { useSelector } from "react-redux";

const Tab1 = () => {
  const [params, setParams] = useState();
  const user = useSelector(state => state.authReducer?.user);

  return (
    <Card className="h-full flex-1 min-h-0">
      <CardHeader>
        <div className="w-full flex justify-end">
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
        {
          user && (
            <ActiveAssignTable outParams={params} user={user} />
          )
        }
      </CardBody>
    </Card>
  )
}

const Tab2 = () => {
  const [params, setParams] = useState();
  const user = useSelector(state => state.authReducer?.user);

  return (
    <Card className="h-full flex-1 min-h-0">
      <CardHeader>
        <div className="w-full flex justify-end">
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
        {
          user && (
            <CompletedAssignTable outParams={params} user={user} />
          )
        }
      </CardBody>
    </Card>
  )
}

const tabsData = [
  {
    content: Tab1,
    id: 'active',
    title: 'Active',
  },
  {
    content: Tab2,
    id: 'completed',
    title: 'Completed',
  },
];

const AssignList = () => {
  const user = useSelector(state => state.authReducer?.user);

  return (
    <div className="-mt-10 h-tab">
      {
        user && (
          <Tab tabs={tabsData} data={{ user }} />
        )
      }
    </div>
  )
}

export default AssignList;