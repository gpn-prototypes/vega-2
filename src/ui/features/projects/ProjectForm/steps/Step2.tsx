import React from 'react';
import { Informer } from '@gpn-prototypes/vega-ui';

import { cnForm } from '../cn-form';

type StepProps = {};

export const Step2: React.FC<StepProps> = () => {
  return (
    <Informer
      className={cnForm('Informer').toString()}
      status="warning"
      label={`Здесь ведутся работы над формой "Участники"`}
    />
  );
};
