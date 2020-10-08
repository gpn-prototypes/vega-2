import React from 'react';
import { Field, Form } from 'react-final-form';
import { Combobox } from '@consta/uikit/Combobox';
import { MultiCombobox } from '@consta/uikit/MultiCombobox';
import { Button, Form as VegaForm, Modal, Text } from '@gpn-prototypes/vega-ui';

import { cnParticipantForm } from './cn-participant-form';

import './ParticipantForm.css';

type FormValues = {
  user: string;
  roles: string;
};

type ParticipantProps = {
  isOpen: boolean;
  onClose: VoidFunction;
  onSubmit: (values: FormValues) => void;
};

type SelectOption = {
  label: string;
  value: string;
};

const cn = {
  root: cnParticipantForm().toString(),
  footer: cnParticipantForm('footer').toString(),
  footerItem: cnParticipantForm('footerItem').toString(),
};

const roles = [
  { label: 'Геолог', value: '1' },
  { label: 'Менеджер', value: '2' },
  { label: 'Геолог', value: '3' },
  { label: 'Менеджер', value: '4' },
];

const users = [
  { label: 'Иванов Иван', value: '1' },
  { label: 'Васильев Василий', value: '2' },
];

const getItemLabel = (option: SelectOption): string => option.label;

export const ParticipantForm: React.FC<ParticipantProps> = (props) => {
  const { onClose, isOpen } = props;

  const onSubmit = (values: FormValues) => {
    props.onSubmit(values);
  };

  return (
    <Modal hasOverlay hasCloseButton onClose={onClose} isOpen={isOpen} className={cn.root}>
      <Modal.Header>
        <Text size="xs">Добавить участника</Text>
      </Modal.Header>

      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }): React.ReactNode => {
          return (
            <>
              <Modal.Body>
                <VegaForm>
                  <VegaForm.Row space="m">
                    <VegaForm.Field>
                      <VegaForm.Label htmlFor="user" space="2xs">
                        Пользователь
                      </VegaForm.Label>
                      <Field
                        name="user"
                        render={({ input }): React.ReactNode => (
                          <Combobox
                            id="user"
                            options={users}
                            getOptionLabel={getItemLabel}
                            placeholder="Пользователь"
                            onChange={(value: SelectOption | null): void => {
                              input.onChange(value);
                            }}
                          />
                        )}
                      />
                    </VegaForm.Field>
                  </VegaForm.Row>
                  <VegaForm.Row space="m">
                    <VegaForm.Field>
                      <VegaForm.Label htmlFor="roles" space="2xs">
                        Доступ
                      </VegaForm.Label>
                      <Field
                        name="roles"
                        render={({ input }): React.ReactNode => (
                          <MultiCombobox
                            id="roles"
                            options={roles}
                            getOptionLabel={getItemLabel}
                            placeholder="Доступ"
                            onChange={(value: SelectOption[] | null): void => {
                              input.onChange(value);
                            }}
                          />
                        )}
                      />
                    </VegaForm.Field>
                  </VegaForm.Row>
                </VegaForm>
              </Modal.Body>

              <Modal.Footer className={cn.footer}>
                <Button
                  size="m"
                  view="primary"
                  label="Пригласить в проект"
                  onClick={handleSubmit}
                  className={cn.footerItem}
                />
                <Button
                  size="m"
                  view="ghost"
                  label="Отмена"
                  onClick={onClose}
                  className={cn.footerItem}
                />
              </Modal.Footer>
            </>
          );
        }}
      />
    </Modal>
  );
};
