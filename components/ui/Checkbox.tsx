import { InputHTMLAttributes, forwardRef, useId } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Reusable Checkbox Component
 * 
 * A flexible checkbox component with label, error handling, and helper text.
 * Fully accessible with ARIA attributes.
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      helperText,
      className = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const errorId = `${checkboxId}-error`;
    const helperId = `${checkboxId}-helper`;

    return (
      <div className="w-full group">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              disabled={disabled}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={
                error ? errorId : helperText ? helperId : undefined
              }
              className={`
                w-5 h-5 text-blue-600 dark:text-blue-500 
                border-2 border-gray-300 dark:border-gray-600 rounded-md
                focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:border-blue-500 dark:hover:border-blue-400
                transition-all duration-200 cursor-pointer
                ${error ? 'border-red-500 dark:border-red-400' : ''}
                ${className}
              `}
              {...props}
            />
          </div>

          {label && (
            <div className="ml-3 text-sm">
              <label
                htmlFor={checkboxId}
                className={`font-medium cursor-pointer transition-colors ${
                  disabled 
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                    : error
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100'
                }`}
              >
                {label}
              </label>
            </div>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            className="mt-2 text-sm text-red-600 dark:text-red-400 ml-8 flex items-center gap-1 animate-shake"
            role="alert"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={helperId}
            className="mt-2 text-sm text-gray-500 dark:text-gray-400 ml-8 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
