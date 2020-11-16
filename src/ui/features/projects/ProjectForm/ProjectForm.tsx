import React, { useState } from 'react';
import { Form } from 'react-final-form';
import { useHistory } from 'react-router-dom';
import { Form as VegaForm, NavigationList } from '@gpn-prototypes/vega-ui';

import { Banner } from './Banner';
import { cnProjectForm } from './cn-form';
import { Footer } from './Footer';
import { DescriptionStep } from './steps';
import { FormProps, FormValues } from './types';

import './ProjectForm.css';

const steps = [{ title: 'Описание проекта', content: DescriptionStep }];

export const ProjectForm: React.FC<FormProps> = (formProps) => {
  const { mode, initialValues, referenceData, onSubmit } = formProps;

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const history = useHistory();

  const handleFormSubmit = (values: FormValues): void => {
    onSubmit(values);
  };

  const handleStepChange = (step: number) => {
    setActiveStepIndex(step);
  };

  const handleCancel = () => {
    history.push('/projects');
  };

  const Step = steps[activeStepIndex].content;

  return (
    <Form
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      render={({ handleSubmit, dirty, form, values }): React.ReactNode => (
        <>
          <Banner referenceData={referenceData} />
          <VegaForm onSubmit={handleSubmit} className={cnProjectForm()}>
            <div className={cnProjectForm('Content')}>
              <NavigationList className={cnProjectForm('Navigation')}>
                {steps.map(({ title }, index) => (
                  <NavigationList.Item key={title}>
                    {(props): React.ReactNode => (
                      <button
                        type="button"
                        onClick={(): void => setActiveStepIndex(index)}
                        className={cnProjectForm('NavigationButton').mix(props.className)}
                      >
                        {title}
                      </button>
                    )}
                  </NavigationList.Item>
                ))}
              </NavigationList>
              <Step mode={mode} referenceData={referenceData} />
            </div>
            <Footer
              mode={mode}
              isFormDirty={dirty}
              activeStep={activeStepIndex}
              stepsAmount={steps.length}
              onStepChange={handleStepChange}
              onCancel={() => {
                if (mode === 'create') {
                  handleCancel();
                } else {
                  form.reset();
                }
              }}
            />
            <pre>{JSON.stringify(values, null, 2)}</pre>
          </VegaForm>
        </>
      )}
    />
  );
};
