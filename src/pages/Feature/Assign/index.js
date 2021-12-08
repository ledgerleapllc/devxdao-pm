import React, { lazy } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

const AssignListPage = lazy(() => import("./AssignList"));

const AssignRoutes = () => {
  let { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}`} exact component={AssignListPage} />
    </Switch>
  )
}

export default AssignRoutes;
