import { FormApi } from 'final-form';

import { ProjectTypeEnum } from '../../../../__generated__/types';
import { ReferenceDataType } from '../../../../pages/project/types';

export type FormMode = 'create' | 'edit';

export type FormValues = {
  name: string;
  region: string | null;
  type: ProjectTypeEnum;
  coordinates: string;
  yearStart: number;
  description: string;
};

export type FormProps = {
  mode: FormMode;
  initialValues?: Partial<FormValues>;
  referenceData: ReferenceDataType;
  onCancel?: (formApi: FormApi<FormValues>) => void;
  onSubmit: (values: FormValues, api: FormApi<FormValues>) => void;
};
