# Validation Logic Documentation

## Overview

This document explains the custom validation engine built from scratch without using external form libraries like Formik or React Hook Form.

## Validation Engine Architecture

The validation engine is located in `utils/validator.ts` and implements a pure, functional approach to form validation.

## Core Function

```typescript
validateForm(
  schema: FieldSchema[],
  values: Record<string, FormValue>
): Record<string, string>
```

### Parameters
- `schema`: Array of field definitions with validation rules
- `values`: Current form values as key-value pairs

### Returns
- Object mapping field IDs to error messages
- Empty object if all validations pass

## Validation Rules

### 1. Required Field Validation

**Logic**: Field must have a non-empty value

```typescript
if (field.required) {
  if (value === undefined || value === null || value === '') {
    errors[field.id] = `${field.label} is required`;
  }
}
```

**Special Cases**:
- **Checkbox**: Must be `true` if required
- **Select**: Must not be empty string
- **Number**: Must be a valid number
- **Date**: Must be a valid date

### 2. Conditional Field Validation

**Logic**: Skip validation if field is hidden by conditional logic

```typescript
if (field.dependsOn) {
  const { fieldId, value: expectedValue } = field.dependsOn;
  if (values[fieldId] !== expectedValue) {
    return; // Skip this field
  }
}
```

**Example**:
```json
{
  "id": "lawyerLicense",
  "type": "text",
  "required": true,
  "dependsOn": {
    "fieldId": "role",
    "value": "Lawyer"
  }
}
```

This field is only validated when `role === "Lawyer"`.

### 3. Text Field Validation

**Rules**:
- Minimum length constraint
- Maximum length constraint

```typescript
if (field.type === 'text' && typeof value === 'string') {
  if (field.min && value.length < field.min) {
    errors[field.id] = `${field.label} must be at least ${field.min} characters`;
  }
  if (field.max && value.length > field.max) {
    errors[field.id] = `${field.label} must be at most ${field.max} characters`;
  }
}
```

**Example**:
- Name (min: 2, max: 50) ✅
- "Jo" → Valid (2 chars)
- "J" → Error: "Must be at least 2 characters"

### 4. Number Field Validation

**Rules**:
- Minimum value constraint
- Maximum value constraint
- Must be a valid number

```typescript
if (field.type === 'number' && typeof value === 'number') {
  if (field.min !== undefined && value < field.min) {
    errors[field.id] = `${field.label} must be at least ${field.min}`;
  }
  if (field.max !== undefined && value > field.max) {
    errors[field.id] = `${field.label} must be at most ${field.max}`;
  }
}
```

**Example**:
- Age (min: 18, max: 100) ✅
- 25 → Valid
- 17 → Error: "Must be at least 18"
- 101 → Error: "Must be at most 100"

### 5. Select Field Validation

**Rules**:
- Value must exist in allowed options
- Empty string is treated as no selection

```typescript
if (
  field.type === 'select' &&
  field.options &&
  typeof value === 'string' &&
  value !== '' &&
  !field.options.includes(value)
) {
  errors[field.id] = `Please select a valid option for ${field.label}`;
}
```

**Example**:
```json
{
  "id": "country",
  "type": "select",
  "options": ["USA", "Canada", "UK"],
  "required": true
}
```

- "USA" → Valid ✅
- "France" → Error (not in options)
- "" → Error if required

### 6. Checkbox Validation

**Rules**:
- If required, must be checked (true)
- Optional checkboxes can be true or false

```typescript
if (field.type === 'checkbox' && !value) {
  errors[field.id] = `${field.label} must be checked`;
}
```

### 7. Date Field Validation

**Rules**:
- Must be a valid date format
- Uses JavaScript Date parsing

```typescript
if (field.type === 'date' && value) {
  const dateValue = new Date(value as string);
  if (isNaN(dateValue.getTime())) {
    errors[field.id] = `${field.label} must be a valid date`;
  }
}
```

## Validation Flow

