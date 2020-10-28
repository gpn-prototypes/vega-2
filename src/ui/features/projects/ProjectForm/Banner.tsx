import React from 'react';
import { useFormState } from 'react-final-form';
import { PageBanner } from '@gpn-prototypes/vega-ui';

export const Banner: React.FC = () => {
  const state = useFormState();

  const { values } = state;
  const title = values.description ? values.description.name : undefined;
  const description = values.description ? values.description.region : undefined;

  return <PageBanner title={title} description={description} />;
};
