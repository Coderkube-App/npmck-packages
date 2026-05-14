/**
 * Form Ready - Core Validation Engine
 * Universal form validation with Zod schema support.
 */

import { z } from 'zod';

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormResult<T> {
  success: boolean;
  data?: T;
  errors: ValidationError[];
}

export interface FieldState {
  value: string;
  error?: string;
  touched: boolean;
}

/**
 * Core validation function - validates data against a Zod schema.
 */
export function validate<T extends z.ZodType>(
  data: Record<string, unknown>,
  schema: T
): FormResult<z.infer<T>> {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
      errors: []
    };
  }

  const errors: ValidationError[] = result.error.issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message
  }));

  return {
    success: false,
    errors
  };
}

/**
 * Validate a single field against a Zod schema.
 */
export function validateField(
  fieldName: string,
  value: unknown,
  schema: z.ZodType
): ValidationError | null {
  const def = (schema as any)._def;
  const shape = def?.shape;
  if (!shape || !shape[fieldName]) return null;

  const fieldSchema = shape[fieldName];
  const result = fieldSchema.safeParse(value);

  if (result.success) {
    return null;
  }

  return {
    field: fieldName,
    message: result.error.issues[0]?.message || 'Invalid value'
  };
}

/**
 * Create a form state from initial values.
 */
export function createFormState<T extends Record<string, unknown>>(
  initialValues: T
): Record<keyof T, FieldState> {
  const state = {} as Record<keyof T, FieldState>;

  for (const [key, value] of Object.entries(initialValues)) {
    state[key as keyof T] = {
      value: String(value ?? ''),
      touched: false
    };
  }

  return state;
}

/**
 * Clear all errors from form state.
 */
export function clearErrors<T extends Record<string, FieldState>>(
  state: T
): T {
  const cleared = {} as Record<keyof T, FieldState>;

  for (const [key, field] of Object.entries(state)) {
    cleared[key as keyof T] = {
      value: field.value,
      touched: field.touched,
      error: undefined
    };
  }

  return cleared as T;
}

/**
 * Set field value and validate.
 */
export function setFieldValue<T extends Record<string, FieldState>>(
  state: T,
  fieldName: keyof T,
  value: string,
  schema?: z.ZodType
): T {
  const updated = { ...state };
  const field = { ...updated[fieldName] };

  field.value = value;
  field.touched = true;

  if (schema) {
    const error = validateField(fieldName as string, value, schema);
    field.error = error?.message;
  }

  updated[fieldName] = field;
  return updated;
}

/**
 * Mark field as touched.
 */
export function touchField<T extends Record<string, FieldState>>(
  state: T,
  fieldName: keyof T
): T {
  const updated = { ...state };
  updated[fieldName] = { ...updated[fieldName], touched: true };
  return updated;
}

/**
 * Apply errors from validation result to form state.
 */
export function applyErrors<T extends Record<string, FieldState>>(
  state: T,
  errors: ValidationError[]
): T {
  const updated = { ...state };

  for (const error of errors) {
    const fieldName = error.field as keyof T;
    if (fieldName in updated) {
      updated[fieldName] = {
        ...updated[fieldName],
        error: error.message
      };
    }
  }

  return updated;
}

/**
 * Check if form has any errors.
 */
export function hasErrors<T extends Record<string, FieldState>>(
  state: T
): boolean {
  return Object.values(state).some(field => !!field.error);
}

/**
 * Check if form is valid (all fields touched and no errors).
 */
export function isFormValid<T extends Record<string, FieldState>>(
  state: T
): boolean {
  const allTouched = Object.values(state).every(field => field.touched);
  const noErrors = !hasErrors(state);
  return allTouched && noErrors;
}

/**
 * Get all field values as plain object.
 */
export function getValues<T extends Record<string, FieldState>>(
  state: T
): Record<string, string> {
  const values: Record<string, string> = {};

  for (const [key, field] of Object.entries(state)) {
    values[key] = field.value;
  }

  return values;
}