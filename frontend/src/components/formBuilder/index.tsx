// ==================== FormBuilder.tsx ====================
import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Box, Button } from '@mui/material';
import type { FormConfig } from './types';
import FieldRenderer from './FieldRenderer';
export type { FormConfig } from './types';

export const FormBuilder: React.FC<FormConfig> = ({
  fields,
  initialValues = {},
  validationSchema,
  onSubmit,
  submitButtonText = 'Submit',
  className,
  style,
  variant = 'default', // NEW: Default variant for the entire form
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
    <Formik
      initialValues={finalInitialValues}
      validationSchema={finalValidationSchema}
      onSubmit={onSubmit}
      enableReinitialize={true} // Allow form to reinitialize when initialValues change
    >
      {(formikProps) => (
        <Form className={className} style={style}>
          {fields.map((field) => (
            <FieldRenderer 
              key={field.name} 
              field={field} 
              formikProps={formikProps}
              defaultVariant={variant} // Pass form-level variant
            />
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
  );
};

export default FormBuilder;