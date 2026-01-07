/**
 * Scrolls to the first field with a validation error
 * 
 * This function improves UX by automatically scrolling the viewport
 * to the first invalid field when form validation fails.
 * 
 * @param errors - Object containing field IDs and their error messages
 */
export function scrollToFirstError(errors: Record<string, string>): void {
  const firstErrorField = Object.keys(errors)[0];
  
  if (!firstErrorField) return;
  
  const element = document.getElementById(firstErrorField);
  
  if (element) {
    // Scroll to the element with smooth animation
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center',
      inline: 'nearest'
    });
    
    // Focus the input element for keyboard accessibility
    const input = element.querySelector('input, select, textarea');
    if (input instanceof HTMLElement) {
      setTimeout(() => {
        input.focus();
      }, 500); // Delay to allow scroll animation to complete
    }
  }
}
