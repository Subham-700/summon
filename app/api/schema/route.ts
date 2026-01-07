import { NextResponse } from 'next/server';
import { FieldSchema } from '@/utils/SchemaTypes';

/**
 * Mock form schema with various field types and validation rules
 * This demonstrates all supported field types and features including conditional fields
 */
const mockSchema: FieldSchema[] = [
  {
    id: 'name',
    label: 'Full Name',
    type: 'text',
    required: true,
    placeholder: 'Enter your full name',
    min: 2,
    max: 50,
  },
  {
    id: 'email',
    label: 'Email Address',
    type: 'text',
    required: true,
    placeholder: 'your.email@example.com',
  },
  {
    id: 'age',
    label: 'Age',
    type: 'number',
    required: true,
    min: 18,
    max: 100,
  },
  {
    id: 'role',
    label: 'Professional Role',
    type: 'select',
    required: true,
    options: ['Developer', 'Designer', 'Manager', 'Lawyer', 'Other'],
  },
  {
    id: 'lawyerLicense',
    label: 'Bar License Number',
    type: 'text',
    required: true,
    placeholder: 'Enter your bar license number',
    dependsOn: {
      fieldId: 'role',
      value: 'Lawyer',
    },
  },
  {
    id: 'experience',
    label: 'Years of Experience',
    type: 'number',
    required: false,
    min: 0,
    max: 50,
  },
  {
    id: 'country',
    label: 'Country',
    type: 'select',
    required: true,
    options: ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'France', 'Other'],
  },
  {
    id: 'subscribe',
    label: 'Subscribe to newsletter',
    type: 'checkbox',
    required: false,
    placeholder: 'I want to receive updates and newsletters',
  },
  {
    id: 'birthdate',
    label: 'Date of Birth',
    type: 'date',
    required: false,
  },
];

export async function GET() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json(mockSchema);
}
