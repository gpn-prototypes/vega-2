import React from 'react';
import { ApolloError } from '@apollo/client';
import { Loader } from '@gpn-prototypes/vega-ui';

type DataLayoutProps<T> = {
  data: T;
  loading: boolean;
  error?: ApolloError;
  children: React.ReactNode;
  onError?: () => React.ReactElement | null;
  onLoading?: () => React.ReactElement | null;
};

export const DataLayout = <T,>(
  props: React.PropsWithChildren<DataLayoutProps<T>>,
): React.ReactElement | null => {
  const defaultOnLoading = (): React.ReactElement => {
    return <Loader />;
  };

  const defaultOnError = (): null => null;

  const {
    data,
    loading,
    error,
    children,
    onError = defaultOnError,
    onLoading = defaultOnLoading,
  } = props;

  if (loading) {
    return onLoading();
  }

  if (error && !data) {
    return onError();
  }

  return <>{children}</>;
};
