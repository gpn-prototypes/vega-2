import React, { useState } from 'react';
import { Form } from 'react-final-form';
import { useHistory } from 'react-router-dom';
import { Form as VegaForm, NavigationList } from '@gpn-prototypes/vega-ui';

import { Banner } from './Banner';
import { cnProjectForm } from './cn-form';
import { Footer } from './Footer';
import { DescriptionStep, DocumentStep, ParticipantStep } from './steps';
import { FormProps, FormValues } from './types';

import './ProjectForm.css';

const steps = [
  { title: 'Описание проекта', content: DescriptionStep },
  { title: 'Участники', content: ParticipantStep },
  { title: 'Связанные документы и файлы', content: DocumentStep },
];

export const ProjectForm: React.FC<FormProps> = (formProps) => {
  const { mode, referenceData, initialValues, onSubmit } = formProps;

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const history = useHistory();

  /* смотрите комментарий к oneExistingRegion в DescriptionStep */

  let oneExistingRegionId: string | undefined;

  if (
    referenceData &&
    referenceData.regionList &&
    Array.isArray(referenceData.regionList) &&
    referenceData.regionList[0]
  ) {
    oneExistingRegionId = referenceData.regionList[0].vid ? referenceData.regionList[0].vid : '';
  }

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

  const handleStepChange = (step: number) => {
    setActiveStepIndex(step);
  };

  const handleCancel = () => {
    history.push('/projects');
  };

  return (
    <Form
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      render={({ handleSubmit, dirty }): React.ReactNode => (
        <>
          <Banner />
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
            <Footer
              mode={mode}
              activeStep={activeStepIndex}
              stepsAmount={steps.length}
              isFormDirty={dirty}
              onStepChange={handleStepChange}
              onCancel={handleCancel}
            />
          </VegaForm>
        </>
      )}
    />
  );
};
