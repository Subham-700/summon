import { FieldSchema } from '@/utils/SchemaTypes';

/**
 * Fallback schema in case all API endpoints fail
 */
const FALLBACK_SCHEMA: FieldSchema[] = [
  {
    id: 'name',
    type: 'text',
    label: 'Full Name',
    required: true,
    placeholder: 'Enter your full name',
  },
  {
    id: 'email',
    type: 'text',
    label: 'Email Address',
    required: true,
    placeholder: 'your.email@example.com',
  },
  {
    id: 'age',
    type: 'number',
    label: 'Age',
    required: true,
    min: 18,
    max: 100,
  },
  {
    id: 'country',
    type: 'select',
    label: 'Country',
    required: true,
    options: ['United States', 'United Kingdom', 'Canada', 'Australia'],
  },
  {
    id: 'subscribe',
    type: 'checkbox',
    label: 'Subscribe to newsletter',
    required: false,
  },
];

/**
 * Fetches the form schema from the remote API.
 * Falls back to local API if the remote endpoint is unavailable.
 * Uses inline fallback schema if all endpoints fail.
 */
export async function fetchFormSchema(): Promise<FieldSchema[]> {
  const remoteUrl = 'https://mocki.io/v1/785fb08b-0435-4ba4-8dd4-17bb658262cd';
  
  // In production, use the deployment URL; in development, use localhost
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                  'http://localhost:3000';
  const localUrl = `${baseUrl}/api/schema`;
  
  try {
    // Try fetching from the remote API first
    const res = await fetch(remoteUrl, { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (res.ok) {
      const data = await res.json();
      console.log('✓ Schema loaded from remote API');
      return data;
    }
    
    // If remote fails, try local fallback
    console.warn('Remote API unavailable, using local fallback');
    const localRes = await fetch(localUrl, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (localRes.ok) {
      const data = await localRes.json();
      console.log('✓ Schema loaded from local API');
      return data;
    }
    
    console.warn('Both remote and local API endpoints failed, using fallback schema');
    return FALLBACK_SCHEMA;
  } catch (error) {
    console.error('Schema fetch error:', error);
    // Try local as last resort
    try {
      const localRes = await fetch(localUrl, { 
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' }
      });
      if (localRes.ok) {
        const data = await localRes.json();
        console.log('✓ Schema loaded from local API (fallback)');
        return data;
      }
    } catch (localError) {
      console.error('Local API also failed:', localError);
    }
    
    // Return fallback schema instead of throwing
    console.warn('Using fallback schema');
    return FALLBACK_SCHEMA;
  }
}
