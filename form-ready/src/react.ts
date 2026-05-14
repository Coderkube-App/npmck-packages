/**
 * Form Ready - React Hooks
 * React hooks for form validation and handling.
 */

import { useState, useCallback } from 'react';
import { z } from 'zod';
import {
  validate,
  setFieldValue,
  touchField,
  applyErrors,
  clearErrors,
  hasErrors,
  isFormValid,
  getValues,
  createFormState,
  ValidationError,
  FieldState
} from './index';

export interface UseFormOptions<T extends Record<string, unknown>> {
  schema: z.ZodType<T>;
  initialValues: T;
  onSubmit?: (data: T) => void | Promise<void>;
}

export interface UseFormReturn<T extends Record<string, unknown>> {
  values: Record<keyof T, FieldState>;
  errors: ValidationError[];
  isValid: boolean;
  isSubmitting: boolean;
  handleChange: (field: keyof T) => (value: string) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (e: React.FormEvent) => void | Promise<void>;
  setFieldError: (field: keyof T, message: string) => void;
  reset: () => void;
  validateAll: () => boolean;
}

/**
 * useForm - React hook for form validation with Zod.
 */
export function useForm<T extends Record<string, unknown>>(
  options: UseFormOptions<T>
): UseFormReturn<T> {
  const { schema, initialValues, onSubmit } = options;

  const [formState, setFormState] = useState(() => createFormState(initialValues));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((field: keyof T) => (value: string) => {
    setFormState(prev => setFieldValue(prev, field, value, schema));
  }, [schema]);

  const handleBlur = useCallback((field: keyof T) => () => {
    setFormState(prev => touchField(prev, field));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const touchedState = Object.keys(formState).reduce((acc, key) => {
      acc[key as keyof T] = { ...formState[key as keyof T], touched: true };
      return acc;
    }, {} as Record<keyof T, FieldState>);

    setFormState(touchedState);

    // Validate
    const values = getValues(touchedState);
    const result = validate(values, schema);

    if (!result.success) {
      setFormState(prev => applyErrors(prev, result.errors));
      return;
    }

    // Clear errors and submit
    setFormState(prev => clearErrors(prev));

    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(result.data as T);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [formState, schema, onSubmit]);

  const setFieldError = useCallback((field: keyof T, message: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: { ...prev[field], error: message, touched: true }
    }));
  }, []);

  const reset = useCallback(() => {
    setFormState(createFormState(initialValues));
  }, [initialValues]);

  const validateAll = useCallback(() => {
    const values = getValues(formState);
    const result = validate(values, schema);

    if (!result.success) {
      setFormState(prev => applyErrors(prev, result.errors));
      return false;
    }

    return true;
  }, [formState, schema]);

  const errors = Object.values(formState)
    .filter(f => f.error)
    .map(f => ({ field: '', message: f.error! }));

  return {
    values: formState,
    errors,
    isValid: isFormValid(formState),
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldError,
    reset,
    validateAll
  };
}

/**
 * useField - Hook for single field validation.
 */
export function useField<T extends z.ZodType>(
  name: string,
  schema: T,
  initialValue: string = ''
) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);

    if (touched) {
      const def = (schema as any)._def;
      const shape = def?.shape;
      const fieldSchema = shape?.[name];
      const result = fieldSchema?.safeParse(newValue);
      setError(result?.success ? null : result?.error.issues[0]?.message || null);
    }
  }, [schema, name, touched]);

  const handleBlur = useCallback(() => {
    setTouched(true);

    const def = (schema as any)._def;
    const shape = def?.shape;
    const fieldSchema = shape?.[name];
    const result = fieldSchema?.safeParse(value);
    setError(result?.success ? null : result?.error.issues[0]?.message || null);
  }, [schema, name, value]);

  return {
    value,
    error,
    touched,
    onChange: handleChange,
    onBlur: handleBlur
  };
}