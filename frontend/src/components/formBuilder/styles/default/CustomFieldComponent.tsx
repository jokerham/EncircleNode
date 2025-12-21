import React from 'react';
import { Box } from '@mui/material';
import type { FormikProps } from 'formik';
import type { CustomFieldConfig } from '../../types';

// ==================== CUSTOM FIELD COMPONENT ====================
const CustomFieldComponent: React.FC<{
  field: CustomFieldConfig;
  formikProps: FormikProps<Record<string, unknown>>;
}> = ({ field, formikProps }) => {
  const { values, setFieldValue } = formikProps;
  const Component = field.component;

  return (
    <Box margin="normal" className={field.className} style={field.style}>
      <Component
        name={field.name}
        label={field.label}
        value={values[field.name]}
        onChange={(value: unknown) => {
          setFieldValue(field.name, value);
          if (field.onChange) {
            field.onChange(value, formikProps);
          }
        }}
        {...field.props}
      />
    </Box>
  );
};

export default CustomFieldComponent;