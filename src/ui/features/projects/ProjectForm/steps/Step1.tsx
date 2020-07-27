import React from 'react';
import { Field } from 'react-final-form';
import { Form as VegaForm, TextField } from '@gpn-prototypes/vega-ui';

type StepProps = {};

export const Step1: React.FC<StepProps> = () => {
  return (
    <>
      <VegaForm.Row space="m">
        <VegaForm.Field>
          <VegaForm.Label htmlFor="name" space="2xs">
            Название проекта
          </VegaForm.Label>
          <Field
            name="name"
            render={({ input }): React.ReactNode => (
              <>
                <TextField
                  id="name"
                  size="s"
                  width="full"
                  placeholder="Придумайте название проекта"
                  name={input.name}
                  value={input.value}
                  /* onChange из TextField возвращает не стандартный формат: e, id, name, value  */
                  onChange={({ e }): void => input.onChange(e)}
                  /*
                    TextField ожидает функцию (event: React.FocusEvent<Element>) => void
                    input.onBlur имеет формат (event?: React.FocusEvent<HTMLElement> | undefined) => void
                    как итог, ошибка: Type 'FocusEvent<Element>' is not assignable to type 'FocusEvent<HTMLElement>'
                  */
                  onBlur={input.onBlur as React.FocusEventHandler}
                  onFocus={input.onFocus as React.FocusEventHandler}
                />
              </>
            )}
          />
        </VegaForm.Field>
      </VegaForm.Row>
      <VegaForm.Row space="m">
        <VegaForm.Field>
          <VegaForm.Label htmlFor="region" space="2xs">
            Регион
          </VegaForm.Label>
          <Field
            name="region"
            render={({ input }): React.ReactNode => (
              <TextField
                id="region"
                size="s"
                width="full"
                placeholder="Выберите регион"
                name={input.name}
                value={input.value}
                onChange={({ e }): void => input.onChange(e)}
                onBlur={input.onBlur as React.FocusEventHandler}
                onFocus={input.onFocus as React.FocusEventHandler}
              />
            )}
          />
        </VegaForm.Field>
      </VegaForm.Row>
      <VegaForm.Row space="m">
        <VegaForm.Field>
          <VegaForm.Label htmlFor="type" space="2xs">
            Тип проекта
          </VegaForm.Label>
          <Field
            name="type"
            render={({ input }): React.ReactNode => (
              <TextField
                id="type"
                size="s"
                width="full"
                placeholder="Выберите тип проекта"
                name={input.name}
                value={input.value}
                onChange={({ e }): void => input.onChange(e)}
                onBlur={input.onBlur as React.FocusEventHandler}
                onFocus={input.onFocus as React.FocusEventHandler}
              />
            )}
          />
        </VegaForm.Field>
      </VegaForm.Row>
      <VegaForm.Row space="m">
        <VegaForm.Field>
          <VegaForm.Label htmlFor="coordinates" space="2xs">
            Координаты
          </VegaForm.Label>
          <Field
            name="coordinates"
            render={({ input }): React.ReactNode => (
              <TextField
                id="coordinates"
                size="s"
                width="full"
                placeholder="Укажите значения и систему координат"
                name={input.name}
                value={input.value}
                onChange={({ e }): void => input.onChange(e)}
                onBlur={input.onBlur as React.FocusEventHandler}
                onFocus={input.onFocus as React.FocusEventHandler}
              />
            )}
          />
        </VegaForm.Field>
      </VegaForm.Row>
      <VegaForm.Row space="m">
        <VegaForm.Field>
          <VegaForm.Label htmlFor="description" space="2xs">
            Описание проекта
          </VegaForm.Label>
          <Field
            name="description"
            render={({ input }): React.ReactNode => (
              <TextField
                id="description"
                type="textarea"
                minRows={3}
                size="s"
                width="full"
                placeholder="Краткое описание проекта поможет отличать ваши проекты среди остальных и находить похожие"
                name={input.name}
                value={input.value}
                onChange={({ e }): void => input.onChange(e)}
                onBlur={input.onBlur as React.FocusEventHandler}
                onFocus={input.onFocus as React.FocusEventHandler}
              />
            )}
          />
        </VegaForm.Field>
      </VegaForm.Row>
    </>
  );
};
