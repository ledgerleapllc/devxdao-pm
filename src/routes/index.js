import React, { lazy, Suspense } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import AuthRoute from './AuthRoute';
import FeatureRoute from './FeatureRoute';

const FeatureRoutes = lazy(() => import("../pages/Feature/FeatureRoutes"));
const AuthRoutes = lazy(() => import("../pages/Auth/AuthRoutes"));

const Routes = () => {
  return (
    <Suspense fallback={null}>
      <Switch>
        <AuthRoute path="/auth" component={AuthRoutes} />
        <FeatureRoute path="/app" component={FeatureRoutes} />
        <Redirect from="*" to="/app" />
      </Switch>
    </Suspense>
  );
};

export default Routes;
