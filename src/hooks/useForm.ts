import { useState, useCallback, FormEvent } from 'react';
import type { UseFormParams, UseFormReturn, FormValue } from '@/types/hooks';

/**
 * 表单Hook - 实现表单状态管理和验证
 * 
 * @param {Object} params - 参数
 * @param {Object} params.initialValues - 初始表单值
 * @param {Function} params.onSubmit - 提交回调函数
 * @param {Function} [params.validate] - 验证函数，返回错误信息对象
 * @returns {UseFormReturn} 表单状态和方法
 * 
 * @example
 * ```tsx
 * const { 
 *   values, 
 *   errors, 
 *   touched, 
 *   handleChange, 
 *   handleBlur, 
 *   handleSubmit,
 *   resetForm 
 * } = useForm({
 *   initialValues: { email: '', password: '' },
 *   validate: (values) => {
 *     const errors: Record<string, string> = {};
 *     if (!values.email) errors.email = '邮箱不能为空';
 *     if (!values.password) errors.password = '密码不能为空';
 *     return errors;
 *   },
 *   onSubmit: async (values) => {
 *     await loginUser(values);
 *   }
 * });
 * ```
 */
function useForm<T extends Record<string, FormValue>>({
  initialValues,
  onSubmit,
  validate,
}: UseFormParams<T>): UseFormReturn<T> {
  // 表单值
  const [values, setValues] = useState<T>(initialValues);
  // 表单错误
  const [errors, setErrors] = useState<Record<string, string>>({});
  // 表单触摸状态
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  // 提交状态
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 验证表单
  const validateForm = useCallback(() => {
    if (!validate) return {};
    return validate(values);
  }, [values, validate]);

  // 处理输入值变化
  const handleChange = useCallback((name: keyof T, value: FormValue) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // 如果字段已经被触摸，实时验证
    if (touched[name as string] && validate) {
      const validationErrors = validate({
        ...values,
        [name]: value,
      });
      setErrors(validationErrors);
    }
  }, [values, touched, validate]);

  // 处理字段失去焦点
  const handleBlur = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // 字段失去焦点时验证
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
    }
  }, [values, validate]);

  // 设置字段值
  const setFieldValue = useCallback((name: keyof T, value: FormValue) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  // 设置字段错误
  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  // 重置表单
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // 处理表单提交
  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    
    // 验证所有字段
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    // 设置所有字段为已触摸
    const touchedFields = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(touchedFields);
    
    // 如果有错误，不提交
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    isSubmitting,
  };
}

export default useForm; 