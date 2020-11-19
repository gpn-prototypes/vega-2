import { ProjectTypeEnum } from '../../../../__generated__/types';
import { ReferenceDataType } from '../../../../pages/project/types';

export type FormMode = 'create' | 'edit';

export type FormValues = {
  name?: string;
  region?: string;
  type?: ProjectTypeEnum;
  coordinates?: string;
  yearStart?: number;
  description?: string;
};

export type FormProps = {
  mode: FormMode;
  initialValues?: FormValues;
  referenceData: ReferenceDataType;
  onSubmit: (values: FormValues) => void;
};
