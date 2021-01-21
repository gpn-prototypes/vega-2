import React from 'react';
import { Field, Form } from 'react-final-form';
import {
  Button,
  Combobox,
  Form as VegaForm,
  Modal,
  MultiCombobox,
  Text,
} from '@gpn-prototypes/vega-ui';

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

const testId = {
  modal: 'ParticipantStep:modal',
  modalForm: 'ParticipantStep:modal:form',
  userLabel: 'ParticipantStep:label:user',
  user: 'ParticipantStep:field:user',
  rolesLabel: 'ParticipantStep:label:roles',
  roles: 'ParticipantStep:field:roles',
  buttonInvite: 'ParticipantStep:button:invite',
  buttonCancel: 'ParticipantStep:button:cancel',
};

export const ParticipantForm: React.FC<ParticipantProps> = (props) => {
  const { onClose, isOpen } = props;

  const onSubmit = (values: FormValues) => {
    props.onSubmit(values);
  };

  return (
    <Modal
      hasOverlay
      hasCloseButton
      onClose={onClose}
      isOpen={isOpen}
      className={cn.root}
      data-test={testId.modal}
    >
      <Modal.Header>
        <Text size="xs">Добавить участника</Text>
      </Modal.Header>

      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }): React.ReactNode => {
          return (
            <>
              <Modal.Body>
                <VegaForm data-testid={testId.modalForm}>
                  <VegaForm.Row space="m">
                    <VegaForm.Field>
                      <VegaForm.Label htmlFor="user" space="2xs" data-testid={testId.userLabel}>
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
                            data-testid={testId.user}
                          />
                        )}
                      />
                    </VegaForm.Field>
                  </VegaForm.Row>
                  <VegaForm.Row space="m">
                    <VegaForm.Field>
                      <VegaForm.Label htmlFor="roles" space="2xs" data-testid={testId.rolesLabel}>
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
                            data-testid={testId.roles}
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
                  data-testid={testId.buttonInvite}
                />
                <Button
                  size="m"
                  view="ghost"
                  label="Отмена"
                  onClick={onClose}
                  className={cn.footerItem}
                  data-testId={testId.buttonCancel}
                />
              </Modal.Footer>
            </>
          );
        }}
      />
    </Modal>
  );
};
