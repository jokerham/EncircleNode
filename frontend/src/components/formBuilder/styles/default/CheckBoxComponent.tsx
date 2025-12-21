import React from 'react';
import {
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import type { FormikProps } from 'formik';
import type { CheckboxFieldConfig } from '../../types';

// ==================== CHECKBOX COMPONENT ====================
const CheckboxFieldComponent: React.FC<{
  field: CheckboxFieldConfig;
  formikProps: FormikProps<Record<string, unknown>>;
}> = ({ field, formikProps }) => {
  const { values, setFieldValue } = formikProps;

  return (
    <FormControlLabel
      control={
        <Checkbox
          name={field.name}
          checked={Boolean(values[field.name]) || false}
          onChange={(e) => {
            setFieldValue(field.name, e.target.checked);
            if (field.onChange) {
              field.onChange(e.target.checked, formikProps);
            }
          }}
          disabled={field.disabled}
        />
      }
      label={field.label}
      className={field.className}
      style={field.style}
    />
  );
};

export default CheckboxFieldComponent;