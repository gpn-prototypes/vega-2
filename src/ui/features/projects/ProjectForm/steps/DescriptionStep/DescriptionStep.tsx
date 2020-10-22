import React from 'react';
import { Field } from 'react-final-form';
import { Form as VegaForm, TextField } from '@gpn-prototypes/vega-ui';

import { ReferenceDataType } from '../../../../../../pages/create-project/types';
import { cnDescriptionStep, cnProjectForm } from '../../cn-form';

type StepProps = {
  referenceData: ReferenceDataType;
};

export const DescriptionStep: React.FC<StepProps> = (props) => {
  const { referenceData } = props;

  /* Это временное решение */
  /* На данный момент на сервере доступен только один регион */
  /* Поле региона - обычное текстовое поле, его нужно переделать в селектор */
  /* Добавление селектора будет сделано в отдельной задаче */

  let oneExistingRegionName = '';

  if (
    referenceData &&
    referenceData.regionList &&
    Array.isArray(referenceData.regionList) &&
    referenceData.regionList[0]
  ) {
    oneExistingRegionName = referenceData.regionList[0].name
      ? referenceData.regionList[0].name
      : '';
  }

  return (
    <div className={cnProjectForm('Step').mix(cnDescriptionStep())}>
      <VegaForm.Row space="m">
        <VegaForm.Field>
          <VegaForm.Label htmlFor="name" space="2xs">
            Название проекта
          </VegaForm.Label>
          <Field
            name="description.name"
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
            name="description.region"
            render={({ input }): React.ReactNode => (
              <TextField
                id="region"
                size="s"
                width="full"
                disabled
                placeholder="Выберите регион"
                name={input.name}
                value={oneExistingRegionName}
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
            name="description.type"
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
            Система координат
          </VegaForm.Label>
          <Field
            name="description.coordinates"
            render={({ input }): React.ReactNode => (
              <TextField
                id="coordinates"
                size="s"
                width="full"
                placeholder="Укажите систему координат"
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
            name="description.description"
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
