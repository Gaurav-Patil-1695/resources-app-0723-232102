/**
 * PaymentAdapterInterface
 *
 * Duck-type contract that every payment provider adapter must satisfy.
 * Concrete adapters should extend this class and override all methods.
 * Calling any method on the base class throws a NotImplementedError so
 * that missing implementations are caught early.
 */
class PaymentAdapterInterface {
  /**
   * Initiate a new payment.
   *
   * @param {Object} paymentDetails
   * @param {string} paymentDetails.orderId       - Unique order / reference identifier.
   * @param {number} paymentDetails.amount        - Amount in the smallest currency unit (e.g. cents).
   * @param {string} paymentDetails.currency      - ISO 4217 currency code (e.g. "USD").
   * @param {Object} [paymentDetails.metadata]    - Arbitrary provider-specific metadata.
   *
   * @returns {Promise<{
   *   transactionId: string,
   *   status: 'pending'|'success'|'failed',
   *   providerReference: string,
   *   raw: Object
   * }>}
   */
  async initiatePayment(paymentDetails) {
    throw new Error(
      `PaymentAdapterInterface.initiatePayment() is not implemented. ` +
      `Adapter "${this.constructor.name}" must override this method.`
    );
  }

  /**
   * Verify / confirm the current status of an existing transaction.
   *
   * @param {string} transactionId - The provider transaction identifier.
   *
   * @returns {Promise<{
   *   transactionId: string,
   *   status: 'pending'|'success'|'failed',
   *   providerReference: string,
   *   raw: Object
   * }>}
   */
  async verifyPayment(transactionId) {
    throw new Error(
      `PaymentAdapterInterface.verifyPayment() is not implemented. ` +
      `Adapter "${this.constructor.name}" must override this method.`
    );
  }

  /**
   * Refund a previously successful transaction, fully or partially.
   *
   * @param {string} transactionId  - The provider transaction identifier.
   * @param {number} [amount]       - Amount to refund in the smallest currency unit.
   *                                  When omitted the full transaction amount is refunded.
   *
   * @returns {Promise<{
   *   refundId: string,
   *   transactionId: string,
   *   status: 'pending'|'success'|'failed',
   *   raw: Object
   * }>}
   */
  async refundPayment(transactionId, amount) {
    throw new Error(
      `PaymentAdapterInterface.refundPayment() is not implemented. ` +
      `Adapter "${this.constructor.name}" must override this method.`
    );
  }

  /**
   * Cancel a pending / authorised transaction before capture.
   *
   * @param {string} transactionId - The provider transaction identifier.
   *
   * @returns {Promise<{
   *   transactionId: string,
   *   status: 'cancelled',
   *   raw: Object
   * }>}
   */
  async cancelPayment(transactionId) {
    throw new Error(
      `PaymentAdapterInterface.cancelPayment() is not implemented. ` +
      `Adapter "${this.constructor.name}" must override this method.`
    );
  }

  /**
   * Human-readable name for the adapter (used in logs and error messages).
   * Concrete adapters should override this getter.
   *
   * @returns {string}
   */
  get name() {
    return this.constructor.name;
  }
}

module.exports = PaymentAdapterInterface;
