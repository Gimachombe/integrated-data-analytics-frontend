// 'use client';

// import { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import PaymentForm from '@/components/PaymentForm';
// import { FiCheckCircle, FiClock, FiDollarSign } from 'react-icons/fi';
// import Link from 'next/link';

// export default function PaymentPage() {
//   const searchParams = useSearchParams();
//   const [paymentDetails, setPaymentDetails] = useState<any>(null);

//   const serviceId = searchParams.get('serviceId');
//   const serviceType = searchParams.get('serviceType');
//   const amount = parseFloat(searchParams.get('amount') || '0');

//   useEffect(() => {
//     // Fetch service details if serviceId is provided
//     if (serviceId) {
//       // Fetch service details from API
//       const fetchServiceDetails = async () => {
//         try {
//           const response = await fetch(`/api/services/${serviceId}`, {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`,
//             },
//           });
//           const data = await response.json();
//           setPaymentDetails(data);
//         } catch (error) {
//           console.error('Failed to fetch service details:', error);
//         }
//       };

//       fetchServiceDetails();
//     }
//   }, [serviceId]);

//   const handlePaymentSuccess = (paymentResult: any) => {
//     console.log('Payment successful:', paymentResult);
//     // Redirect to success page or show success message
//     window.location.href = `/payment/success?transactionId=${paymentResult.payment?.transaction_id}`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="lg:grid lg:grid-cols-3 lg:gap-8">
//           {/* Left Column - Payment Summary */}
//           <div className="lg:col-span-1 mb-8 lg:mb-0">
//             <div className="bg-white rounded-lg shadow p-6 sticky top-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

//               {paymentDetails ? (
//                 <div className="space-y-4">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Service:</span>
//                     <span className="font-medium">{paymentDetails.serviceType}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Reference:</span>
//                     <span className="font-mono text-sm">{paymentDetails.reference}</span>
//                   </div>
//                   <div className="border-t pt-4">
//                     <div className="flex justify-between text-lg font-bold">
//                       <span>Total:</span>
//                       <span className="text-primary-600">KES {amount.toLocaleString()}</span>
//                     </div>
//                     <p className="text-sm text-gray-500 mt-1">VAT included</p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Service:</span>
//                     <span className="font-medium">{serviceType || 'General Service'}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Amount:</span>
//                     <span className="font-medium">KES {amount.toLocaleString()}</span>
//                   </div>
//                 </div>
//               )}

//               {/* Payment Methods Info */}
//               <div className="mt-8 pt-6 border-t">
//                 <h3 className="text-sm font-medium text-gray-900 mb-3">Accepted Payment Methods</h3>
//                 <div className="grid grid-cols-3 gap-2">
//                   <div className="text-center p-2 border rounded-lg">
//                     <FiSmartphone className="mx-auto h-6 w-6 text-green-600" />
//                     <span className="text-xs mt-1 block">M-Pesa</span>
//                   </div>
//                   <div className="text-center p-2 border rounded-lg">
//                     <FiCreditCard className="mx-auto h-6 w-6 text-blue-600" />
//                     <span className="text-xs mt-1 block">Cards</span>
//                   </div>
//                   <div className="text-center p-2 border rounded-lg">
//                     <FiBank className="mx-auto h-6 w-6 text-purple-600" />
//                     <span className="text-xs mt-1 block">Bank Transfer</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Security Info */}
//               <div className="mt-6 pt-6 border-t">
//                 <div className="flex items-center text-sm text-gray-600">
//                   <FiShield className="h-5 w-5 text-green-500 mr-2" />
//                   <span>Secure SSL Encryption</span>
//                 </div>
//                 <div className="flex items-center text-sm text-gray-600 mt-2">
//                   <FiLock className="h-5 w-5 text-green-500 mr-2" />
//                   <span>Your payment is secure</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Payment Form */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow p-6">
//               <PaymentForm
//                 serviceId={serviceId || undefined}
//                 serviceType={serviceType || undefined}
//                 amount={amount}
//                 onSuccess={handlePaymentSuccess}
//                 onCancel={() => window.history.back()}
//               />
//             </div>

//             {/* Additional Information */}
//             <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="bg-white rounded-lg shadow p-6">
//                 <FiCheckCircle className="h-8 w-8 text-green-500 mb-4" />
//                 <h3 className="font-semibold text-gray-900 mb-2">Instant Confirmation</h3>
//                 <p className="text-sm text-gray-600">
//                   Receive immediate confirmation of your payment
//                 </p>
//               </div>
//               <div className="bg-white rounded-lg shadow p-6">
//                 <FiClock className="h-8 w-8 text-blue-500 mb-4" />
//                 <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
//                 <p className="text-sm text-gray-600">
//                   Our support team is available round the clock
//                 </p>
//               </div>
//               <div className="bg-white rounded-lg shadow p-6">
//                 <FiDollarSign className="h-8 w-8 text-purple-500 mb-4" />
//                 <h3 className="font-semibold text-gray-900 mb-2">Money Back Guarantee</h3>
//                 <p className="text-sm text-gray-600">
//                   30-day refund policy for unsatisfied services
//                 </p>
//               </div>
//             </div>

//             {/* FAQ */}
//             <div className="mt-8 bg-white rounded-lg shadow p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Frequently Asked Questions
//               </h3>
//               <div className="space-y-4">
//                 <div>
//                   <h4 className="font-medium text-gray-900">
//                     How long does payment verification take?
//                   </h4>
//                   <p className="text-sm text-gray-600 mt-1">
//                     M-Pesa payments are instant. Card payments take 2-3 minutes. Bank transfers may
//                     take 24 hours.
//                   </p>
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-gray-900">Is my payment information secure?</h4>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Yes, we use bank-level encryption and never store your card details.
//                   </p>
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-gray-900">
//                     Can I get an invoice for my payment?
//                   </h4>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Yes, invoices are automatically generated and available in your dashboard.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
