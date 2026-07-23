import * as yup from 'yup';

/**
 * Validation schema for the login form.
 */
export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

/**
 * Validation schema for the registration form.
 */
export const registerSchema = yup.object({
  name: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
  phone: yup
    .string()
    .optional()
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
});

/**
 * Validation schema for shipping/delivery address.
 */
export const addressSchema = yup.object({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  addressLine1: yup
    .string()
    .required('Address line 1 is required')
    .max(200, 'Address must not exceed 200 characters'),
  addressLine2: yup
    .string()
    .optional()
    .max(200, 'Address must not exceed 200 characters'),
  city: yup
    .string()
    .required('City is required')
    .max(100, 'City must not exceed 100 characters'),
  state: yup
    .string()
    .required('State is required'),
  pincode: yup
    .string()
    .required('Pincode is required')
    .matches(/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit pincode'),
});

/**
 * Validation schema for product search/filter.
 */
export const searchSchema = yup.object({
  query: yup
    .string()
    .optional()
    .max(200, 'Search query must not exceed 200 characters'),
  minPrice: yup
    .number()
    .optional()
    .min(0, 'Minimum price cannot be negative'),
  maxPrice: yup
    .number()
    .optional()
    .min(0, 'Maximum price cannot be negative')
    .when('minPrice', (minPrice, schema) =>
      minPrice
        ? schema.min(minPrice, 'Maximum price must be greater than minimum price')
        : schema
    ),
});

/**
 * Validation schema for product review submission.
 */
export const reviewSchema = yup.object({
  rating: yup
    .number()
    .required('Rating is required')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must not exceed 5'),
  title: yup
    .string()
    .optional()
    .max(150, 'Review title must not exceed 150 characters'),
  body: yup
    .string()
    .required('Review text is required')
    .min(10, 'Review must be at least 10 characters')
    .max(2000, 'Review must not exceed 2000 characters'),
});

/**
 * Validation schema for contact / support form.
 */
export const contactSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  subject: yup
    .string()
    .required('Subject is required')
    .max(200, 'Subject must not exceed 200 characters'),
  message: yup
    .string()
    .required('Message is required')
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message must not exceed 2000 characters'),
});

/**
 * Validation schema for forgot-password email entry.
 */
export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
});

/**
 * Validation schema for reset-password form.
 */
export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});
