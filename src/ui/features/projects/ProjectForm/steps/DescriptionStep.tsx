import React from 'react';
import { Field } from 'react-final-form';
import { Form as VegaForm, TextField as VegaTextField } from '@gpn-prototypes/vega-ui';
import { GetProjectCreateDataQuery } from '@vega/generated/graphql';

import { TextField } from '../../../../core';
import { cnDescriptionStep, cnProjectForm } from '../cn-form';

export type StepProps = {
  data?: GetProjectCreateDataQuery;
  hasSubmitAttempt?: boolean;
};

export const DescriptionStep: React.FC<StepProps> = (props) => {
  const { data = {}, hasSubmitAttempt } = props;

  const { regionList, coordinateSystemList } = data;

  return (
    <div className={cnProjectForm('Step').mix(cnDescriptionStep())}>
      <VegaForm.Row space="m">
        <VegaForm.Field>
          <VegaForm.Label htmlFor="name" space="2xs">
            Название проекта
          </VegaForm.Label>
          <TextField
            name="name"
            id="name"
            size="s"
            width="full"
            placeholder="Придумайте название проекта"
            validateOnTouched
            permanentValidation={hasSubmitAttempt}
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
              <VegaTextField
                id="region"
                size="s"
                width="full"
                disabled
                placeholder="Выберите регион"
                name={input.name}
                value={regionList && regionList[0]?.name}
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
              <VegaTextField
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
              <VegaTextField
                id="coordinates"
                size="s"
                disabled
                width="full"
                placeholder="Укажите значения и систему координат"
                name={input.name}
                value={coordinateSystemList && coordinateSystemList[0]?.name}
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
              <VegaTextField
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
