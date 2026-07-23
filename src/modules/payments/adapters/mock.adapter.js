'use strict';

const PaymentAdapterInterface = require('./payment.adapter.interface');

/**
 * MockAdapter
 *
 * A test-mode payment adapter that returns configurable success or failure
 * responses without making any real network calls.  Useful in unit tests,
 * integration tests, and local development.
 *
 * Usage:
 *
 *   // Always succeed
 *   const adapter = new MockAdapter();
 *
 *   // Always fail
 *   const adapter = new MockAdapter({ shouldFail: true });
 *
 *   // Fail on the first N calls, then succeed
 *   const adapter = new MockAdapter({ failCount: 2 });
 *
 *   // Simulate network latency
 *   const adapter = new MockAdapter({ latencyMs: 150 });
 *
 *   // Supply a custom error message when failing
 *   const adapter = new MockAdapter({ shouldFail: true, errorMessage: 'Card declined' });
 *
 *   // Override the resolved status for initiatePayment
 *   const adapter = new MockAdapter({ initiateStatus: 'pending' });
 */
class MockAdapter extends PaymentAdapterInterface {
  /**
   * @param {Object}  [options]
   * @param {boolean} [options.shouldFail=false]        - Always return a failure response.
   * @param {number}  [options.failCount=0]             - Fail exactly N times, then succeed.
   * @param {number}  [options.latencyMs=0]             - Artificial delay in milliseconds.
   * @param {string}  [options.errorMessage]            - Custom error message on failure.
   * @param {string}  [options.initiateStatus='success']- Status returned by initiatePayment.
   */
  constructor(options = {}) {
    super();

    this._shouldFail    = options.shouldFail    !== undefined ? Boolean(options.shouldFail) : false;
    this._failCount     = options.failCount      !== undefined ? Number(options.failCount)   : 0;
    this._latencyMs     = options.latencyMs      !== undefined ? Number(options.latencyMs)   : 0;
    this._errorMessage  = options.errorMessage   || 'Mock payment failure';
    this._initiateStatus = options.initiateStatus || 'success';

    /** @type {number} Internal counter tracking how many calls have been made. */
    this._callCount = 0;

    /** @type {Array<Object>} Record of every call made to this adapter (useful in tests). */
    this.calls = [];
  }

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  /**
   * Resolve after the configured latency.
   * @returns {Promise<void>}
   */
  async _delay() {
    if (this._latencyMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this._latencyMs));
    }
  }

  /**
   * Determine whether the current call should be treated as a failure.
   * @returns {boolean}
   */
  _isFailing() {
    if (this._shouldFail) return true;
    if (this._failCount > 0 && this._callCount <= this._failCount) return true;
    return false;
  }

  /**
   * Generate a deterministic-looking fake identifier.
   * @param {string} prefix
   * @param {string} seed
   * @returns {string}
   */
  _fakeId(prefix, seed) {
    // Use a simple hash-like derivation so values are stable per seed.
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (Math.imul(31, hash) + seed.charCodeAt(i)) | 0;
    }
    const unsigned = (hash >>> 0).toString(16).padStart(8, '0');
    return `${prefix}_mock_${unsigned}_${this._callCount}`;
  }

  // ---------------------------------------------------------------------------
  // PaymentAdapterInterface implementation
  // ---------------------------------------------------------------------------

  /** @inheritdoc */
  async initiatePayment(paymentDetails) {
    this._callCount += 1;
    await this._delay();

    const call = { method: 'initiatePayment', args: { paymentDetails }, callIndex: this._callCount };
    this.calls.push(call);

    const failing = this._isFailing();

    const transactionId     = this._fakeId('txn', paymentDetails.orderId || 'order');
    const providerReference = this._fakeId('ref', transactionId);

    if (failing) {
      const response = {
        transactionId,
        status: 'failed',
        providerReference,
        raw: {
          mock: true,
          error: this._errorMessage,
          input: paymentDetails,
        },
      };
      call.response = response;
      return response;
    }

    const response = {
      transactionId,
      status: this._initiateStatus,
      providerReference,
      raw: {
        mock: true,
        input: paymentDetails,
      },
    };
    call.response = response;
    return response;
  }

  /** @inheritdoc */
  async verifyPayment(transactionId) {
    this._callCount += 1;
    await this._delay();

    const call = { method: 'verifyPayment', args: { transactionId }, callIndex: this._callCount };
    this.calls.push(call);

    const failing = this._isFailing();

    const providerReference = this._fakeId('ref', transactionId);

    if (failing) {
      const response = {
        transactionId,
        status: 'failed',
        providerReference,
        raw: {
          mock: true,
          error: this._errorMessage,
          input: { transactionId },
        },
      };
      call.response = response;
      return response;
    }

    const response = {
      transactionId,
      status: 'success',
      providerReference,
      raw: {
        mock: true,
        input: { transactionId },
      },
    };
    call.response = response;
    return response;
  }

  /** @inheritdoc */
  async refundPayment(transactionId, amount) {
    this._callCount += 1;
    await this._delay();

    const call = { method: 'refundPayment', args: { transactionId, amount }, callIndex: this._callCount };
    this.calls.push(call);

    const failing = this._isFailing();

    const refundId = this._fakeId('rfd', transactionId);

    if (failing) {
      const response = {
        refundId,
        transactionId,
        status: 'failed',
        raw: {
          mock: true,
          error: this._errorMessage,
          input: { transactionId, amount },
        },
      };
      call.response = response;
      return response;
    }

    const response = {
      refundId,
      transactionId,
      status: 'success',
      raw: {
        mock: true,
        input: { transactionId, amount },
      },
    };
    call.response = response;
    return response;
  }

  /** @inheritdoc */
  async cancelPayment(transactionId) {
    this._callCount += 1;
    await this._delay();

    const call = { method: 'cancelPayment', args: { transactionId }, callIndex: this._callCount };
    this.calls.push(call);

    const failing = this._isFailing();

    if (failing) {
      const response = {
        transactionId,
        status: 'failed',
        raw: {
          mock: true,
          error: this._errorMessage,
          input: { transactionId },
        },
      };
      call.response = response;
      return response;
    }

    const response = {
      transactionId,
      status: 'cancelled',
      raw: {
        mock: true,
        input: { transactionId },
      },
    };
    call.response = response;
    return response;
  }

  // ---------------------------------------------------------------------------
  // Test-support utilities
  // ---------------------------------------------------------------------------

  /**
   * Reset internal state (call count, call log) so the same adapter instance
   * can be reused across multiple test cases.
   */
  reset() {
    this._callCount = 0;
    this.calls = [];
  }

  /**
   * Reconfigure the adapter without creating a new instance.
   *
   * @param {Object} options - Same shape as the constructor options.
   */
  configure(options = {}) {
    if (options.shouldFail   !== undefined) this._shouldFail    = Boolean(options.shouldFail);
    if (options.failCount    !== undefined) this._failCount     = Number(options.failCount);
    if (options.latencyMs    !== undefined) this._latencyMs     = Number(options.latencyMs);
    if (options.errorMessage !== undefined) this._errorMessage  = options.errorMessage;
    if (options.initiateStatus !== undefined) this._initiateStatus = options.initiateStatus;
  }

  /** @inheritdoc */
  get name() {
    return 'MockAdapter';
  }
}

module.exports = MockAdapter;
