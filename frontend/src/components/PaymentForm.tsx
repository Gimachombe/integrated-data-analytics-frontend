'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const paymentSchema = z
  .object({
    paymentMethod: z.enum(['mpesa', 'card', 'bank_transfer']),
    amount: z.number().min(1),
    phoneNumber: z.string().optional(),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvc: z.string().optional(),
    cardholderName: z.string().optional(),
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    accountName: z.string().optional(),
  })
  .refine(
    data => {
      if (data.paymentMethod === 'mpesa') {
        return data.phoneNumber && data.phoneNumber.length >= 10;
      }
      return true;
    },
    {
      message: 'Phone number is required for Mpesa',
      path: ['phoneNumber'],
    }
  )
  .refine(
    data => {
      if (data.paymentMethod === 'card') {
        return data.cardNumber && data.cardExpiry && data.cardCvc && data.cardholderName;
      }
      return true;
    },
    {
      message: 'All card details are required for card payment',
      path: ['cardNumber'],
    }
  )
  .refine(
    data => {
      if (data.paymentMethod === 'bank_transfer') {
        return data.bankName && data.accountNumber && data.accountName;
      }
      return true;
    },
    {
      message: 'All bank details are required for bank transfer',
      path: ['bankName'],
    }
  );

export default function PaymentForm({
  serviceId,
  serviceType,
  amount,
  onSuccess,
}: {
  serviceId: string;
  serviceType: string;
  amount: number;
  onSuccess: (payment: any) => void;
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: 'mpesa',
      amount,
    },
  });

  const selectedMethod = watch('paymentMethod');

  const onSubmit = async (data: any) => {
    setIsProcessing(true);
    try {
      // Prepare payment details based on method
      let paymentDetails = {};
      if (data.paymentMethod === 'mpesa') {
        paymentDetails = { phoneNumber: data.phoneNumber };
      } else if (data.paymentMethod === 'card') {
        paymentDetails = {
          cardNumber: data.cardNumber,
          cardExpiry: data.cardExpiry,
          cardCvc: data.cardCvc,
          cardholderName: data.cardholderName,
        };
      } else if (data.paymentMethod === 'bank_transfer') {
        paymentDetails = {
          bankName: data.bankName,
          accountNumber: data.accountNumber,
          accountName: data.accountName,
        };
      }

      const response = await fetch('/api/payments/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          serviceId,
          serviceType,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          paymentDetails,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        onSuccess(result);
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
        <div className="mt-2 space-y-2">
          {['mpesa', 'card', 'bank_transfer'].map(method => (
            <label key={method} className="flex items-center">
              <input
                type="radio"
                value={method}
                {...register('paymentMethod')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">
                {method === 'mpesa' ? 'Mpesa' : method === 'card' ? 'Card' : 'Bank Transfer'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Conditional Fields */}
      {selectedMethod === 'mpesa' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            {...register('phoneNumber')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            placeholder="07XX XXX XXX"
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
          )}
        </div>
      )}

      {selectedMethod === 'card' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Card Number</label>
            <input
              type="text"
              {...register('cardNumber')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              placeholder="1234 5678 9012 3456"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry</label>
              <input
                type="text"
                {...register('cardExpiry')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                placeholder="MM/YY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CVC</label>
              <input
                type="text"
                {...register('cardCvc')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                placeholder="123"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
              <input
                type="text"
                {...register('cardholderName')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                placeholder="John Doe"
              />
            </div>
          </div>
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
          )}
        </div>
      )}

      {selectedMethod === 'bank_transfer' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bank Name</label>
            <input
              type="text"
              {...register('bankName')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              placeholder="Bank Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Number</label>
            <input
              type="text"
              {...register('accountNumber')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              placeholder="Account Number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Name</label>
            <input
              type="text"
              {...register('accountName')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              placeholder="Account Name"
            />
          </div>
          {errors.bankName && (
            <p className="mt-1 text-sm text-red-600">{errors.bankName.message}</p>
          )}
        </div>
      )}

      {/* Amount (display only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Amount (KES)</label>
        <input
          type="number"
          {...register('amount', { valueAsNumber: true })}
          disabled
          className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500"
        />
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : `Pay KES ${amount}`}
      </button>
    </form>
  );
}
