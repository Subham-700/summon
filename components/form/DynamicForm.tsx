'use client';

import { useState, useEffect } from 'react';
import { validateForm } from '@/utils/validator';
import { scrollToFirstError } from '@/utils/ScrollToError';
import { useFormStore } from '@/store/formStore';
import PreviewModal from './PreviewModal';
import FieldRenderer from './FieldRenderer';
import { FieldSchema } from '@/utils/SchemaTypes';

interface DynamicFormProps {
  schema: FieldSchema[];
}

/**
 * DynamicForm Component
 * 
 * Renders a form dynamically based on the provided schema.
 * Handles validation, error display, and shows a preview modal on successful submission.
 * Implements custom validation without external form libraries.
 */
export default function DynamicForm({ schema }: DynamicFormProps) {
  const { values, errors, setErrors, resetErrors, resetForm } = useFormStore();
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('formDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        Object.entries(draft).forEach(([key, value]) => {
          useFormStore.getState().setValue(key, value as string | number | boolean);
        });
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, []);

  // Auto-save draft to localStorage whenever values change
  useEffect(() => {
    if (Object.keys(values).length > 0) {
      localStorage.setItem('formDraft', JSON.stringify(values));
    }
  }, [values]);

  /**
   * Handles form submission
   * Validates all fields and either shows errors or displays the preview modal
   */
  function handleSubmit() {
    setIsSubmitting(true);
    resetErrors();

    const validationErrors = validateForm(schema, values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      scrollToFirstError(validationErrors);
      setIsSubmitting(false);
      return;
    }

    // Form is valid → show preview
    setShowPreview(true);
    setIsSubmitting(false);
  }

  /**
   * Handles closing the preview modal and going back to edit
   */
  function handleClosePreview() {
    setShowPreview(false);
  }

  /**
   * Handles final form submission from preview modal
   */
  function handleFinalSubmit() {
    // Clear the draft from localStorage
    localStorage.removeItem('formDraft');
    
    // Reset the form
    resetForm();
    setShowPreview(false);
    
    // Show success message (you can customize this)
    alert('Form submitted successfully!');
  }

  /**
   * Resets the form and clears the draft
   */
  function handleReset() {
    if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
      resetForm();
      localStorage.removeItem('formDraft');
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
      {/* Form fields */}
      <div className="space-y-4 mb-6">
        {schema.map((field) => (
          <FieldRenderer key={field.id} field={field} />
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium dark:bg-green-700 dark:hover:bg-green-600"
        >
          {isSubmitting ? 'Validating...' : 'Submit'}
        </button>
        
        <button
          onClick={handleReset}
          type="button"
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-700 dark:text-gray-300"
        >
          Reset
        </button>
      </div>

      {/* Error summary */}
      {Object.keys(errors).length > 0 && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 font-medium mb-2">
            Please fix the following errors:
          </p>
          <ul className="list-disc list-inside text-red-600 dark:text-red-300 text-sm space-y-1">
            {Object.entries(errors).map(([fieldId, error]) => (
              <li key={fieldId}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal
          data={values}
          onClose={handleClosePreview}
          onSubmit={handleFinalSubmit}
        />
      )}
    </div>
  );
}
