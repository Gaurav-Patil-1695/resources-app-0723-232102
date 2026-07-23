const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
});

const SEARCH_INDEX = process.env.ELASTICSEARCH_INDEX || 'content';
const SUGGEST_INDEX = process.env.ELASTICSEARCH_SUGGEST_INDEX || 'content';

/**
 * Perform a full-text search with optional faceted filters and aggregations.
 * @param {Object} params
 * @param {string} params.query - The search query string
 * @param {Object} params.filters - Key-value pairs of facet filters
 * @param {number} params.page - Page number (1-based)
 * @param {number} params.size - Number of results per page
 * @returns {Promise<Object>} Search results with hits, total, and aggregations
 */
async function search({ query, filters = {}, page = 1, size = 10 }) {
  const from = (page - 1) * size;

  const mustClauses = [];

  if (query && query.trim().length > 0) {
    mustClauses.push({
      multi_match: {
        query: query.trim(),
        fields: ['title^3', 'description^2', 'content', 'tags'],
        type: 'best_fields',
        fuzziness: 'AUTO',
      },
    });
  } else {
    mustClauses.push({ match_all: {} });
  }

  const filterClauses = Object.entries(filters).map(([field, value]) => {
    if (Array.isArray(value)) {
      return { terms: { [field]: value } };
    }
    return { term: { [field]: value } };
  });

  const esQuery = {
    index: SEARCH_INDEX,
    from,
    size,
    body: {
      query: {
        bool: {
          must: mustClauses,
          filter: filterClauses,
        },
      },
      aggs: {
        categories: {
          terms: { field: 'category.keyword', size: 20 },
        },
        tags: {
          terms: { field: 'tags.keyword', size: 20 },
        },
        status: {
          terms: { field: 'status.keyword', size: 10 },
        },
      },
      highlight: {
        fields: {
          title: {},
          description: {},
          content: { number_of_fragments: 3, fragment_size: 150 },
        },
      },
    },
  };

  const response = await client.search(esQuery);
  const body = response.body || response;

  const hits = (body.hits.hits || []).map((hit) => ({
    id: hit._id,
    score: hit._score,
    source: hit._source,
    highlight: hit.highlight || {},
  }));

  const aggregations = {};
  if (body.aggregations) {
    for (const [key, agg] of Object.entries(body.aggregations)) {
      aggregations[key] = (agg.buckets || []).map((bucket) => ({
        key: bucket.key,
        count: bucket.doc_count,
      }));
    }
  }

  return {
    hits,
    total: body.hits.total.value !== undefined ? body.hits.total.value : body.hits.total,
    page,
    size,
    aggregations,
  };
}

/**
 * Provide autocomplete suggestions for a given query prefix.
 * @param {Object} params
 * @param {string} params.query - The prefix query string
 * @param {number} params.size - Maximum number of suggestions to return
 * @returns {Promise<Object>} Autocomplete suggestions
 */
async function suggest({ query, size = 5 }) {
  if (!query || query.trim().length === 0) {
    return { suggestions: [] };
  }

  const esQuery = {
    index: SUGGEST_INDEX,
    body: {
      suggest: {
        title_suggest: {
          prefix: query.trim(),
          completion: {
            field: 'title_suggest',
            size,
            fuzzy: {
              fuzziness: 'AUTO',
            },
          },
        },
      },
      _source: ['title', 'category', 'type'],
    },
  };

  const response = await client.search(esQuery);
  const body = response.body || response;

  const rawSuggestions = body.suggest && body.suggest.title_suggest
    ? body.suggest.title_suggest[0].options || []
    : [];

  const suggestions = rawSuggestions.map((option) => ({
    id: option._id,
    text: option.text,
    score: option._score,
    source: option._source || {},
  }));

  return { suggestions };
}

module.exports = { search, suggest };
