import { SelectHTMLAttributes, forwardRef, useId } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

/**
 * Reusable Select Component
 * 
 * A flexible select dropdown component with label, error handling, and helper text.
 * Fully accessible with ARIA attributes.
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder = 'Select an option',
      className = '',
      id,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    return (
      <div className="w-full group">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors"
          >
            {label}
            {required && (
              <span className="text-red-500 dark:text-red-400 ml-1 animate-pulse">*</span>
            )}
          </label>
        )}

        <div className="relative">
          {/* Gradient border effect on focus */}
          <div className={`
            absolute -inset-0.5 rounded-lg opacity-0 blur-sm transition-all duration-300
            ${!disabled && !error ? 'group-hover:opacity-30 group-focus-within:opacity-75 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500' : ''}
            ${error ? 'opacity-40 bg-red-500' : ''}
          `} />
          
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={`
              input
              relative
              appearance-none
              pr-10
              cursor-pointer
              font-medium
              ${error 
                ? 'border-red-500 dark:border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-900/10' 
                : 'focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20'
              }
              ${disabled 
                ? 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-60' 
                : 'bg-white dark:bg-gray-900 hover:bg-linear-to-br hover:from-white hover:to-blue-50/30 dark:hover:from-gray-900 dark:hover:to-blue-900/10 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5'
              }
              transform transition-all duration-200 ease-in-out
              ${!disabled ? 'active:scale-[0.99]' : ''}
              ${className}
            `}
            {...props}
          >
            <option value="" disabled className="text-gray-400 dark:text-gray-500">
              {placeholder}
            </option>
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 py-2"
              >
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Custom dropdown arrow with animation */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className={`h-5 w-5 transition-all duration-300 ease-in-out ${
                error 
                  ? 'text-red-500 dark:text-red-400 animate-pulse' 
                  : disabled 
                  ? 'text-gray-400 dark:text-gray-600' 
                  : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110 group-focus-within:rotate-180 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400'
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {error && (
          <p
            id={errorId}
            className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1 animate-shake"
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
            className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"
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

Select.displayName = 'Select';

export default Select;
