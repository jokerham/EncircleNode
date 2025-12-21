import React from 'react';
import type { FormikProps } from 'formik';
import type { FieldConfig } from './types';
import TextFieldComponent from './styles/default/TextFieldComponent';
import SelectFieldComponent from './styles/default/SelectFieldComponent';
import CheckboxFieldComponent from './styles/default/CheckBoxComponent';
import RadioFieldComponent from './styles/default/RadioFieldComponent';
import DateFieldComponent from './styles/default/DateFieldComponent';
import TimeFieldComponent from './styles/default/TimeFieldConfig';
import FileUploadComponent from './styles/default/FileUploadComponent';
import CustomFieldComponent from './styles/default/CustomFieldComponent';

// ==================== FIELD RENDERER ====================
const FieldRenderer: React.FC<{
  field: FieldConfig;
  formikProps: FormikProps<Record<string, unknown>>;
}> = ({ field, formikProps }) => {
  switch (field.type) {
    case 'text':
      return <TextFieldComponent field={field} formikProps={formikProps} />;
    case 'select':
      return <SelectFieldComponent field={field} formikProps={formikProps} />;
    case 'checkbox':
      return <CheckboxFieldComponent field={field} formikProps={formikProps} />;
    case 'radio':
      return <RadioFieldComponent field={field} formikProps={formikProps} />;
    case 'date':
      return <DateFieldComponent field={field} formikProps={formikProps} />;
    case 'time':
      return <TimeFieldComponent field={field} formikProps={formikProps} />;
    case 'file':
      return <FileUploadComponent field={field} formikProps={formikProps} />;
    case 'custom':
      return <CustomFieldComponent field={field} formikProps={formikProps} />;
    default:
      return null;
  }
};

export default FieldRenderer;