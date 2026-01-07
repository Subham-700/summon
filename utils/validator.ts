import { FieldSchema } from './SchemaTypes';

type FormValue = string | number | boolean | Date | undefined;

/**
 * Custom validation engine for dynamic forms
 * 
 * Validates form fields based on schema rules without using external libraries.
 * Supports:
 * - Required field validation
 * - Min/max constraints for numbers and text length
 * - Select option validation
 * - Date validation
 * 
 * @param schema - Array of field schemas defining validation rules
 * @param values - Current form values to validate
 * @returns Object containing field IDs and their error messages
 */
export function validateForm(
  schema: FieldSchema[],
  values: Record<string, FormValue>
): Record<string, string> {
  const errors: Record<string, string> = {};

  schema.forEach((field) => {
    const value = values[field.id];

    // Skip validation for fields that are hidden by conditional logic
    if (field.dependsOn) {
      const { fieldId, value: expectedValue } = field.dependsOn;
      if (values[fieldId] !== expectedValue) {
        return; // Field is hidden, skip validation
      }
    }

    // Required validation
    if (field.required) {
      if (value === undefined || value === null || value === '') {
        errors[field.id] = `${field.label} is required`;
        return;
      }
      
      // Special handling for checkbox (must be true if required)
      if (field.type === 'checkbox' && !value) {
        errors[field.id] = `${field.label} must be checked`;
        return;
      }
    }

    // Skip further validation if value is empty and not required
    if (!value && !field.required) {
      return;
    }

    // Number validation
    if (field.type === 'number' && typeof value === 'number') {
      if (field.min !== undefined && value < field.min) {
        errors[field.id] = `${field.label} must be at least ${field.min}`;
      }
      if (field.max !== undefined && value > field.max) {
        errors[field.id] = `${field.label} must be at most ${field.max}`;
      }
    }

    // Text length validation
    if (field.type === 'text' && typeof value === 'string') {
      if (field.min && value.length < field.min) {
        errors[field.id] = `${field.label} must be at least ${field.min} characters`;
      }
      if (field.max && value.length > field.max) {
        errors[field.id] = `${field.label} must be at most ${field.max} characters`;
      }
    }

    // Select validation - ensure value is in allowed options
    if (
      field.type === 'select' &&
      field.options &&
      typeof value === 'string' &&
      value !== '' &&
      !field.options.includes(value)
    ) {
      errors[field.id] = `Please select a valid option for ${field.label}`;
    }

    // Date validation
    if (field.type === 'date' && value) {
      const dateValue = new Date(value as string);
      if (isNaN(dateValue.getTime())) {
        errors[field.id] = `${field.label} must be a valid date`;
      }
    }
  });

  return errors;
}
