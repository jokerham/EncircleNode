// src/components/ckeditor/CkeditorField.tsx
import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import type { Editor as CKEditorInstance } from '@ckeditor/ckeditor5-core';
import type { EditorConfig } from '@ckeditor/ckeditor5-core';

import { getCkeditorConfig } from './config';

type UploadFileCallback = (file: File) => Promise<string>; // return a public URL

class CallbackUploadAdapter {
  private loader: any;
  private uploadFile: UploadFileCallback;
  private abortController?: AbortController;

  constructor(loader: any, uploadFile: UploadFileCallback) {
    this.loader = loader;
    this.uploadFile = uploadFile;
  }

  async upload() {
    const file: File = await this.loader.file;

    this.abortController = new AbortController();

    // You can extend this to return width/height etc if needed:
    const url = await this.uploadFile(file);

    return {
      default: url
    };
  }

  abort() {
    try {
      this.abortController?.abort();
    } catch {
      // ignore
    }
  }
}

function attachUploadAdapter(editor: CKEditorInstance, uploadFile?: UploadFileCallback) {
  if (!uploadFile) return;

  // FileRepository exists when upload-related plugins are present in the build
  const fileRepository = editor.plugins.get('FileRepository') as any;

  fileRepository.createUploadAdapter = (loader: any) => {
    return new CallbackUploadAdapter(loader, uploadFile);
  };
}

export type CkeditorFieldProps = {
  name: string;
  label?: string;
  value?: unknown; // Formik passes unknown in your CustomFieldComponent
  onChange: (value: string) => void;

  // extra props you can pass via field.props:
  uploadFile?: UploadFileCallback;
  configOverrides?: Partial<EditorConfig>;
  disabled?: boolean;
  readOnly?: boolean;
  minHeight?: number | string;
};

const CkeditorField: React.FC<CkeditorFieldProps> = ({
  label,
  value,
  onChange,
  uploadFile,
  configOverrides,
  disabled,
  readOnly,
  minHeight = 220
}) => {
  const data = typeof value === 'string' ? value : '';

  const config = useMemo(() => {
    const merged = getCkeditorConfig(configOverrides);

    // CKEditor uses "isReadOnly" at runtime, but config can also carry "readOnly" in some builds.
    // We'll set it at onReady, but keeping config override is still useful.
    return merged;
  }, [configOverrides]);

  return (
    <Box>
      {label ? (
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {label}
        </Typography>
      ) : null}

      <Box
        sx={{
          '& .ck-editor__editable': {
            minHeight
          }
        }}
      >
        <CKEditor
          editor={ClassicEditor as any}
          data={data}
          config={config}
          disabled={!!disabled}
          onReady={(editor: CKEditorInstance) => {
            attachUploadAdapter(editor, uploadFile);

            if (readOnly) {
              (editor as any).isReadOnly = true;
            }
          }}
          onChange={(_, editor: any) => {
            const html = editor.getData();
            onChange(html);
          }}
        />
      </Box>
    </Box>
  );
};

export default CkeditorField;
