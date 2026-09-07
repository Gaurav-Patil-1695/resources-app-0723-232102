/**
 * @typedef {Object} ReturnRequest
 * @property {string} id - Unique return request identifier
 * @property {string} order_id - Associated order identifier
 * @property {string} user_id - Associated user identifier
 * @property {string[]} item_ids - List of order item identifiers being returned
 * @property {'pending'|'approved'|'rejected'|'processing'|'completed'} status - Return request status
 * @property {string} reason - Reason for return
 * @property {string|null} description - Detailed description of return reason
 * @property {string|null} images - Comma-separated URLs of supporting images
 * @property {'refund'|'exchange'|'store_credit'} resolution_type - Requested resolution type
 * @property {string|null} rejection_reason - Reason for rejection if status is 'rejected'
 * @property {string} created_at - ISO timestamp of return request creation
 * @property {string} updated_at - ISO timestamp of last update
 */

/**
 * @typedef {Object} Refund
 * @property {string} id - Unique refund identifier
 * @property {string} return_request_id - Associated return request identifier
 * @property {string} order_id - Associated order identifier
 * @property {string} user_id - Associated user identifier
 * @property {number} amount - Refund amount in smallest currency unit
 * @property {string} currency - Currency code
 * @property {'pending'|'processing'|'completed'|'failed'} status - Refund status
 * @property {'original_payment'|'store_credit'|'bank_transfer'} refund_method - Method of refund
 * @property {string|null} gateway_refund_id - Refund identifier from payment gateway
 * @property {string|null} failure_reason - Reason for failure if status is 'failed'
 * @property {string} created_at - ISO timestamp
 * @property {string} updated_at - ISO timestamp
 */

export default {};
