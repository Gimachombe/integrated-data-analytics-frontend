import { z } from 'zod';

// Authentication Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional().default(false),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string(),
    phone: z.string().optional(),
    companyName: z.string().optional(),
    kraPin: z.string().optional(),
    agreeToTerms: z
      .boolean()
      .refine(val => val === true, 'You must agree to the terms and conditions'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Service Request Schemas
export const dataServiceSchema = z.object({
  serviceType: z.enum(['mining', 'cleaning', 'collection', 'analysis']),
  dataSource: z.string().optional(),
  requirements: z.string().min(10, 'Requirements must be at least 10 characters'),
  deadline: z.string().optional(),
  specialInstructions: z.string().optional(),
  files: z.array(z.instanceof(File)).optional(),
});

export const businessRegistrationSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  registrationType: z.enum(['name_search', 'incorporation']),
  businessType: z.string().min(1, 'Business type is required'),
  owners: z
    .array(
      z.object({
        name: z.string(),
        idNumber: z.string(),
        sharePercentage: z.number().min(0).max(100),
      })
    )
    .min(1, 'At least one owner is required'),
  address: z.object({
    physical: z.string(),
    postal: z.string().optional(),
    city: z.string(),
    country: z.string().default('Kenya'),
  }),
  documents: z.array(z.instanceof(File)).optional(),
});

export const kraServiceSchema = z.object({
  serviceType: z.enum(['pin_registration', 'tax_filing', 'compliance']),
  idNumber: z.string().min(5, 'ID number is required'),
  fullName: z.string().min(2, 'Full name is required'),
  dob: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date of birth'),
  address: z.string().min(5, 'Address is required'),
  taxType: z.enum(['income', 'vat', 'paye', 'withholding']).optional(),
  period: z.string().optional(),
  amount: z.number().min(0).optional(),
  documents: z.array(z.instanceof(File)).optional(),
});

export const bookkeepingSchema = z.object({
  serviceType: z.enum(['bookkeeping', 'audit_prep']),
  financialPeriod: z.string().min(1, 'Financial period is required'),
  businessSize: z.enum(['small', 'medium', 'large']),
  requirements: z.string().optional(),
  documents: z.array(z.instanceof(File)).optional(),
});

// Payment Schemas
export const mpesaPaymentSchema = z.object({
  phoneNumber: z.string().regex(/^(?:254|\+254|0)?(7\d{8})$/, 'Invalid Kenyan phone number'),
  amount: z.number().min(1).max(150000, 'Amount must be between 1 and 150,000'),
  serviceId: z.string().optional(),
  serviceType: z.string().optional(),
  description: z.string().optional(),
});

export const stripePaymentSchema = z.object({
  amount: z.number().min(0.5, 'Amount must be at least 0.50'),
  currency: z.string().default('kes'),
  serviceId: z.string().optional(),
  serviceType: z.string().optional(),
  customerEmail: z.string().email('Valid email is required'),
  customerName: z.string().min(2, 'Name is required'),
});

export const bankTransferSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least 1'),
  currency: z.string().default('kes'),
  serviceId: z.string().optional(),
  serviceType: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  proofOfPayment: z.instanceof(File).optional(),
});

// User Profile Schema
export const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  kraPin: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

// Password Change Schema
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(6, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Contact Form Schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Export all schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type DataServiceFormData = z.infer<typeof dataServiceSchema>;
export type BusinessRegistrationFormData = z.infer<typeof businessRegistrationSchema>;
export type KRAServiceFormData = z.infer<typeof kraServiceSchema>;
export type BookkeepingFormData = z.infer<typeof bookkeepingSchema>;
export type MpesaPaymentFormData = z.infer<typeof mpesaPaymentSchema>;
export type StripePaymentFormData = z.infer<typeof stripePaymentSchema>;
export type BankTransferFormData = z.infer<typeof bankTransferSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
