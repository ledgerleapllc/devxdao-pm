import { Button, Card, CardHeader, CardBody, useDialog } from '@shared/partials';
import { useState } from 'react';
import { AddAssistantDialog } from './components/dialogs/AddAssistantDialog';
import { UsersTable } from './components/tables/UsersTable';
import { useSelector } from "react-redux";

const UsersList = () => {
  const { openDialog } = useDialog();
  const [reload, setReload] = useState();
  const [params, setParams] = useState();
  const user = useSelector(state => state.authReducer?.user);

  const openAddAssistantDialog = () => {
    openDialog(
      <AddAssistantDialog afterClosed={(result) => forceReload(result)}/>
    )
  }

  const forceReload = (result) => {
    if (result) {
      setReload(true);
      setTimeout(() => {
        setReload(false);
      }, 100);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {!!user.is_super_admin && (<div className="flex justify-end pb-5">
        <Button className="px-6" color="primary" onClick={openAddAssistantDialog}>+ New Program Assistant</Button>
      </div>)}
      <Card className="flex-1 min-h-0">
        <CardHeader>
          <div className="w-full flex justify-between">
            <h2>User Management</h2>
            <input
              className="text-xs"
              type="text"
              placeholder="Search..."
              value={params?.search}
              onChange={e => setParams({ search: e.target.value?.trim() })}
            />
          </div>
        </CardHeader>
        <CardBody>
          {!reload && <UsersTable outParams={params} readOnly={!user.is_super_admin} />}
        </CardBody>
      </Card>
    </div>
  )
}

export default UsersList