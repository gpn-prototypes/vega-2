import React, { useEffect, useState } from 'react';
import { Form, FormSpy } from 'react-final-form';
import {
  Button,
  Form as VegaForm,
  IconBackward,
  IconForward,
  NavigationList,
  PageFooter,
} from '@gpn-prototypes/vega-ui';

import {
  CreateProjectMutationVariables,
  GetProjectCreateDataQueryHookResult,
} from '../../../../generated/graphql';
import { DataLayout } from '../../../../layouts/DataLayout';
import { BannerInfoProps } from '../../../../pages/create-project/types';
import { createValidate, validators } from '../../../forms/validation';

import { cnProjectForm } from './cn-form';
import { DescriptionStep, DocumentStep, ParticipantStep, StepProps } from './steps';

import './ProjectForm.css';

type FormProps = {
  bannerInfo: BannerInfoProps;
  setBannerInfo: React.Dispatch<React.SetStateAction<BannerInfoProps>>;
  onSubmit: (values: CreateProjectMutationVariables) => void;
  projectCreateData: GetProjectCreateDataQueryHookResult;
};

export type FormValues = {
  name: string;
  region: string;
  type: string;
  coordinates: string;
  description: string;
};

type Step = {
  title: string;
  content: React.FC<StepProps>;
  fields: string[];
};

const steps: Step[] = [
  {
    title: 'Описание проекта',
    content: DescriptionStep,
    fields: ['name', 'description', 'type', 'coordinateSystem', 'region'],
  },
  { title: 'Участники', content: ParticipantStep, fields: [] },
  { title: 'Связанные документы и файлы', content: DocumentStep, fields: [] },
];

const validator = createValidate<Partial<FormValues>>({
  name: [validators.required()],
});

export const ProjectForm: React.FC<FormProps> = (formProps) => {
  const { bannerInfo, setBannerInfo, onSubmit: onSubmitForm, projectCreateData } = formProps;

  const { loading, data, error } = projectCreateData;

  const [hasSubmitAttempt, setSubmitAttempt] = useState(false);

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const validate = (values: FormValues): ReturnType<typeof validator> => {
    const errors = validator(values);

    return errors;
  };

  useEffect(() => {
    if (data?.regionList && data.regionList[0]) {
      setBannerInfo({
        ...bannerInfo,
        description: data.regionList[0].name?.toString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onSubmit = (values: Partial<FormValues>): void => {
    if (data?.coordinateSystemList && data.regionList && values.name) {
      onSubmitForm({
        name: values.name,
        description: values.description,
        type: values.type,
        coordinateSystem: data.coordinateSystemList[0]?.vid,
        region: data.regionList[0]?.vid,
      });
    }
  };

  const handleClickOnSubmit = (values: FormValues): void => {
    const errors = validate(values);
    const errorStepIndex = steps.findIndex((step) => {
      return Object.keys(errors).some((key) => step.fields.includes(key));
    });

    if (errorStepIndex !== -1) {
      setActiveStepIndex(errorStepIndex);
      setSubmitAttempt(true);
    }
  };

  const Step = steps[activeStepIndex].content;
  const isFirstStep = activeStepIndex === 0;
  const isLastStep = activeStepIndex === steps.length - 1;

  const handleNextStep = (): void => {
    setActiveStepIndex(activeStepIndex + 1);
  };

  const handlePrevStep = (): void => {
    setActiveStepIndex(activeStepIndex - 1);
  };

  return (
    <DataLayout data={data} error={error} loading={loading}>
      <Form
        validate={validate}
        onSubmit={onSubmit}
        render={({ handleSubmit, values: formValues }): React.ReactNode => (
          <VegaForm noValidate onSubmit={handleSubmit} className={cnProjectForm()}>
            <div className={cnProjectForm('Content')}>
              <NavigationList className={cnProjectForm('Navigation')} ordered>
                {steps.map(({ title }, index) => (
                  <NavigationList.Item key={title} active={index === activeStepIndex}>
                    {(props): React.ReactNode => (
                      <button
                        type="button"
                        onClick={(): void => setActiveStepIndex(index)}
                        {...props}
                      >
                        {title}
                      </button>
                    )}
                  </NavigationList.Item>
                ))}
              </NavigationList>
              <Step data={data} hasSubmitAttempt={hasSubmitAttempt} />
            </div>
            <PageFooter className={cnProjectForm('Footer')}>
              <Button size="s" view="ghost" label="Отмена" type="button" />
              <div className={cnProjectForm('Footer-buttons-block')}>
                {!isFirstStep && (
                  <Button
                    size="s"
                    view="ghost"
                    label="Назад"
                    iconLeft={IconBackward}
                    type="button"
                    onClick={handlePrevStep}
                  />
                )}
                {!isLastStep && (
                  <Button
                    size="s"
                    view="primary"
                    label="Далее"
                    iconRight={IconForward}
                    type="button"
                    className={cnProjectForm('Footer-rightmost-button').toString()}
                    onClick={handleNextStep}
                  />
                )}
                {isLastStep && (
                  <Button
                    size="s"
                    view="primary"
                    label="Создать проект"
                    type="submit"
                    onClick={(): void => handleClickOnSubmit(formValues)}
                    className={cnProjectForm('Footer-rightmost-button').toString()}
                  />
                )}
              </div>
            </PageFooter>
            <FormSpy
              subscription={{ values: true }}
              onChange={(formState): void => {
                const { values } = formState;
                if (values.name !== bannerInfo.title) {
                  setBannerInfo({
                    ...bannerInfo,
                    title: values.name,
                  });
                }
              }}
            />
          </VegaForm>
        )}
      />
    </DataLayout>
  );
};
