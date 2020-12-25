import React from 'react';
import { Avatar, Button, Table, Text, useModal } from '@gpn-prototypes/vega-ui';

import { cnProjectForm } from '../../cn-form';

import { cnParticipantStep } from './cn-participant-step';
import { ParticipantForm } from './ParticipantForm';

import './ParticipantStep.css';

type StepProps = Record<string, unknown>;

const cn = {
  root: cnParticipantStep().toString(),
  table: cnParticipantStep('table').toString(),
  footer: cnParticipantStep('footer').toString(),
  rowName: cnParticipantStep('rowName').toString(),
  rowAvatar: cnParticipantStep('rowAvatar').toString(),
};

const testId = {
  addUser: 'ParticipantStep:button:addUser',
};

export const ParticipantStep: React.FC<StepProps> = () => {
  const columns = [
    { title: 'Имя', accessor: 'name' },
    { title: 'Роль', accessor: 'role', width: 252 },
  ];

  const { isOpen, close, open } = useModal();

  const rows = [
    {
      id: '1',
      name: (
        <div className={cn.rowName}>
          <div className={cn.rowAvatar}>
            <Avatar size="s" name="Иван Иванов И." />
          </div>
          <Text size="s">Иван Иванов И.</Text>
        </div>
      ),
      role: <Text size="s">Геолог</Text>,
    },
  ];

  const handleSubmit = (values: unknown) => {
    // eslint-disable-next-line no-console
    console.log(values);
  };

  return (
    <div className={cnProjectForm('Step')}>
      <div className={cn.root}>
        <Table columns={columns} rows={rows} className={cn.table} verticalAlign="center" />
        <div className={cn.footer}>
          <Button
            type="button"
            label="+ Добавить участника"
            view="ghost"
            onClick={open}
            data-testid={testId.addUser}
          />
          <ParticipantForm isOpen={isOpen} onClose={close} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};
