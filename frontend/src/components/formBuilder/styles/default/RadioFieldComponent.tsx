import React from 'react';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  FormHelperText,
} from '@mui/material';
import type { FormikProps } from 'formik';
import type { RadioFieldConfig } from '../../types';

// ==================== RADIO COMPONENT ====================
const RadioFieldComponent: React.FC<{
  field: RadioFieldConfig;
  formikProps: FormikProps<Record<string, unknown>>;
}> = ({ field, formikProps }) => {
  const { values, errors, touched, setFieldValue } = formikProps;
  const hasError = touched[field.name] && Boolean(errors[field.name]);

  return (
    <FormControl component="fieldset" margin="normal" error={hasError} disabled={field.disabled}>
      <Typography variant="body2" color={hasError ? 'error' : 'textSecondary'} gutterBottom>
        {field.label}
      </Typography>
      <RadioGroup
        name={field.name}
        value={values[field.name] || ''}
        onChange={(e) => {
          setFieldValue(field.name, e.target.value);
          if (field.onChange) {
            field.onChange(e.target.value, formikProps);
          }
        }}
        className={field.className}
        style={field.style}
      >
        {field.options.map((option) => (
          <FormControlLabel
            key={String(option.value)}
            value={option.value as string | number}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
      {hasError && <FormHelperText>{errors[field.name]}</FormHelperText>}
    </FormControl>
  );
};

export default RadioFieldComponent;