import { useState } from 'react';
import axios from 'axios';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [payment, setPayment] = useState(null);

  const initiatePayment = async paymentData => {
    setLoading(true);
    setError(null);

    try {
      let endpoint;
      let data;

      switch (paymentData.method) {
        case 'mpesa':
          endpoint = '/api/payments/mpesa';
          data = {
            phoneNumber: paymentData.phoneNumber,
            amount: paymentData.amount,
            serviceId: paymentData.serviceId,
            serviceType: paymentData.serviceType,
            description: paymentData.description,
          };
          break;

        case 'card':
          endpoint = '/api/payments/stripe';
          data = {
            amount: paymentData.amount,
            currency: paymentData.currency || 'kes',
            serviceId: paymentData.serviceId,
            serviceType: paymentData.serviceType,
            customerEmail: paymentData.customerEmail,
            customerName: paymentData.customerName,
          };
          break;

        case 'bank_transfer':
          endpoint = '/api/payments/bank-transfer';
          data = {
            amount: paymentData.amount,
            currency: paymentData.currency || 'kes',
            serviceId: paymentData.serviceId,
            serviceType: paymentData.serviceType,
          };
          break;

        default:
          throw new Error('Invalid payment method');
      }

      const response = await axios.post(endpoint, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setPayment(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Payment failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async transactionId => {
    try {
      const response = await axios.get(`/api/payments/status/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to check payment status');
    }
  };

  const getPaymentHistory = async (params = {}) => {
    try {
      const response = await axios.get('/api/payments/history', {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to fetch payment history');
    }
  };

  const generateInvoice = async paymentId => {
    try {
      const response = await axios.get(`/api/payments/invoice/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to generate invoice');
    }
  };

  return {
    loading,
    error,
    payment,
    initiatePayment,
    checkPaymentStatus,
    getPaymentHistory,
    generateInvoice,
  };
};
