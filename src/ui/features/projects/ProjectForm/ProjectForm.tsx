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

import { CreateProjectVariables } from '../../../../pages/create-project/__generated__/create-project';
import { BannerInfoProps, ReferenceDataType } from '../../../../pages/create-project/types';

import { cnProjectForm } from './cn-form';
import { DescriptionStep, DocumentStep, ParticipantStep } from './steps';

import './ProjectForm.css';

type FormProps = {
  bannerInfo: BannerInfoProps;
  setBannerInfo: React.Dispatch<React.SetStateAction<BannerInfoProps>>;
  referenceData: ReferenceDataType;
  onSubmit: (values: CreateProjectVariables) => void;
};

type FormValues = {
  description: {
    name: string;
    region: string;
    type: string;
    coordinates: string;
    description: string;
  };
};

const steps = [
  { title: 'Описание проекта', content: DescriptionStep },
  { title: 'Участники', content: ParticipantStep },
  { title: 'Связанные документы и файлы', content: DocumentStep },
];

export const ProjectForm: React.FC<FormProps> = (formProps) => {
  const { bannerInfo, setBannerInfo, onSubmit, referenceData } = formProps;

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  /* смотрите комментарий к oneExistingRegion в DescriptionStep */

  let oneExistingRegionId: string | undefined;
  let oneExistingRegionName: string | undefined;

  if (
    referenceData &&
    referenceData.regionList &&
    Array.isArray(referenceData.regionList) &&
    referenceData.regionList[0]
  ) {
    oneExistingRegionId = referenceData.regionList[0].vid ? referenceData.regionList[0].vid : '';
    oneExistingRegionName = referenceData.regionList[0].name
      ? referenceData.regionList[0].name
      : '';
  }

  useEffect(() => {
    setBannerInfo({
      ...bannerInfo,
      description: oneExistingRegionName,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oneExistingRegionName]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleFormSubmit = (values: FormValues): void => {
    onSubmit({
      name: values.description.name,
      type: values.description.type,
      region: oneExistingRegionId,
      coordinates: values.description.coordinates,
      description: values.description.description,
    });
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
    <Form
      onSubmit={handleFormSubmit}
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
            <Step referenceData={referenceData} />
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
              const { description = {} } = values;

              if (
                description.name !== bannerInfo.title ||
                description.region !== bannerInfo.description
              ) {
                setBannerInfo({
                  title: description.name,
                  description: description.region,
                });
              }
            }}
          />
        </VegaForm>
      )}
    />
  );
};
