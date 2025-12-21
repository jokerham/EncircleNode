import React from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import type { FormikProps } from 'formik';
import type { SelectFieldConfig } from '../../types';

// ==================== SELECT FIELD COMPONENT ====================
const SelectFieldComponent: React.FC<{
  field: SelectFieldConfig;
  formikProps: FormikProps<Record<string, unknown>>;
}> = ({ field, formikProps }) => {
  const { values, errors, touched, handleBlur, setFieldValue } = formikProps;
  const hasError = touched[field.name] && Boolean(errors[field.name]);

  return (
    <FormControl fullWidth margin="normal" error={hasError} disabled={field.disabled}>
      <InputLabel>{field.label}</InputLabel>
      <Select
        name={field.name}
        value={values[field.name] || ''}
        onChange={(e) => {
          setFieldValue(field.name, e.target.value);
          if (field.onChange) {
            field.onChange(e.target.value, formikProps);
          }
        }}
        onBlur={handleBlur}
        label={field.label}
        className={field.className}
        style={field.style}
      >
        {field.options.map((option) => (
          <MenuItem key={String(option.value)} value={option.value as string | number}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {hasError && <FormHelperText>{errors[field.name]}</FormHelperText>}
    </FormControl>
  );
};

export default SelectFieldComponent;