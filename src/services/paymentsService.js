import api from './api';

const paymentsService = {
  initiatePayment: async (payload) => {
    const response = await api.post('/payments/initiate', payload);
    return response.data;
  },

  confirmPayment: async (payload) => {
    const response = await api.post('/payments/confirm', payload);
    return response.data;
  },

  // Helper to interpret mock adapter outcomes from the payment gateway response
  getMockOutcome: (paymentResponse) => {
    if (!paymentResponse) return null;
    const { status, failureReason, gatewayReference } = paymentResponse;
    return {
      status: status || null,
      failureReason: failureReason || null,
      gatewayReference: gatewayReference || null,
      isSuccess: status === 'SUCCESS',
      isFailure: status === 'FAILURE',
      isPending: status === 'PENDING',
    };
  },
};

export default paymentsService;
