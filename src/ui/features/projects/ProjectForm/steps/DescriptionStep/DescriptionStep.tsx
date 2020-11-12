import React from 'react';
import { Field } from 'react-final-form';
import { Combobox } from '@consta/uikit/Combobox';
import { Form as VegaForm, TextField } from '@gpn-prototypes/vega-ui';

import { ProjectTypeEnum } from '../../../../../../__generated__/types';
import { ReferenceDataType } from '../../../../../../pages/project/types';
import { cnDescriptionStep, cnProjectForm } from '../../cn-form';

type SelectOption = {
  label: string;
  value: string | number;
};

type StepProps = {
  referenceData: ReferenceDataType;
};

const typeOptions = [{ label: 'Геологоразведочный', value: ProjectTypeEnum.Geo }];

export const DescriptionStep: React.FC<StepProps> = (props) => {
  const { referenceData } = props;
  const { regionList } = referenceData;

  const regionOptions =
    regionList?.map((region) => ({
      label: region?.name || '',
      value: region?.vid || '',
    })) || [];

  const yearStartOptions = [
    { label: '2019', value: 2019 },
    { label: '2020', value: 2020 },
    { label: '2021', value: 2021 },
    { label: '2022', value: 2022 },
    { label: '2023', value: 2023 },
    { label: '2024', value: 2024 },
    { label: '2025', value: 2025 },
  ];

  const getItemLabel = (option: SelectOption): string => option.label;

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
                name={input.name}
                placeholder="Придумайте название проекта"
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
          <VegaForm.Label htmlFor="region" space="2xs">
            Регион
          </VegaForm.Label>
          <Field
            name="description.region"
            render={({ input }): React.ReactNode => (
              <Combobox
                id="region"
                size="s"
                options={regionOptions}
                getOptionLabel={getItemLabel}
                placeholder="Выберите регион"
                value={regionOptions.find(({ value }) => value === input.value)}
                onChange={(value: SelectOption | null): void => {
                  input.onChange(value?.value);
                }}
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
            initialValue={typeOptions[0].value}
            render={({ input }): React.ReactNode => (
              <Combobox
                id="type"
                size="s"
                options={typeOptions}
                getOptionLabel={getItemLabel}
                placeholder="Выберите тип проекта"
                disabled
                value={typeOptions.find(({ value }) => value === input.value)}
                onChange={(value: SelectOption | null): void => {
                  input.onChange(value?.value);
                }}
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
          <VegaForm.Label htmlFor="yearStart" space="2xs">
            Год начала планирования
          </VegaForm.Label>
          <Field
            name="description.yearStart"
            initialValue={yearStartOptions[2].value}
            render={({ input }): React.ReactNode => (
              <Combobox
                id="yearStart"
                size="s"
                options={yearStartOptions}
                getOptionLabel={getItemLabel}
                value={yearStartOptions.find(({ value }) => value === input.value)}
                onChange={(value: SelectOption | null): void => {
                  input.onChange(value?.value);
                }}
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
