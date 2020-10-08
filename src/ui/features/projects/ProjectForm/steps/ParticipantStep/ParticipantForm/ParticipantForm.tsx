import React from 'react';
import { Field, Form } from 'react-final-form';
import { Button, Form as VegaForm, Modal, Text, TextField } from '@gpn-prototypes/vega-ui';

type FormValues = {
  user: string;
  roles: string;
};

type ParticipantProps = {
  isOpen: boolean;
  onClose: VoidFunction;
  onSubmit: (values: FormValues) => void;
};

export const ParticipantForm: React.FC<ParticipantProps> = (props) => {
  const { onClose, isOpen } = props;

  const onSubmit = (values: FormValues) => {
    props.onSubmit(values);
  };

  return (
    <Modal hasOverlay hasCloseButton onClose={onClose} isOpen={isOpen}>
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
                          <TextField
                            id="name"
                            size="s"
                            width="full"
                            placeholder="Пользователь"
                            name={input.name}
                            value={input.value}
                            onChange={({ e }): void => input.onChange(e)}
                            onBlur={input.onBlur}
                            onFocus={input.onFocus}
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
                          <TextField
                            id="roles"
                            size="s"
                            width="full"
                            placeholder="Доступ"
                            name={input.name}
                            value={input.value}
                            onChange={({ e }): void => input.onChange(e)}
                            onBlur={input.onBlur}
                            onFocus={input.onFocus}
                          />
                        )}
                      />
                    </VegaForm.Field>
                  </VegaForm.Row>
                </VegaForm>
              </Modal.Body>

              <Modal.Footer>
                <Button
                  size="m"
                  view="primary"
                  label="Пригласить в проект"
                  onClick={handleSubmit}
                />
                <Button size="m" view="ghost" label="Отмена" onClick={onClose} />
              </Modal.Footer>
            </>
          );
        }}
      />
    </Modal>
  );
};
