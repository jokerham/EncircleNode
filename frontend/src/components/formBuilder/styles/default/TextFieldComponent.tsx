import React from 'react';
import { TextField } from '@mui/material';
import type { FormikProps } from 'formik';
import type { TextFieldConfig } from '../../types';

// ==================== TEXT FIELD COMPONENT ====================
const TextFieldComponent: React.FC<{
  field: TextFieldConfig;
  formikProps: FormikProps<Record<string, unknown>>;
}> = ({ field, formikProps }) => {
  const { values, errors, touched, handleChange, handleBlur } = formikProps;
  const hasError = touched[field.name] && Boolean(errors[field.name]);

  return (
    <TextField
      fullWidth
      name={field.name}
      label={field.label}
      placeholder={field.placeholder}
      value={values[field.name] as string || ''}
      onChange={(e) => {
        handleChange(e);
        if (field.onChange) {
          field.onChange(e.target.value, formikProps);
        }
      }}
      onBlur={handleBlur}
      error={hasError}
      helperText={hasError ? String(errors[field.name]) : ''}
      disabled={field.disabled}
      multiline={field.multiline}
      rows={field.rows}
      className={field.className}
      style={field.style}
      margin="normal"
    />
  );
};

export default TextFieldComponent;