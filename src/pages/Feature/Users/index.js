import React, { lazy } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

const UsersListPage = lazy(() => import("./UsersList"));

const UsersRoutes = () => {
  let { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}`} exact component={UsersListPage} />
    </Switch>
  )
}

export default UsersRoutes;
