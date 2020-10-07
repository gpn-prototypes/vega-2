import React from 'react';
import { Table } from '@gpn-prototypes/vega-ui';

import { cnProjectForm } from '../../cn-form';

type StepProps = Record<string, unknown>;

export const ParticipantStep: React.FC<StepProps> = () => {
  const columns = [
    { title: 'Имя', accessor: 'name' },
    { title: 'Роль', accessor: 'role' },
  ];

  const rows = [{ id: '1', name: 'Иван', role: 'Админ' }];

  return (
    <div className={cnProjectForm('Step')}>
      <Table columns={columns} rows={rows} />
    </div>
  );
};
