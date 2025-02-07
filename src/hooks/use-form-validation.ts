import { useState, useCallback, useEffect } from 'react';
import { z } from 'zod';

type FormData = Record<string, string | number | boolean>;

interface ValidationOptions<T extends FormData> {
  schema: z.ZodObject<z.ZodRawShape>;
  onSuccess?: (data: T) => void;
  onError?: (errors: Record<string, string>) => void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface ValidationState {
  errors: Record<string, string>;
  isValid: boolean;
  isDirty: Record<string, boolean>;
  isSubmitting: boolean;
  submitCount: number;
  successMessage: string;
  touched: Record<string, boolean>;
}

export function useFormValidation<T extends FormData>({ 
  schema, 
  onSuccess, 
  onError,
  validateOnChange = true,
  validateOnBlur = true
}: ValidationOptions<T>) {
  const [state, setState] = useState<ValidationState>({
    errors: {},
    isValid: false,
    isDirty: {},
    isSubmitting: false,
    submitCount: 0,
    successMessage: '',
    touched: {}
  });

  const [formData, setFormData] = useState<Partial<T>>({});

  const validateField = useCallback((name: keyof T, value: T[keyof T], shouldUpdateForm = true) => {
    try {
      schema.pick({ [name]: true as const }).parse({ [name]: value });
      setState(prev => ({
        ...prev,
        errors: { ...prev.errors, [name]: '' },
        isDirty: { ...prev.isDirty, [name]: true },
        touched: { ...prev.touched, [name]: true }
      }));
      
      if (shouldUpdateForm) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
      
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors[0]?.message || 'Invalid input';
        setState(prev => ({
          ...prev,
          errors: { ...prev.errors, [name]: message },
          isDirty: { ...prev.isDirty, [name]: true },
          touched: { ...prev.touched, [name]: true },
          isValid: false
        }));
      }
      return false;
    }
  }, [schema]);

  const validateForm = useCallback(async (data: Partial<T>) => {
    setState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      const validated = schema.parse(data) as T;
      setState(prev => ({ 
        ...prev, 
        isValid: true, 
        errors: {},
        isSubmitting: false,
        submitCount: prev.submitCount + 1,
        successMessage: 'Form submitted successfully'
      }));
      
      await onSuccess?.(validated);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.reduce((acc, curr) => {
          const path = curr.path.join('.');
          acc[path] = curr.message;
          return acc;
        }, {} as Record<string, string>);
        
        setState(prev => ({ 
          ...prev, 
          isValid: false, 
          errors,
          isSubmitting: false,
          submitCount: prev.submitCount + 1,
          successMessage: ''
        }));
        
        onError?.(errors);
      }
      return false;
    }
  }, [schema, onSuccess, onError]);

  const handleChange = useCallback((name: keyof T, value: T[keyof T]) => {
    if (validateOnChange) {
      validateField(name, value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, [validateOnChange, validateField]);

  const handleBlur = useCallback((name: keyof T) => {
    if (validateOnBlur && formData[name] !== undefined) {
      validateField(name, formData[name] as T[keyof T]);
    }
  }, [validateOnBlur, validateField, formData]);

  const resetValidation = useCallback(() => {
    setState({
      errors: {},
      isValid: false,
      isDirty: {},
      isSubmitting: false,
      submitCount: 0,
      successMessage: '',
      touched: {}
    });
    setFormData({});
  }, []);

  useEffect(() => {
    // Clear success message after 3 seconds
    if (state.successMessage) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, successMessage: '' }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.successMessage]);

  return {
    ...state,
    formData,
    validateField,
    validateForm,
    resetValidation,
    handleChange,
    handleBlur,
    setFormData
  };
} 