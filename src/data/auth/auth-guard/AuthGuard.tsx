import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { useAppContext } from '@vega/platform/app-context';

type AuthGuardProps = {
  authRoute: string;
  routeAfterAuth: string;
};

export const AuthGuard: React.FC<AuthGuardProps> = (props) => {
  const { authRoute, routeAfterAuth } = props;

  const { authAPI } = useAppContext();

  const location = useLocation();

  const { isAuthorized } = authAPI;

  const isAuthPage = location.pathname === authRoute;

  const getRedirectUrl = (): string => {
    if (isAuthorized) {
      return isAuthPage ? routeAfterAuth : location.pathname;
    }

    return authRoute;
  };

  const redirectUrl = getRedirectUrl();

  return <Redirect to={redirectUrl} />;
};
