import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Button, Box } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import type { FormConfig } from './types';
import FieldRenderer from './FieldRenderer';

// ==================== FORM BUILDER ====================
const FormBuilder: React.FC<FormConfig> = ({
  fields,
  initialValues = {},
  validationSchema,
  onSubmit,
  submitButtonText = 'Submit',
  className,
  style,
}) => {
  const defaultInitialValues = fields.reduce((acc, field) => {
    if (!(field.name in initialValues)) {
      acc[field.name] = field.type === 'checkbox' ? false : field.type === 'file' ? [] : '';
    }
    return acc;
  }, {} as Record<string, unknown>);

  const finalInitialValues = { ...defaultInitialValues, ...initialValues };

  const defaultValidationSchema = Yup.object().shape(
    fields.reduce((acc, field) => {
      if (field.validation) {
        acc[field.name] = field.validation as Yup.AnySchema;
      } else if (field.required) {
        acc[field.name] = Yup.mixed().required(`${field.label} is required`);
      }
      return acc;
    }, {} as Record<string, Yup.AnySchema>)
  );

  const finalValidationSchema = validationSchema || defaultValidationSchema;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Formik
        initialValues={finalInitialValues}
        validationSchema={finalValidationSchema}
        onSubmit={onSubmit}
      >
        {(formikProps) => (
          <Form className={className} style={style}>
            {fields.map((field) => (
              <FieldRenderer key={field.name} field={field} formikProps={formikProps} />
            ))}
            <Box mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={formikProps.isSubmitting}
              >
                {submitButtonText}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </LocalizationProvider>
  );
};

export default FormBuilder;