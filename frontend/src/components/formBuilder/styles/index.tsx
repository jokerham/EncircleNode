// ==================== styles/index.ts ====================
import React from 'react';
import type { FieldComponentProps } from '../types';

// Default (Material-UI) imports
import DefaultTextFieldComponent from './default/TextFieldComponent';
import DefaultSelectFieldComponent from './default/SelectFieldComponent';
import DefaultCheckboxFieldComponent from './default/CheckBoxComponent';
import DefaultRadioFieldComponent from './default/RadioFieldComponent';
import DefaultDateFieldComponent from './default/DateFieldComponent';
import DefaultTimeFieldComponent from './default/TimeFieldComponent';
import DefaultFileUploadComponent from './default/FileUploadComponent';
import DefaultCustomFieldComponent from './default/CustomFieldComponent';

// Bootstrap imports (example)
// import BootstrapTextFieldComponent from './bootstrap/TextFieldComponent';
// import BootstrapSelectFieldComponent from './bootstrap/SelectFieldComponent';
// import BootstrapCheckboxFieldComponent from './bootstrap/CheckBoxComponent';
// import BootstrapRadioFieldComponent from './bootstrap/RadioFieldComponent';
// import BootstrapDateFieldComponent from './bootstrap/DateFieldComponent';
// import BootstrapTimeFieldComponent from './bootstrap/TimeFieldComponent';
// import BootstrapFileUploadComponent from './bootstrap/FileUploadComponent';
// import BootstrapCustomFieldComponent from './bootstrap/CustomFieldComponent';

// Custom variant imports (example)
// import CustomTextFieldComponent from './custom/TextFieldComponent';
// import CustomSelectFieldComponent from './custom/SelectFieldComponent';
// import CustomCheckboxFieldComponent from './custom/CheckBoxComponent';
// import CustomRadioFieldComponent from './custom/RadioFieldComponent';
// import CustomDateFieldComponent from './custom/DateFieldComponent';
// import CustomTimeFieldComponent from './custom/TimeFieldComponent';
// import CustomFileUploadComponent from './custom/FileUploadComponent';
// import CustomCustomFieldComponent from './custom/CustomFieldComponent';

// Define the structure for field components
export interface FieldComponents {
  TextFieldComponent: React.ComponentType<FieldComponentProps>;
  SelectFieldComponent: React.ComponentType<FieldComponentProps>;
  CheckboxFieldComponent: React.ComponentType<FieldComponentProps>;
  RadioFieldComponent: React.ComponentType<FieldComponentProps>;
  DateFieldComponent: React.ComponentType<FieldComponentProps>;
  TimeFieldComponent: React.ComponentType<FieldComponentProps>;
  FileUploadComponent: React.ComponentType<FieldComponentProps>;
  CustomFieldComponent: React.ComponentType<FieldComponentProps>;
}

// Registry of all available variants
export const variantRegistry: Record<string, FieldComponents> = {
  default: {
    TextFieldComponent: DefaultTextFieldComponent as React.ComponentType<FieldComponentProps>,
    SelectFieldComponent: DefaultSelectFieldComponent as React.ComponentType<FieldComponentProps>,
    CheckboxFieldComponent: DefaultCheckboxFieldComponent as React.ComponentType<FieldComponentProps>,
    RadioFieldComponent: DefaultRadioFieldComponent as React.ComponentType<FieldComponentProps>,
    DateFieldComponent: DefaultDateFieldComponent as React.ComponentType<FieldComponentProps>,
    TimeFieldComponent: DefaultTimeFieldComponent as React.ComponentType<FieldComponentProps>,
    FileUploadComponent: DefaultFileUploadComponent as React.ComponentType<FieldComponentProps>,
    CustomFieldComponent: DefaultCustomFieldComponent as React.ComponentType<FieldComponentProps>,
  },
  // bootstrap: {
  //   TextFieldComponent: BootstrapTextFieldComponent,
  //   SelectFieldComponent: BootstrapSelectFieldComponent,
  //   CheckboxFieldComponent: BootstrapCheckboxFieldComponent,
  //   RadioFieldComponent: BootstrapRadioFieldComponent,
  //   DateFieldComponent: BootstrapDateFieldComponent,
  //   TimeFieldComponent: BootstrapTimeFieldComponent,
  //   FileUploadComponent: BootstrapFileUploadComponent,
  //   CustomFieldComponent: BootstrapCustomFieldComponent,
  // },
  // custom: {
  //   TextFieldComponent: CustomTextFieldComponent,
  //   SelectFieldComponent: CustomSelectFieldComponent,
  //   CheckboxFieldComponent: CustomCheckboxFieldComponent,
  //   RadioFieldComponent: CustomRadioFieldComponent,
  //   DateFieldComponent: CustomDateFieldComponent,
  //   TimeFieldComponent: CustomTimeFieldComponent,
  //   FileUploadComponent: CustomFileUploadComponent,
  //   CustomFieldComponent: CustomCustomFieldComponent,
  // },
};

// Helper function to get components for a variant
export const getVariantComponents = (variant: string = 'default'): FieldComponents => {
  if (!variantRegistry[variant]) {
    console.warn(`Variant "${variant}" not found. Falling back to "default".`);
    return variantRegistry.default;
  }
  return variantRegistry[variant];
};

// Helper function to register a new variant dynamically
export const registerVariant = (name: string, components: FieldComponents): void => {
  variantRegistry[name] = components;
};