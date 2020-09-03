import React from 'react';
import { Informer } from '@gpn-prototypes/vega-ui';

import { cnProjectForm } from '../cn-form';

type StepProps = {};

export const ParticipantStep: React.FC<StepProps> = () => {
  return (
    <div className={cnProjectForm('Step')}>
      <Informer
        className={cnProjectForm('Informer').toString()}
        status="warning"
        label={`Здесь ведутся работы над формой "Участники"`}
      />
    </div>
  );
};
