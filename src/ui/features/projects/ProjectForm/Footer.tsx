import React from 'react';
import { Button, IconBackward, IconForward, PageFooter } from '@gpn-prototypes/vega-ui';

import { cnProjectForm } from './cn-form';
import { FormMode } from './types';

export type FooterProps = {
  mode: FormMode;
  isVisibleEdit: boolean;
  activeStep: number;
  stepsAmount: number;
  onStepChange: (step: number) => void;
  onCancel: () => void;
  onCreate: () => void;
};

const testId = {
  footerCreate: 'ProjectForm:footer.create',
  footerEdit: 'ProjectForm:footer.edit',
  cancelCreate: 'ProjectForm:button:cancel.create',
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
  const { mode, activeStep, stepsAmount, onStepChange, onCancel, onCreate, isVisibleEdit } = props;

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

  const createProjectFormFooter = (
    <PageFooter
      className={cnProjectForm('Footer', { content: 'space-between' })}
      data-testid={testId.footerCreate}
    >
      <Button
        size="s"
        view="ghost"
        label="Отмена"
        type="button"
        onClick={onCancel}
        data-testid={testId.cancelCreate}
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
            data-testid={testId.prevStep}
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
            data-testid={testId.nextStep}
          />
        )}
        {isLastStep && (
          <Button
            size="s"
            view="primary"
            label="Создать проект"
            type="submit"
            onClick={onCreate}
            data-testid={testId.createButton}
          />
        )}
      </div>
    </PageFooter>
  );

  const editProjectFromFooter = (
    <PageFooter
      className={cnProjectForm('Footer', { content: 'end' })}
      data-testid={testId.footerEdit}
    >
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

  return (
    <>
      {isCreateMode && createProjectFormFooter}
      {isEditMode && isVisibleEdit && editProjectFromFooter}
    </>
  );
};

Footer.testId = testId;
