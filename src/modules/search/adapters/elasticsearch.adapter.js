'use strict';

const { Client } = require('@elastic/elasticsearch');

/**
 * Elasticsearch adapter providing client wrapper, index mapping helpers, and query builders.
 */

let clientInstance = null;

/**
 * Initialise and return the singleton Elasticsearch client.
 *
 * @param {object} [config]
 * @param {string} [config.node]       - Elasticsearch node URL (default: process.env.ELASTICSEARCH_URL or 'http://localhost:9200')
 * @param {string} [config.username]   - Basic-auth username
 * @param {string} [config.password]   - Basic-auth password
 * @param {string} [config.apiKey]     - API key (takes precedence over basic auth)
 * @returns {Client}
 */
function getClient(config = {}) {
  if (clientInstance) {
    return clientInstance;
  }

  const node = config.node || process.env.ELASTICSEARCH_URL || 'http://localhost:9200';

  const clientOptions = { node };

  if (config.apiKey) {
    clientOptions.auth = { apiKey: config.apiKey };
  } else if (config.username && config.password) {
    clientOptions.auth = { username: config.username, password: config.password };
  }

  clientInstance = new Client(clientOptions);
  return clientInstance;
}

/**
 * Reset the singleton (useful for testing).
 */
function resetClient() {
  clientInstance = null;
}

// ---------------------------------------------------------------------------
// Index mapping helpers
// ---------------------------------------------------------------------------

/**
 * Create an index with the supplied mappings and settings.
 *
 * @param {string} index
 * @param {object} mappings  - Elasticsearch mappings object
 * @param {object} [settings] - Elasticsearch settings object
 * @returns {Promise<object>}
 */
async function createIndex(index, mappings, settings = {}) {
  const client = getClient();
  const body = { mappings };
  if (Object.keys(settings).length > 0) {
    body.settings = settings;
  }
  return client.indices.create({ index, body });
}

/**
 * Delete an index.
 *
 * @param {string} index
 * @returns {Promise<object>}
 */
async function deleteIndex(index) {
  const client = getClient();
  return client.indices.delete({ index });
}

/**
 * Check whether an index exists.
 *
 * @param {string} index
 * @returns {Promise<boolean>}
 */
async function indexExists(index) {
  const client = getClient();
  const { body } = await client.indices.exists({ index });
  return body;
}

/**
 * Update the mapping of an existing index.
 *
 * @param {string} index
 * @param {object} mappings
 * @returns {Promise<object>}
 */
async function putMapping(index, mappings) {
  const client = getClient();
  return client.indices.putMapping({ index, body: mappings });
}

/**
 * Return the mapping definition for an index.
 *
 * @param {string} index
 * @returns {Promise<object>}
 */
async function getMapping(index) {
  const client = getClient();
  return client.indices.getMapping({ index });
}

/**
 * Refresh an index to make recently indexed documents searchable.
 *
 * @param {string} index
 * @returns {Promise<object>}
 */
async function refreshIndex(index) {
  const client = getClient();
  return client.indices.refresh({ index });
}

// ---------------------------------------------------------------------------
// Document helpers
// ---------------------------------------------------------------------------

/**
 * Index a single document.
 *
 * @param {string} index
 * @param {string|number} id
 * @param {object} document
 * @returns {Promise<object>}
 */
async function indexDocument(index, id, document) {
  const client = getClient();
  return client.index({ index, id, body: document });
}

/**
 * Bulk index an array of documents.
 * Each item in `documents` should have an `id` property and a `body` object.
 *
 * @param {string} index
 * @param {Array<{id: string|number, body: object}>} documents
 * @returns {Promise<object>}
 */
async function bulkIndex(index, documents) {
  const client = getClient();
  const body = documents.flatMap(({ id, body }) => [
    { index: { _index: index, _id: id } },
    body,
  ]);
  return client.bulk({ refresh: true, body });
}

/**
 * Delete a document by id.
 *
 * @param {string} index
 * @param {string|number} id
 * @returns {Promise<object>}
 */
async function deleteDocument(index, id) {
  const client = getClient();
  return client.delete({ index, id });
}

// ---------------------------------------------------------------------------
// Query builders
// ---------------------------------------------------------------------------

/**
 * Build a simple multi-field match query.
 *
 * @param {string} queryText  - Free-text search string
 * @param {string[]} fields   - Fields to search across
 * @param {object}  [options]
 * @param {string}  [options.operator]  - 'and' | 'or' (default: 'or')
 * @param {string}  [options.fuzziness] - e.g. 'AUTO', '1', '2'
 * @returns {object} Elasticsearch query DSL fragment
 */
