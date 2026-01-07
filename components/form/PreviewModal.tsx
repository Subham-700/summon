'use client';

type FormValue = string | number | boolean | Date | undefined;

interface PreviewModalProps {
  data: Record<string, FormValue>;
  onClose: () => void;
  onSubmit?: () => void;
}

/**
 * PreviewModal Component
 * 
 * Displays a modal with formatted form data before final submission.
 * Allows users to review their input and either submit or go back to edit.
 */
export default function PreviewModal({
  data,
  onClose,
  onSubmit,
}: PreviewModalProps) {
  
  /**
   * Formats the value for display
   */
  const formatValue = (value: FormValue): string => {
    if (value === undefined || value === null) return 'Not provided';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Preview Form Data
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Please review your information before submitting.
        </p>

        <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
          {Object.entries(data).map(([key, value]) => (
            <div 
              key={key} 
              className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700"
            >
              <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className="text-gray-900 dark:text-gray-100">
                {formatValue(value)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Edit Form
          </button>
          
          {onSubmit && (
            <button
              onClick={onSubmit}
              className="flex-1 bg-blue-600 dark:bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
            >
              Confirm & Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
