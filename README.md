# Dynamic Form Builder with Custom Validation & Preview

A fully-featured dynamic form application built with Next.js 16, TypeScript, and TailwindCSS. The form fields are generated dynamically from a JSON schema, with custom validation logic and a preview modal before submission.

## 🚀 Live Demo

- **Deployment**: [View on Vercel](#) _(Replace with your deployment link)_
- **GitHub**: [Repository](https://github.com/yourusername/dynamic-form-builder)

## ✨ Features

### Core Features (Requirements)
- ✅ **Dynamic Field Rendering** - Fetches schema from API and renders fields accordingly
- ✅ **Field Types Supported**: text, number, select, checkbox, date
- ✅ **Custom Validation Engine** - Built from scratch without form libraries (no Formik/React Hook Form)
- ✅ **Validation Rules**:
  - Required fields
  - Min/max constraints for numbers and text length
  - Select option validation
  - Date validation
- ✅ **Inline Error Messages** - Real-time validation feedback
- ✅ **Scroll to Error** - Automatically scrolls to first invalid field
- ✅ **Live Preview Modal** - Shows formatted data before final submission
- ✅ **State Management** - Using Zustand for efficient state handling
- ✅ **Loading & Error States** - Proper handling of async operations
- ✅ **TypeScript Strict Mode** - Full type safety throughout

### Bonus Features Implemented
- ✅ **Conditional Fields** - Fields appear/disappear based on other field values (e.g., "Role = Lawyer" → shows Bar License field)
- ✅ **Local Storage Auto-save** - Form drafts are automatically saved and restored
- ✅ **Accessible UI** - Keyboard navigation, ARIA labels, focus management
- ✅ **Dark Mode Support** - Respects system preferences
- ✅ **Smooth Animations** - Fade-in effects for modals and conditional fields
- ✅ **Reusable Components** - Clean architecture with separated concerns

## 🏗️ Architecture & Project Structure

```
assignment/
├── app/
│   ├── api/
│   │   └── schema/
│   │       └── route.ts          # API endpoint for form schema
│   ├── layout.tsx                 # Root layout with metadata
│   ├── page.tsx                   # Home page with error/loading states
│   └── globals.css                # Global styles and theme
├── components/
│   ├── form/
│   │   ├── DynamicForm.tsx        # Main form component
│   │   ├── FieldRenderer.tsx      # Renders individual fields
│   │   └── PreviewModal.tsx       # Preview modal before submission
│   ├── ui/                        # Reusable UI components
│   ├── ThemeProvider.tsx          # Theme context provider
│   └── ThemeToggle.tsx            # Dark/light mode toggle
├── services/
│   └── schemaService.ts           # API service for fetching schema
├── store/
│   └── formStore.ts               # Zustand state management
├── utils/
│   ├── SchemaTypes.ts             # TypeScript type definitions
│   ├── validator.ts               # Custom validation engine
│   └── ScrollToError.ts           # Utility for scrolling to errors
└── package.json
```

## 🧪 Custom Validation Logic

The validation engine (`utils/validator.ts`) implements a comprehensive validation system:

### How It Works

1. **Field-by-Field Validation**: Iterates through schema and validates each field
2. **Conditional Field Support**: Skips validation for hidden fields based on `dependsOn` rules
3. **Type-Specific Validation**:
   - **Text**: Min/max length validation
   - **Number**: Min/max value validation
   - **Select**: Ensures value exists in options array
   - **Checkbox**: Required checkbox must be checked
   - **Date**: Valid date format validation
4. **Required Field Logic**: Special handling for different field types
5. **Error Collection**: Returns object mapping field IDs to error messages

### Example Validation Flow

```typescript
// Schema defines rules
{
  id: 'age',
  type: 'number',
  required: true,
  min: 18,
  max: 100
}

// Validator checks:
1. Is field required and empty? → Error
2. Is value a number? → Continue
3. Is value < min (18)? → Error
4. Is value > max (100)? → Error
5. All checks pass → No error
```

## 🎨 State Management Approach

Using **Zustand** for lightweight, performant state management:

- **Global Form State**: Values, errors, and actions
- **No Provider Needed**: Direct hook imports
- **TypeScript Support**: Fully typed state and actions
- **Actions Available**:
  - `setValue(id, value)` - Update field value
  - `setErrors(errors)` - Set validation errors
  - `resetErrors()` - Clear all errors
  - `resetForm()` - Reset entire form

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/dynamic-form-builder.git
cd dynamic-form-builder

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Variables

Create a `.env.local` file (optional):

```env
NEXT_PUBLIC_API_URL=https://mocki.io/v1/785fb08b-0435-4ba4-8dd4-17bb658262cd
```

If not set, the app will use the local API endpoint as fallback.

## 📦 Build & Deploy

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 🧪 Testing

The validation logic can be tested independently:

```typescript
import { validateForm } from '@/utils/validator';

const schema = [/* your schema */];
const values = {/* test values */};
const errors = validateForm(schema, values);
```

## 🎯 Key Design Decisions

1. **No Form Libraries**: Custom validation built from scratch as required
2. **Zustand over Context API**: Better performance and simpler API
3. **Server Components**: Using Next.js 13+ App Router for optimal performance
4. **Progressive Enhancement**: Works without JavaScript for basic functionality
5. **Accessibility First**: ARIA labels, keyboard navigation, focus management
6. **Type Safety**: Strict TypeScript configuration throughout

## 🔮 Future Improvements

- [ ] Unit tests with Jest and React Testing Library
- [ ] Integration tests with Playwright
- [ ] Form analytics tracking
- [ ] Multi-step form support
- [ ] File upload field type
- [ ] Custom regex validation patterns
- [ ] Export form data as PDF
- [ ] Form builder UI for creating schemas
- [ ] Internationalization (i18n)
- [ ] Advanced animations with Framer Motion

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for learning or production.

## 👤 Author

Your Name - [GitHub](https://github.com/yourusername)

---

Built with ❤️ using Next.js, TypeScript, and TailwindCSS
