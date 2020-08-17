import React from 'react';
import { Field } from 'react-final-form';
import { Form as VegaForm, TextField } from '@gpn-prototypes/vega-ui';

import { cnDescriptionStep, cnProjectForm } from '../cn-form';

type StepProps = {};

export const DescriptionStep: React.FC<StepProps> = () => {
  return (
    <div className={cnProjectForm('Step').mix(cnDescriptionStep())}>
      <VegaForm.Row space="m">
        <VegaForm.Field>
          <VegaForm.Label htmlFor="name" space="2xs">
            Название проекта
          </VegaForm.Label>
          <Field
            name="name"
            render={({ input }): React.ReactNode => (
              <TextField
                id="name"
                size="s"
                width="full"
                placeholder="Придумайте название проекта"
                name={input.name}
                value={input.value}
                /* onChange из TextField возвращает не стандартный формат: e, id, name, value  */
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
                onBlur={input.onBlur}
                onFocus={input.onFocus}
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
                onBlur={input.onBlur}
                onFocus={input.onFocus}
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
                onBlur={input.onBlur}
                onFocus={input.onFocus}
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
                maxRows={9}
                size="s"
                width="full"
                placeholder="Краткое описание проекта поможет отличать ваши проекты среди остальных и находить похожие"
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
    </div>
  );
};
