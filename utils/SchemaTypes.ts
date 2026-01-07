export type FieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'date';

export interface FieldSchema {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
  dependsOn?: {
    fieldId: string;
    value: string;
  };
}