```
┌─────────────────────────────────────┐
│   User Clicks Submit Button         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Call validateForm(schema, values) │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Loop Through Each Field in Schema │
└──────────────┬──────────────────────┘
               │
               ▼
        ┌──────────────┐
        │ Check if     │
        │ field visible│◄──── dependsOn logic
        │ (dependsOn)  │
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │  Required?   │
        └──────┬───────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
    [Yes]          [No]
   Check value   Skip if empty
        │             │
        └──────┬──────┘
               │
               ▼
        ┌──────────────┐
        │ Type-Specific│
        │  Validation  │
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │ Collect      │
        │ Errors       │
        └──────┬───────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Return Error Object               │
│   { fieldId: errorMessage, ... }    │
└──────────────┬──────────────────────┘
               │
        ┌──────┴───────┐
        │              │
        ▼              ▼
   [Has Errors]   [No Errors]
        │              │
        ▼              ▼
   Show Errors    Show Preview
   Scroll to      Modal
   First Error
```

## Error Message Strategy

### Consistent Format
All error messages follow a pattern:
```
"[Field Label] [validation rule description]"
```

Examples:
- "Full Name is required"
- "Age must be at least 18"
- "Email Address must be at most 50 characters"

### User-Friendly Language
- Avoid technical jargon
- Use positive language when possible
- Be specific about what's needed

## Edge Cases Handled

### 1. Empty Values
```typescript
// Don't validate optional empty fields
if (!value && !field.required) {
  return;
}
```

### 2. Type Coercion
```typescript
// Ensure correct type before validation
if (field.type === 'number' && typeof value === 'number') {
  // Only validate if it's actually a number
}
```

### 3. Hidden Fields
```typescript
// Skip validation for conditionally hidden fields
if (field.dependsOn) {
  const { fieldId, value: expectedValue } = field.dependsOn;
  if (values[fieldId] !== expectedValue) {
    return; // Don't validate hidden field
  }
}
```

### 4. Empty Select
```typescript
// Treat empty string as "no selection"
value !== '' && !field.options.includes(value)
```

## Integration with UI

### 1. Real-Time Validation
Currently validation runs on submit. Could be extended for real-time:

```typescript
const handleFieldChange = (id: string, value: FormValue) => {
  setValue(id, value);
  
  // Validate single field
  const fieldSchema = schema.find(f => f.id === id);
  if (fieldSchema) {
    const errors = validateForm([fieldSchema], { [id]: value });
    // Update error for this field only
  }
};
```

### 2. Error Display
Errors are displayed:
- **Inline**: Below each invalid field (red text)
- **Summary**: Error list at bottom of form
- **Focus**: Automatically scrolls to first error

### 3. Error Clearing
Errors are cleared:
- When form is submitted successfully
- When "Reset" button is clicked
- When form is reset after final submission

## Testing the Validation

### Example Test Cases

```typescript
// Test: Required field
validateForm(
  [{ id: 'name', label: 'Name', type: 'text', required: true }],
  { name: '' }
)
// Expected: { name: 'Name is required' }

// Test: Min length
validateForm(
  [{ id: 'name', label: 'Name', type: 'text', min: 3 }],
  { name: 'Jo' }
)
// Expected: { name: 'Name must be at least 3 characters' }

// Test: Conditional field (hidden)
validateForm(
  [
    { id: 'role', label: 'Role', type: 'select' },
    { 
      id: 'license',
      label: 'License',
      type: 'text',
      required: true,
      dependsOn: { fieldId: 'role', value: 'Lawyer' }
    }
  ],
  { role: 'Developer', license: '' }
)
// Expected: {} (no error, license field is hidden)
```

## Performance Considerations

1. **Single Pass**: Validates all fields in one iteration
2. **Early Return**: Stops checking a field after first error
3. **Type Guards**: Uses TypeScript type narrowing
4. **Pure Function**: No side effects, easily testable

## Future Enhancements

### Async Validation
```typescript
async validateForm(schema, values) {
  // Check email availability
  // Validate against external API
}
```

### Custom Validators
```typescript
{
  id: 'email',
  type: 'text',
  validate: (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
}
```

### Cross-Field Validation
```typescript
// Password confirmation
if (values.password !== values.confirmPassword) {
  errors.confirmPassword = 'Passwords must match';
}
```

### Regex Patterns
```typescript
{
  id: 'phone',
  type: 'text',
  pattern: /^\d{3}-\d{3}-\d{4}$/,
  errorMessage: 'Phone must be in format: XXX-XXX-XXXX'
}
```

## Conclusion

This custom validation engine provides:
- ✅ Full control over validation logic
- ✅ Type safety with TypeScript
- ✅ Easy to test and maintain
- ✅ Extensible for future requirements
- ✅ No external dependencies
- ✅ Clear error messages
- ✅ Support for complex scenarios (conditional fields)
