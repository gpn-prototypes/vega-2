import React from 'react';
import { Field } from 'react-final-form';
import { BasicSelect, Combobox, Form as VegaForm, TextField } from '@gpn-prototypes/vega-ui';

import { ProjectTypeEnum } from '../../../../../../__generated__/types';
import { ReferenceDataType } from '../../../../../../pages/project/types';
import { cnDescriptionStep, cnProjectForm } from '../../cn-form';
import { FormMode } from '../../types';

type SelectOption = {
  label: string;
  value: string | number;
};

type StepProps = {
  mode: FormMode;
  referenceData: ReferenceDataType;
};

const typeOptions = [{ label: 'Геологоразведочный', value: ProjectTypeEnum.Geo }];

const getYearStartOptions = (): SelectOption[] => {
  const currentYear = new Date().getFullYear();
  const options = [];

  for (let i = -1; i < 6; i += 1) {
    const year = currentYear + i;
    const option = {
      label: `${year}`,
      value: year,
    };

    options.push(option);
  }

  return options;
};

const defaultOptions = [{ label: 'Не выбрано', value: 'NOT_SELECTED' }];

export const DescriptionStep: React.FC<StepProps> = (props) => {
  const { mode, referenceData } = props;
  const { regionList } = referenceData;

  const regionOptions = regionList
    ? defaultOptions.concat(
        regionList?.map((region) => ({
          label: region?.name || '',
          value: region?.vid || '',
        })),
      )
    : [];

  const yearStartOptions = getYearStartOptions();

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
              <BasicSelect
                id="region"
                size="s"
                options={regionOptions}
                getOptionLabel={getItemLabel}
                placeholder="Выберите регион"
                value={regionOptions.find(({ value }) => value === input.value)}
                // @ts-expect-error: Ошибка реэкспорта оболочки, исправить в vega-ui TODO
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
                // @ts-expect-error: Ошибка реэкспорта оболочки, исправить в vega-ui TODO
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
            initialValue={mode === 'create' && yearStartOptions[2].value}
            render={({ input }): React.ReactNode => (
              <BasicSelect
                id="yearStart"
                size="s"
                options={yearStartOptions}
                getOptionLabel={getItemLabel}
                placeholder="Выберите год"
                value={yearStartOptions.find(({ value }) => value === input.value)}
                // @ts-expect-error: Ошибка реэкспорта оболочки, исправить в vega-ui TODO
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
