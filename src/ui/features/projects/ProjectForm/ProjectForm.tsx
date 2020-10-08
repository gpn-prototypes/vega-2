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
  useGetProjectCreateDataQuery,
} from '../../../../generated/graphql';
import { DataLayout } from '../../../../layouts/DataLayout';
import { BannerInfoProps } from '../../../../pages/create-project/types';

import { cnProjectForm } from './cn-form';
import { DescriptionStep, DocumentStep, ParticipantStep } from './steps';

import './ProjectForm.css';

type FormProps = {
  bannerInfo: BannerInfoProps;
  setBannerInfo: React.Dispatch<React.SetStateAction<BannerInfoProps>>;
  onSubmit: (values: CreateProjectMutationVariables) => void;
};

export type FormValues = {
  name: string;
  region: string;
  type: string;
  coordinates: string;
  description: string;
};

const steps = [
  { title: 'Описание проекта', content: DescriptionStep },
  { title: 'Участники', content: ParticipantStep },
  { title: 'Связанные документы и файлы', content: DocumentStep },
];

export const ProjectForm: React.FC<FormProps> = (formProps) => {
  const { bannerInfo, setBannerInfo, onSubmit: onSubmitForm } = formProps;

  const { loading, data, error } = useGetProjectCreateDataQuery();

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    if (data?.regionList && data.regionList[0]) {
      setBannerInfo({
        ...bannerInfo,
        description: data.regionList[0].name?.toString(),
      });
    }
  }, [data, bannerInfo, setBannerInfo]);

  const onSubmit = (values: Partial<FormValues>): void => {
    if (!values.name) {
      return;
    }

    if (data?.coordinateSystemList && data.regionList) {
      onSubmitForm({
        name: values.name,
        description: values.description,
        type: values.type,
        coordinateSystem: data.coordinateSystemList[0]?.vid,
        region: data.regionList[0]?.vid,
      });
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
        onSubmit={onSubmit}
        render={({ handleSubmit }): React.ReactNode => (
          <VegaForm onSubmit={handleSubmit} className={cnProjectForm()}>
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
              <Step data={data} />
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
