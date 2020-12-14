import React, { useState } from 'react';
import { Field } from 'react-final-form';
import { Combobox, Form as VegaForm, Text, TextField } from '@gpn-prototypes/vega-ui';

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
const typeInitialValue = typeOptions[0].value;

const getYearStartOptions = (): SelectOption[] => {
  const currentYear = new Date().getFullYear();
  const options = [];

  for (let i = -1; i < 11; i += 1) {
    const year = currentYear + i;
    const option = {
      label: `${year}`,
      value: year,
    };

    options.push(option);
  }

  return options;
};

const notSelectedOption = { label: 'Не выбрано', value: 'NOT_SELECTED' };

export const DescriptionStep: React.FC<StepProps> = (props) => {
  const { mode, referenceData } = props;
  const { regionList } = referenceData;

  const regionOptions =
    regionList?.map((region) => ({
      label: region?.name || '',
      value: region?.vid || '',
    })) || [];

  const [yearStartOptions, setYearStartOptions] = useState(getYearStartOptions());
  const yearStartInitialValue = mode === 'create' ? yearStartOptions[2].value : undefined;

  const getItemLabel = (option: SelectOption): string => option.label;

  const updateYearStartOptions = (option: string): void => {
    setYearStartOptions([{ label: option, value: option }, ...yearStartOptions]);
  };

  return (
    <div className={cnProjectForm('Step').mix(cnDescriptionStep())}>
      <VegaForm.Row space="m">
        <VegaForm.Field>
          <VegaForm.Label htmlFor="name" space="2xs">
            Название проекта
          </VegaForm.Label>
          <Field
            name="name"
            render={({ input, meta }): React.ReactNode => {
              const showError = meta.error && meta.submitFailed;

              return (
                <>
                  <TextField
                    id="name"
                    size="s"
                    width="full"
                    name={input.name}
                    state={showError ? 'alert' : undefined}
                    placeholder="Придумайте название проекта"
                    autoComplete="off"
                    value={input.value}
                    onChange={({ e }): void => input.onChange(e)}
                    onBlur={input.onBlur}
                    onFocus={input.onFocus}
                  />
                  {showError && (
                    <Text
                      size="xs"
                      lineHeight="xs"
                      view="alert"
                      className={cnDescriptionStep('ErrorText').toString()}
                    >
                      {meta.error}
                    </Text>
                  )}
                </>
              );
            }}
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
              <Combobox
                id="region"
                size="s"
                options={
                  input.value && input.value !== 'NOT_SELECTED'
                    ? [notSelectedOption, ...regionOptions]
                    : regionOptions
                }
                getOptionLabel={getItemLabel}
                placeholder="Выберите регион"
                value={regionOptions.find(({ value }) => value === input.value)}
                onChange={(option: SelectOption | null): void => {
                  let value = null;

                  if (option !== null && option.value !== 'NOT_SELECTED') {
                    value = option.value;
                  }

                  input.onChange(value);
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
            name="type"
            initialValue={typeInitialValue}
            render={({ input }): React.ReactNode => (
              <Combobox
                id="type"
                size="s"
                options={typeOptions}
                getOptionLabel={getItemLabel}
                placeholder="Выберите тип проекта"
                disabled
                value={typeOptions.find(({ value }) => value === input.value)}
                onChange={(value): void => {
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
            name="coordinates"
            allowNull
            parse={(v) => v}
            render={({ input }): React.ReactNode => (
              <TextField
                id="coordinates"
                size="s"
                width="full"
                placeholder="Укажите систему координат"
                autoComplete="off"
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
            name="yearStart"
            initialValue={yearStartInitialValue}
            render={({ input }): React.ReactNode => {
              return (
                <Combobox
                  id="yearStart"
                  size="s"
                  options={yearStartOptions}
                  getOptionLabel={getItemLabel}
                  onCreate={(option) => {
                    updateYearStartOptions(option);
                    input.onChange(option);
                  }}
                  placeholder="Выберите год"
                  value={yearStartOptions.find(({ value }) => value === input.value)}
                  onChange={(value: SelectOption | null): void => {
                    input.onChange(value?.value);
                  }}
                  onBlur={input.onBlur}
                  onFocus={input.onFocus}
                />
              );
            }}
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
            allowNull
            parse={(v) => v}
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
