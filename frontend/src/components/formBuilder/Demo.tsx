import React from "react";
import { Box, Typography } from "@mui/material";
import * as Yup from "yup";
import type { FormConfig } from "./types";
import FormBuilder from ".";

// ==================== DEMO ====================
const Demo: React.FC = () => {
  const formConfig: FormConfig = {
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        required: true,
        placeholder: 'Enter your first name',
      },
      {
        name: 'email',
        label: 'Email',
        type: 'text',
        required: true,
        validation: Yup.string().email('Invalid email').required('Email is required'),
      },
      {
        name: 'country',
        label: 'Country',
        type: 'select',
        required: true,
        options: [
          { label: 'USA', value: 'usa' },
          { label: 'Canada', value: 'canada' },
          { label: 'UK', value: 'uk' },
        ],
      },
      {
        name: 'gender',
        label: 'Gender',
        type: 'radio',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
          { label: 'Other', value: 'other' },
        ],
      },
      {
        name: 'subscribe',
        label: 'Subscribe to newsletter',
        type: 'checkbox',
      },
      {
        name: 'birthDate',
        label: 'Birth Date',
        type: 'date',
      },
      {
        name: 'meetingTime',
        label: 'Preferred Meeting Time',
        type: 'time',
      },
      {
        name: 'documents',
        label: 'Upload Documents',
        type: 'file',
        multiple: true,
        accept: '.pdf,.doc,.docx',
        onUpload: async (files: File[]) => {
          // Simulate file upload
          return files.map((file) => ({
            name: file.name,
            url: URL.createObjectURL(file),
            size: file.size,
            type: file.type,
            uploadedAt: new Date(),
          }));
        },
      },
    ],
    onSubmit: async (values, { setSubmitting }) => {
      console.log('Form submitted:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Form submitted successfully!');
      setSubmitting(false);
    },
    submitButtonText: 'Submit Form',
  };

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dynamic Form Builder Demo
      </Typography>
      <FormBuilder {...formConfig} />
    </Box>
  );
};

export default Demo;