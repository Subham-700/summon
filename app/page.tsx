import DynamicForm from '@/components/form/DynamicForm';
import { fetchFormSchema } from '@/services/schemaService';
import ThemeToggle from '@/components/ThemeToggle';
import { Suspense } from 'react';
import Link from 'next/link';

// Force dynamic rendering since we use no-store fetch
export const dynamic = 'force-dynamic';

/**
 * Loading component displayed while schema is being fetched
 */
function FormLoading() {
  return (
    <div className="flex justify-center items-center min-h-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading form schema...</p>
      </div>
    </div>
  );
}

/**
 * Error component displayed when schema fetch fails
 */
function FormError({ error }: { error: string }) {
  return (
    <div className="flex justify-center items-center min-h-100">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
        <h2 className="text-red-800 dark:text-red-400 font-semibold text-lg mb-2">
          Unable to Load Form
        </h2>
        <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
        <Link
          href="/"
          className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </Link>
      </div>
    </div>
  );
}

export default async function HomePage() {
  let schema;
  let error;

  try {
    schema = await fetchFormSchema();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load form schema';
  }

  if (error) {
    return (
      <main className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          Dynamic Form Builder
        </h1>
        <FormError error={error} />
      </main>
    );
  }

  if (!schema || schema.length === 0) {
    return (
      <main className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          Dynamic Form Builder
        </h1>
        <FormError error="No form fields found in schema" />
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Dynamic Form Builder
        </h1>
        <ThemeToggle />
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Fill out the form below. All fields marked with <span className="text-red-500">*</span> are required.
      </p>

      <Suspense fallback={<FormLoading />}>
        <DynamicForm schema={schema} />
      </Suspense>
    </main>
  );
}
