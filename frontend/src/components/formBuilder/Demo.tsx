// // Example 1: Using form-level variant (all fields use bootstrap)
// const ExampleWithFormVariant = () => {
//   const formConfig: FormConfig = {
//     variant: 'bootstrap', // All fields will use bootstrap variant
//     fields: [
//       {
//         name: 'firstName',
//         label: 'First Name',
//         type: 'text',
//         required: true,
//       },
//       {
//         name: 'email',
//         label: 'Email',
//         type: 'text',
//         required: true,
//       },
//     ],
//     onSubmit: async (values) => {
//       console.log(values);
//     },
//   };

//   return <FormBuilder {...formConfig} />;
// };

// // Example 2: Mixed variants (form-level + field-level override)
// const ExampleWithMixedVariants = () => {
//   const formConfig: FormConfig = {
//     variant: 'default', // Default variant for form
//     fields: [
//       {
//         name: 'firstName',
//         label: 'First Name',
//         type: 'text',
//         required: true,
//         // Uses form-level 'default' variant
//       },
//       {
//         name: 'email',
//         label: 'Email',
//         type: 'text',
//         required: true,
//         variant: 'bootstrap', // Override: this field uses bootstrap variant
//       },
//       {
//         name: 'country',
//         label: 'Country',
//         type: 'select',
//         variant: 'custom', // Override: this field uses custom variant
//         options: [
//           { label: 'USA', value: 'usa' },
//           { label: 'Canada', value: 'canada' },
//         ],
//       },
//     ],
//     onSubmit: async (values) => {
//       console.log(values);
//     },
//   };

//   return <FormBuilder {...formConfig} />;
// };

// // Example 3: Registering a new variant dynamically
// import { registerVariant } from './styles';

// // Create your custom components
// const MyCustomTextField = (props: any) => {
//   return <div>My Custom Text Field</div>;
// };

// // Register the new variant
// registerVariant('mycompany', {
//   TextFieldComponent: MyCustomTextField,
//   SelectFieldComponent: DefaultSelectFieldComponent, // Can reuse existing
//   CheckboxFieldComponent: DefaultCheckboxFieldComponent,
//   RadioFieldComponent: DefaultRadioFieldComponent,
//   DateFieldComponent: DefaultDateFieldComponent,
//   TimeFieldComponent: DefaultTimeFieldComponent,
//   FileUploadComponent: DefaultFileUploadComponent,
//   CustomFieldComponent: DefaultCustomFieldComponent,
// });

// // Now you can use it
// const ExampleWithDynamicVariant = () => {
//   const formConfig: FormConfig = {
//     variant: 'mycompany',
//     fields: [
//       {
//         name: 'firstName',
//         label: 'First Name',
//         type: 'text',
//       },
//     ],
//     onSubmit: async (values) => {
//       console.log(values);
//     },
//   };

//   return <FormBuilder {...formConfig} />;
// };