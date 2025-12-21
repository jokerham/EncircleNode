// ==================== FieldRenderer.tsx (UPDATED) ====================
import React from 'react';
import type { FormikProps } from 'formik';
import type { FieldConfig } from './types';
import { getVariantComponents } from './styles';

interface FieldRendererProps {
  field: FieldConfig;
  formikProps: FormikProps<Record<string, unknown>>;
  defaultVariant?: string; // Variant from FormConfig
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ 
  field, 
  formikProps, 
  defaultVariant = 'default' 
}) => {
  // Use field-level variant if specified, otherwise use form-level default
  const variant = field.variant || defaultVariant;
  
  // Get the appropriate component set for this variant
  const components = getVariantComponents(variant);

  switch (field.type) {
    case 'text':
      return <components.TextFieldComponent field={field} formikProps={formikProps} />;
    case 'select':
      return <components.SelectFieldComponent field={field} formikProps={formikProps} />;
    case 'checkbox':
      return <components.CheckboxFieldComponent field={field} formikProps={formikProps} />;
    case 'radio':
      return <components.RadioFieldComponent field={field} formikProps={formikProps} />;
    case 'date':
      return <components.DateFieldComponent field={field} formikProps={formikProps} />;
    case 'time':
      return <components.TimeFieldComponent field={field} formikProps={formikProps} />;
    case 'file':
      return <components.FileUploadComponent field={field} formikProps={formikProps} />;
    case 'custom':
      return <components.CustomFieldComponent field={field} formikProps={formikProps} />;
    default:
      return null;
  }
};

export default FieldRenderer;