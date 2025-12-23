// src/components/ckeditor/config.ts
// IMPORTANT: Do NOT type this as EditorConfig because it doesn't include plugin keys like heading/image/table.
export type CkConfig = Record<string, unknown>;

export const CKEDITOR_CONFIG: CkConfig = {
  placeholder: 'Write here...',

  toolbar: {
    items: [
      'undo', 'redo', '|',
      'heading', '|',
      'bold', 'italic', 'underline', 'strikethrough',
      'subscript', 'superscript', 'code', '|',
      'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'highlight', '|',
      'alignment', '|',
      'link', 'blockQuote', 'codeBlock', '|',
      'bulletedList', 'numberedList', 'todoList',
      'outdent', 'indent', '|',
      'insertTable', 'imageUpload', 'mediaEmbed',
      'horizontalLine', 'removeFormat', 'specialCharacters', 'findAndReplace'
    ],
    shouldNotGroupWhenFull: true
  },

  heading: {
    options: [
      { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
      { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
      { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
      { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
      { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' }
    ]
  },

  link: {
    addTargetToExternalLinks: true,
    defaultProtocol: 'https://'
  },

  list: {
    properties: { styles: true, startIndex: true, reversed: true }
  },

  image: {
    toolbar: [
      'imageStyle:inline',
      'imageStyle:wrapText',
      'imageStyle:breakText',
      '|',
      'toggleImageCaption',
      'imageTextAlternative',
      '|',
      'linkImage'
    ],
    styles: ['inline', 'wrapText', 'breakText'],
    resizeUnit: '%'
  },

  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableProperties',
      'tableCellProperties'
    ]
  },

  mediaEmbed: { previewsInData: true },

  htmlSupport: {
    allow: [{ name: /.*/, attributes: true, classes: true, styles: true }]
  }
};

export function getCkeditorConfig(overrides?: CkConfig): CkConfig {
  return {
    ...CKEDITOR_CONFIG,
    ...(overrides ?? {}),
    toolbar: {
      ...(CKEDITOR_CONFIG.toolbar as object),
      ...((overrides?.toolbar as object) ?? {})
    }
  };
}
