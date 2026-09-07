const { v4: uuidv4 } = require('uuid');
const db = require('../../config/database');
const adapterRegistry = require('../../adapters/adapterRegistry');

/**
 * Persists a new payment_attempt record.
 * @param {object} params
 * @returns {Promise<object>}
 */
async function createPaymentAttempt(params) {
  const {
    paymentId,
    orderId,
    amount,
    currency,
    provider,
    status,
    metadata,
  } = params;

  const [attempt] = await db('payment_attempts')
    .insert({
      id: uuidv4(),
      payment_id: paymentId,
      order_id: orderId,
      amount,
      currency,
      provider,
      status,
      metadata: JSON.stringify(metadata || {}),
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    })
    .returning('*');

  return attempt;
}

/**
 * Updates an existing payment_attempt record.
 * @param {string} paymentId
 * @param {object} updates
 * @returns {Promise<object>}
 */
async function updatePaymentAttempt(paymentId, updates) {
  const [attempt] = await db('payment_attempts')
    .where({ payment_id: paymentId })
    .orderBy('created_at', 'desc')
    .limit(1)
    .update({
      ...updates,
      updated_at: db.fn.now(),
    })
    .returning('*');

  return attempt;
}

/**
 * Retrieves the latest payment attempt for a given paymentId.
 * @param {string} paymentId
 * @returns {Promise<object|null>}
 */
async function getLatestPaymentAttempt(paymentId) {
  const attempt = await db('payment_attempts')
    .where({ payment_id: paymentId })
    .orderBy('created_at', 'desc')
    .first();

  return attempt || null;
}

/**
 * Initiates a new payment via the active provider adapter.
 * REQ-32
 * @param {object} payload
 * @returns {Promise<object>}
 */
async function initiatePayment(payload) {
  const { orderId, amount, currency, provider, metadata } = payload;

  const paymentId = uuidv4();
  const adapter = adapterRegistry.getAdapter(provider);

  // Persist initial attempt
  await createPaymentAttempt({
    paymentId,
    orderId,
    amount,
    currency,
    provider,
    status: 'pending',
    metadata,
  });

  let providerResponse;
  try {
    providerResponse = await adapter.initiatePayment({
      paymentId,
      orderId,
      amount,
      currency,
      metadata,
    });
  } catch (err) {
    await updatePaymentAttempt(paymentId, { status: 'failed', provider_error: err.message });
    throw err;
  }

  await updatePaymentAttempt(paymentId, {
    status: providerResponse.status || 'initiated',
    provider_reference: providerResponse.reference || null,
    provider_response: JSON.stringify(providerResponse),
  });

  return {
    paymentId,
    status: providerResponse.status || 'initiated',
    providerReference: providerResponse.reference || null,
    redirectUrl: providerResponse.redirectUrl || null,
  };
}

/**
 * Handles a provider callback / webhook.
 * REQ-33
 * @param {object} body
 * @param {object} headers
 * @returns {Promise<object>}
 */
async function handleCallback(body, headers) {
  const { provider, paymentId, status, reference } = body;

  const adapter = adapterRegistry.getAdapter(provider);

  // Verify callback authenticity via adapter
  const verified = await adapter.verifyCallback(body, headers);
  if (!verified) {
    const err = new Error('Invalid callback signature.');
    err.statusCode = 400;
    throw err;
  }

  const normalizedStatus = adapter.normalizeStatus(status);

  await updatePaymentAttempt(paymentId, {
    status: normalizedStatus,
    provider_reference: reference || null,
    provider_response: JSON.stringify(body),
  });

  return { paymentId, status: normalizedStatus };
}

/**
 * Confirms a pending payment.
 * @param {object} payload
 * @returns {Promise<object>}
 */
async function confirmPayment(payload) {
  const { paymentId, provider } = payload;

  const attempt = await getLatestPaymentAttempt(paymentId);
  if (!attempt) {
    const err = new Error('Payment not found.');
    err.statusCode = 404;
    throw err;
  }

  const adapter = adapterRegistry.getAdapter(provider || attempt.provider);

  let providerResponse;
  try {
    providerResponse = await adapter.confirmPayment({ paymentId, attempt });
  } catch (err) {
    await updatePaymentAttempt(paymentId, { status: 'failed', provider_error: err.message });
    throw err;
  }

  const normalizedStatus = adapter.normalizeStatus(providerResponse.status);

  await updatePaymentAttempt(paymentId, {
    status: normalizedStatus,
    provider_reference: providerResponse.reference || attempt.provider_reference,
    provider_response: JSON.stringify(providerResponse),
  });

  return { paymentId, status: normalizedStatus };
}

/**
 * Retrieves a payment record by paymentId.
 * REQ-34
 * @param {string} paymentId
 * @returns {Promise<object|null>}
 */
async function getPaymentById(paymentId) {
  const attempt = await getLatestPaymentAttempt(paymentId);
  if (!attempt) return null;

  return {
    paymentId: attempt.payment_id,
    orderId: attempt.order_id,
    amount: attempt.amount,
    currency: attempt.currency,
    provider: attempt.provider,
    status: attempt.status,
    providerReference: attempt.provider_reference || null,
    createdAt: attempt.created_at,
    updatedAt: attempt.updated_at,
  };
}

/**
 * Retries a failed payment.
 * REQ-34
 * @param {string} paymentId
 * @param {object} payload
 * @returns {Promise<object>}
 */
async function retryPayment(paymentId, payload) {
  const existing = await getLatestPaymentAttempt(paymentId);
  if (!existing) {
    const err = new Error('Payment not found.');
    err.statusCode = 404;
    throw err;
  }

  if (!['failed', 'cancelled', 'expired'].includes(existing.status)) {
    const err = new Error('Only failed, cancelled, or expired payments can be retried.');
    err.statusCode = 400;
    throw err;
  }

  const provider = payload.provider || existing.provider;
  const adapter = adapterRegistry.getAdapter(provider);

  const newPaymentId = uuidv4();

  await createPaymentAttempt({
    paymentId: newPaymentId,
    orderId: existing.order_id,
    amount: existing.amount,
    currency: existing.currency,
    provider,
    status: 'pending',
    metadata: { retriedFrom: paymentId },
  });

  let providerResponse;
  try {
    providerResponse = await adapter.initiatePayment({
      paymentId: newPaymentId,
      orderId: existing.order_id,
      amount: existing.amount,
      currency: existing.currency,
      metadata: { retriedFrom: paymentId },
    });
  } catch (err) {
    await updatePaymentAttempt(newPaymentId, { status: 'failed', provider_error: err.message });
    throw err;
  }

  await updatePaymentAttempt(newPaymentId, {
    status: providerResponse.status || 'initiated',
    provider_reference: providerResponse.reference || null,
    provider_response: JSON.stringify(providerResponse),
  });

  return {
    originalPaymentId: paymentId,
    newPaymentId,
    status: providerResponse.status || 'initiated',
    redirectUrl: providerResponse.redirectUrl || null,
  };
}

module.exports = {
  initiatePayment,
  handleCallback,
  confirmPayment,
  getPaymentById,
  retryPayment,
};
