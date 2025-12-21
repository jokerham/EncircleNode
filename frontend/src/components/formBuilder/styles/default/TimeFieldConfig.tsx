import React from 'react';
import { Box } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import type { FormikProps } from 'formik';
import type { TimeFieldConfig } from '../../types';

// ==================== TIME PICKER COMPONENT ====================
const TimeFieldComponent: React.FC<{
  field: TimeFieldConfig;
  formikProps: FormikProps<Record<string, unknown>>;
}> = ({ field, formikProps }) => {
  const { values, errors, touched, setFieldValue } = formikProps;
  const hasError = touched[field.name] && Boolean(errors[field.name]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box margin="normal" className={field.className} style={field.style}>
        <TimePicker
          label={field.label}
          value={(values[field.name] as Date) || null}
          onChange={(newValue) => {
            setFieldValue(field.name, newValue);
            if (field.onChange) {
              field.onChange(newValue, formikProps);
            }
          }}
          disabled={field.disabled}
          slotProps={{
            textField: {
              fullWidth: true,
              error: hasError,
              helperText: hasError ? String(errors[field.name]) : '',
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default TimeFieldComponent;