import { FieldSchema } from '@/utils/SchemaTypes';

/**
 * Fetches the form schema from the remote API.
 * Falls back to local API if the remote endpoint is unavailable.
 */
export async function fetchFormSchema(): Promise<FieldSchema[]> {
  const remoteUrl = 'https://mocki.io/v1/785fb08b-0435-4ba4-8dd4-17bb658262cd';
  const localUrl = 'http://localhost:3000/api/schema';
  
  try {
    // Try fetching from the remote API first
    const res = await fetch(remoteUrl, { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (res.ok) {
      return res.json();
    }
    
    // If remote fails, try local fallback
    console.warn('Remote API unavailable, using local fallback');
    const localRes = await fetch(localUrl, { cache: 'no-store' });
    
    if (localRes.ok) {
      return localRes.json();
    }
    
    throw new Error('Both remote and local API endpoints failed');
  } catch (error) {
    console.error('Schema fetch error:', error);
    // Try local as last resort
    try {
      const localRes = await fetch(localUrl, { cache: 'no-store' });
      if (localRes.ok) {
        return localRes.json();
      }
    } catch (localError) {
      console.error('Local API also failed:', localError);
    }
    
    throw new Error('Failed to fetch form schema from any source');
  }
}
