/**
 * Form Ready - Vanilla JS Utilities
 * Form validation utilities for vanilla JavaScript.
 */

import { z } from 'zod';
import {
  validate,
  validateField,
  ValidationError
} from './index';

export interface FormConfig {
  schema: z.ZodType;
  onValid?: (data: Record<string, unknown>) => void;
  onInvalid?: (errors: ValidationError[]) => void;
  onChange?: (field: string, value: string, error: string | null) => void;
}

/**
 * Initialize a vanilla JS form with validation.
 */
export function initForm(form: HTMLFormElement, config: FormConfig): void {
  const { schema, onValid, onInvalid, onChange } = config;
  const fields = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-field]');

  // Track field states
  const fieldStates = new Map<string, { value: string; error: string | null }>();

  // Initialize fields
  fields.forEach(field => {
    const name = field.dataset.field;
    if (!name) return;

    fieldStates.set(name, { value: field.value, error: null });

    // Input event
    field.addEventListener('input', () => {
      const value = field.value;
      fieldStates.set(name, { value, error: null });

      const error = validateField(name, value, schema);
      const errorMsg = error?.message || null;

      updateFieldError(field, errorMsg);
      onChange?.(name, value, errorMsg);
    });

    // Blur event
    field.addEventListener('blur', () => {
      const state = fieldStates.get(name)!;
      const error = validateField(name, state.value, schema);

      if (error) {
        state.error = error.message;
        updateFieldError(field, error.message);
      }
    });
  });

  // Form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get all field values
    const data: Record<string, unknown> = {};
    fields.forEach(field => {
      const name = field.dataset.field;
      if (name) {
        data[name] = field.value;
      }
    });

    // Validate
    const result = validate(data, schema);

    if (result.success) {
      // Clear all errors
      fields.forEach(field => updateFieldError(field, null));
      onValid?.(result.data as Record<string, unknown>);
    } else {
      // Apply errors to fields
      result.errors.forEach(error => {
        const field = form.querySelector(`[data-field="${error.field}"]`) as HTMLInputElement;
        if (field) {
          updateFieldError(field, error.message);
        }
      });
      onInvalid?.(result.errors);
    }
  });
}

/**
 * Update field error display.
 */
function updateFieldError(field: HTMLInputElement | HTMLTextAreaElement, error: string | null): void {
  const container = field.closest('[data-field-container]') || field.parentElement;
  const errorEl = container?.querySelector('[data-error]') as HTMLElement | null;

  if (errorEl) {
    errorEl.textContent = error || '';
    errorEl.style.display = error ? 'block' : 'none';
  }

  // Toggle error class
  if (error) {
    field.setAttribute('aria-invalid', 'true');
    field.classList.add('form-error');
  } else {
    field.removeAttribute('aria-invalid');
    field.classList.remove('form-error');
  }
}

/**
 * Manually validate a field.
 */
export function validateFieldByName(form: HTMLFormElement, fieldName: string, schema: z.ZodType): string | null {
  const field = form.querySelector(`[data-field="${fieldName}"]`) as HTMLInputElement | null;
  if (!field) return null;

  const error = validateField(fieldName, field.value, schema);
  updateFieldError(field, error?.message || null);

  return error?.message || null;
}

/**
 * Reset form to initial state.
 */
export function resetForm(form: HTMLFormElement): void {
  form.reset();

  const fields = form.querySelectorAll<HTMLInputElement>('[data-field]');
  fields.forEach(field => {
    field.removeAttribute('aria-invalid');
    field.classList.remove('form-error');

    const container = field.closest('[data-field-container]') || field.parentElement;
    const errorEl = container?.querySelector('[data-error]') as HTMLElement | null;
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  });
}

/**
 * Set field value programmatically.
 */
export function setFieldValue(form: HTMLFormElement, fieldName: string, value: string): void {
  const field = form.querySelector(`[data-field="${fieldName}"]`) as HTMLInputElement | null;
  if (field) {
    field.value = value;
    field.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

/**
 * Set field error programmatically.
 */
export function setFieldError(form: HTMLFormElement, fieldName: string, message: string): void {
  const field = form.querySelector(`[data-field="${fieldName}"]`) as HTMLInputElement | null;
  if (field) {
    updateFieldError(field, message);
  }
}

/**
 * Get all form field values.
 */
export function getFormValues(form: HTMLFormElement): Record<string, string> {
  const values: Record<string, string> = {};
  const fields = form.querySelectorAll<HTMLInputElement>('[data-field]');

  fields.forEach(field => {
    const name = field.dataset.field;
    if (name) {
      values[name] = field.value;
    }
  });

  return values;
}