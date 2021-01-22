import React from 'react';
import { useForm } from 'react-final-form';
import { Button, IconBackward, IconForward, PageFooter } from '@gpn-prototypes/vega-ui';

import { ProjectStatusEnum } from '../../../../__generated__/types';

import { cnProjectForm } from './cn-form';
import { FormMode } from './types';

export type FooterProps = {
  mode: FormMode;
  isFormDirty: boolean;
  activeStep: number;
  stepsAmount: number;
  onStepChange: (step: number) => void;
  onCancel: () => void;
};

const testId = {
  footer: 'ProjectForm:footer',
  cancel: 'ProjectForm:button:cancel',
  cancelEdit: 'ProjectForm:button:cancel.edit',
  saveEdit: 'ProjectForm:button:save.edit',
  nextStep: 'ProjectForm:button:nextStep',
  prevStep: 'ProjectForm:button:prevStep',
  createButton: 'ProjectForm:button:create',
} as const;

type FooterType = React.FC<FooterProps> & {
  testId: typeof testId;
};

export const Footer: FooterType = (props) => {
  const { mode, isFormDirty, activeStep, stepsAmount, onStepChange, onCancel } = props;
  const form = useForm();

  const isCreateMode = mode === 'create';
  const isEditMode = mode === 'edit';
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === stepsAmount - 1;

  const handleNextStep = (): void => {
    onStepChange(activeStep + 1);
  };

  const handlePrevStep = (): void => {
    onStepChange(activeStep - 1);
  };

  const { valid, dirtySinceLastSubmit, hasSubmitErrors, dirty } = form.getState();

  const createProjectFormFooter = (
    <PageFooter
      className={cnProjectForm('Footer', { content: 'space-between' })}
      data-testid={testId.footer}
    >
      <Button
        size="s"
        view="ghost"
        label="Отмена"
        type="button"
        onClick={onCancel}
        data-testid={testId.cancel}
      />
      <div className={cnProjectForm('Footer-buttons-block')}>
        {!isFirstStep && (
          <Button
            size="s"
            view="ghost"
            label="Назад"
            iconLeft={IconBackward}
            type="button"
            className={cnProjectForm('Footer-button-back').toString()}
            onClick={handlePrevStep}
            data-testId={testId.prevStep}
          />
        )}
        {!isLastStep && (
          <Button
            size="s"
            view="primary"
            label="Далее"
            iconRight={IconForward}
            type="button"
            onClick={handleNextStep}
            data-testId={testId.nextStep}
          />
        )}
        {isLastStep && (
          <Button
            size="s"
            view="primary"
            label="Создать проект"
            type="submit"
            onClick={() => {
              form.change('status', ProjectStatusEnum.Unpublished);
            }}
            data-testId={testId.createButton}
          />
        )}
      </div>
    </PageFooter>
  );

  const editProjectFromFooter = (
    <PageFooter className={cnProjectForm('Footer', { content: 'end' })}>
      <Button
        size="s"
        view="ghost"
        label="Отменить"
        type="button"
        className={cnProjectForm('Footer-button-back').toString()}
        onClick={onCancel}
        data-testid={testId.cancelEdit}
      />
      <Button
        size="s"
        view="primary"
        label="Сохранить изменения"
        type="submit"
        data-testid={testId.saveEdit}
      />
    </PageFooter>
  );

  const isEditFormDirty =
    isFormDirty || (!valid && !dirtySinceLastSubmit) || (hasSubmitErrors && dirty);

  return (
    <>
      {isCreateMode && createProjectFormFooter}
      {isEditMode && isEditFormDirty && editProjectFromFooter}
    </>
  );
};

Footer.testId = testId;
