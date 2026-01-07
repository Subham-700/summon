'use client';

import { FieldSchema } from '@/utils/SchemaTypes';
import { useFormStore } from '@/store/formStore';

export default function FieldRenderer({ field }: { field: FieldSchema }) {
  const { values, errors, setValue } = useFormStore();

  // Check if field should be visible based on conditional logic (dependsOn)
  if (field.dependsOn) {
    const { fieldId, value } = field.dependsOn;
    if (values[fieldId] !== value) {
      return null; // Hide field if dependency condition not met
    }
  }

  return (
    <div className="mb-4" id={field.id}>
      <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {field.type === 'text' && (
        <input
          type="text"
          className="input"
          placeholder={field.placeholder}
          value={String(values[field.id] || '')}
          onChange={(e) => setValue(field.id, e.target.value)}
        />
      )}

      {field.type === 'number' && (
        <input
          type="number"
          className="input"
          placeholder={field.placeholder}
          value={values[field.id] as number || ''}
          min={field.min}
          max={field.max}
          onChange={(e) => setValue(field.id, Number(e.target.value))}
        />
      )}

      {field.type === 'select' && (
        <select
          className="input"
          value={String(values[field.id] || '')}
          onChange={(e) => setValue(field.id, e.target.value)}
        >
          <option value="">Select an option</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {field.type === 'checkbox' && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id={`checkbox-${field.id}`}
            className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700"
            checked={Boolean(values[field.id])}
            onChange={(e) => setValue(field.id, e.target.checked)}
          />
          <label htmlFor={`checkbox-${field.id}`} className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            {field.placeholder || 'Check this option'}
          </label>
        </div>
      )}

      {field.type === 'date' && (
        <input
          type="date"
          className="input"
          value={values[field.id] ? String(values[field.id]) : ''}
          onChange={(e) => setValue(field.id, e.target.value)}
        />
      )}

      {errors[field.id] && (
        <p className="text-red-500 dark:text-red-400 text-sm mt-1" role="alert">
          {errors[field.id]}
        </p>
      )}
    </div>
  );
}