function buildMultiMatchQuery(queryText, fields, options = {}) {
  const { operator = 'or', fuzziness } = options;
  const multiMatch = {
    query: queryText,
    fields,
    operator,
    type: 'best_fields',
  };
  if (fuzziness !== undefined) {
    multiMatch.fuzziness = fuzziness;
  }
  return { multi_match: multiMatch };
}

/**
 * Build a term (exact-value) query.
 *
 * @param {string} field
 * @param {*}      value
 * @returns {object}
 */
function buildTermQuery(field, value) {
  return { term: { [field]: value } };
}

/**
 * Build a terms (multi-value exact) query.
 *
 * @param {string} field
 * @param {Array}  values
 * @returns {object}
 */
function buildTermsQuery(field, values) {
  return { terms: { [field]: values } };
}

/**
 * Build a range query.
 *
 * @param {string} field
 * @param {object} range - e.g. { gte: 0, lte: 100 }
 * @returns {object}
 */
function buildRangeQuery(field, range) {
  return { range: { [field]: range } };
}

/**
 * Build a bool query from optional must / filter / should / must_not clauses.
 *
 * @param {object} clauses
 * @param {Array}  [clauses.must]
 * @param {Array}  [clauses.filter]
 * @param {Array}  [clauses.should]
 * @param {Array}  [clauses.must_not]
 * @param {number} [clauses.minimum_should_match]
 * @returns {object}
 */
function buildBoolQuery(clauses = {}) {
  const bool = {};
  if (clauses.must && clauses.must.length)         bool.must        = clauses.must;
  if (clauses.filter && clauses.filter.length)     bool.filter      = clauses.filter;
  if (clauses.should && clauses.should.length)     bool.should      = clauses.should;
  if (clauses.must_not && clauses.must_not.length) bool.must_not    = clauses.must_not;
  if (clauses.minimum_should_match !== undefined)  bool.minimum_should_match = clauses.minimum_should_match;
  return { bool };
}

/**
 * Build a match_all query.
 *
 * @returns {object}
 */
function buildMatchAllQuery() {
  return { match_all: {} };
}

/**
 * Build a wildcard query.
 *
 * @param {string} field
 * @param {string} value   - Pattern, e.g. 'foo*'
 * @param {object} [options]
 * @param {number} [options.boost]
 * @returns {object}
 */
function buildWildcardQuery(field, value, options = {}) {
  const wildcard = { value };
  if (options.boost !== undefined) wildcard.boost = options.boost;
  return { wildcard: { [field]: wildcard } };
}

/**
 * Build an aggregation definition for a terms bucket.
 *
 * @param {string} field
 * @param {number} [size=10]
 * @returns {object}
 */
function buildTermsAggregation(field, size = 10) {
  return { terms: { field, size } };
}

/**
 * Build a date histogram aggregation.
 *
 * @param {string} field
 * @param {string} calendarInterval - e.g. 'day', 'month', 'year'
 * @returns {object}
 */
function buildDateHistogramAggregation(field, calendarInterval) {
  return { date_histogram: { field, calendar_interval: calendarInterval } };
}

// ---------------------------------------------------------------------------
// Search execution helpers
// ---------------------------------------------------------------------------

/**
 * Execute a search query.
 *
 * @param {string} index
 * @param {object} query        - Elasticsearch query DSL object
 * @param {object} [options]
 * @param {number} [options.from]         - Pagination offset (default: 0)
 * @param {number} [options.size]         - Page size (default: 10)
 * @param {Array}  [options.sort]         - Sort descriptors
 * @param {object} [options.aggregations] - Aggregations map
 * @param {Array}  [options.source]       - Fields to include in _source
 * @returns {Promise<object>} Raw Elasticsearch response body
 */
async function search(index, query, options = {}) {
  const client = getClient();
  const { from = 0, size = 10, sort, aggregations, source } = options;

  const body = { query, from, size };
  if (sort)         body.sort = sort;
  if (aggregations) body.aggs = aggregations;
  if (source)       body._source = source;

  const response = await client.search({ index, body });
  return response.body;
}

/**
 * Execute a count query.
 *
 * @param {string} index
 * @param {object} query
 * @returns {Promise<number>}
 */
async function count(index, query) {
  const client = getClient();
  const response = await client.count({ index, body: { query } });
  return response.body.count;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  // Client
  getClient,
  resetClient,

  // Index management
  createIndex,
  deleteIndex,
  indexExists,
  putMapping,
  getMapping,
  refreshIndex,

  // Document helpers
  indexDocument,
  bulkIndex,
  deleteDocument,

  // Query builders
  buildMultiMatchQuery,
  buildTermQuery,
  buildTermsQuery,
  buildRangeQuery,
  buildBoolQuery,
  buildMatchAllQuery,
  buildWildcardQuery,

  // Aggregation builders
  buildTermsAggregation,
  buildDateHistogramAggregation,

  // Search execution
  search,
  count,
};
