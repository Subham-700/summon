import { create, StateCreator } from 'zustand';

type FormValue = string | number | boolean | Date | undefined;

interface FormState {
  values: Record<string, FormValue>;
  errors: Record<string, string>;
  setValue: (id: string, value: FormValue) => void;
  setErrors: (errors: Record<string, string>) => void;
  resetErrors: () => void;
  resetForm: () => void;
}

/**
 * Zustand store for form state management
 * Handles form values, validation errors, and form actions
 */
const stateCreator: StateCreator<FormState> = (set) => ({
  values: {},
  errors: {},
  setValue: (id: string, value: FormValue) =>
    set((state: FormState) => ({
      values: { ...state.values, [id]: value },
    })),
  setErrors: (errors: Record<string, string>) => set({ errors }),
  resetErrors: () => set({ errors: {} }),
  resetForm: () => set({ values: {}, errors: {} }),
});

export const useFormStore = create<FormState>(stateCreator);
