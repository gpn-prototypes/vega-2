import { CreateProjectVariables } from '../../../../pages/project/__generated__/project';
import { ReferenceDataType } from '../../../../pages/project/types';

export type FormMode = 'create' | 'edit';

export type FormValues = {
  description: {
    name: string;
    region: string;
    type: string;
    coordinates: string;
    description: string;
  };
};

export type FormProps = {
  mode: FormMode;
  referenceData: ReferenceDataType;
  initialValues?: FormValues;
  onSubmit: (values: CreateProjectVariables) => void;
};
