import React from 'react';
import { Button, Table, useModal } from '@gpn-prototypes/vega-ui';

import { cnProjectForm } from '../../cn-form';

import { ParticipantForm } from './ParticipantForm';

type StepProps = Record<string, unknown>;

export const ParticipantStep: React.FC<StepProps> = () => {
  const columns = [
    { title: 'Имя', accessor: 'name' },
    { title: 'Роль', accessor: 'role' },
  ];

  const { isOpen, close, open } = useModal();

  const rows = [{ id: '1', name: 'Иван', role: 'Админ' }];

  const handleSubmit = (values: unknown) => {
    console.log(values);
  };

  return (
    <div className={cnProjectForm('Step')}>
      <div>
        <Button type="button" label="+ Добавить участника" view="ghost" onClick={open} />
        <ParticipantForm isOpen={isOpen} onClose={close} onSubmit={handleSubmit} />
      </div>
      <Table columns={columns} rows={rows} />
    </div>
  );
};
