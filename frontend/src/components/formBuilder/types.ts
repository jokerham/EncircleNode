import React from 'react';
import type { FormikProps, FormikHelpers } from 'formik';

// ==================== types.ts ====================
export interface BaseFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'select' | 'checkbox' | 'radio' | 'date' | 'time' | 'file' | 'custom';
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  onChange?: (value: unknown, formikProps: FormikProps<Record<string, unknown>>) => void;
  validation?: object;
  className?: string;
  style?: React.CSSProperties;
  variant?: string; // NEW: e.g., 'default', 'material', 'bootstrap', 'custom'
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: 'text';
  multiline?: boolean;
  rows?: number;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select';
  options: Array<{ label: string; value: unknown }>;
}

export interface RadioFieldConfig extends BaseFieldConfig {
  type: 'radio';
  options: Array<{ label: string; value: unknown }>;
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: 'checkbox';
}

export interface DateFieldConfig extends BaseFieldConfig {
  type: 'date';
}

export interface TimeFieldConfig extends BaseFieldConfig {
  type: 'time';
}

export interface FileFieldConfig extends BaseFieldConfig {
  type: 'file';
  multiple?: boolean;
  accept?: string;
  onUpload?: (files: File[]) => Promise<UploadedFile[]>;
}

export interface CustomFieldConfig extends BaseFieldConfig {
  type: 'custom';
  component: React.ComponentType<Record<string, unknown>>;
  props?: Record<string, unknown>;
}

export type FieldConfig =
  | TextFieldConfig
  | SelectFieldConfig
  | RadioFieldConfig
  | CheckboxFieldConfig
  | DateFieldConfig
  | TimeFieldConfig
  | FileFieldConfig
  | CustomFieldConfig;

export interface FormConfig {
  fields: FieldConfig[];
  initialValues?: Record<string, unknown>;
  validationSchema?: object;
  onSubmit: (values: Record<string, unknown>, formikHelpers: FormikHelpers<Record<string, unknown>>) => void | Promise<void>;
  submitButtonText?: string;
  theme?: Record<string, unknown>;
  className?: string;
  style?: React.CSSProperties;
  variant?: string; // NEW: Default variant for all fields (can be overridden per field)
}

export interface UploadedFile {
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

export interface FileUploadProgress {
  fileName: string;
  progress: number;
}

// Component prop interfaces for consistency
export interface FieldComponentProps<T extends FieldConfig = FieldConfig> {
  field: T;
  formikProps: FormikProps<Record<string, unknown>>;
}