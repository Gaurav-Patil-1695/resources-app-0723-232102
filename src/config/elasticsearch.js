'use strict';

const { Client } = require('@elastic/elasticsearch');
const config = require('./index');

/**
 * Elasticsearch client options derived from the centralised config.
 */
const elasticsearchOptions = {
  node: config.elasticsearch.node,
  ...(config.elasticsearch.username && config.elasticsearch.password
    ? {
        auth: {
          username: config.elasticsearch.username,
          password: config.elasticsearch.password,
        },
      }
    : {}),
};

/**
 * Singleton Elasticsearch client instance.
 */
const esClient = new Client(elasticsearchOptions);

module.exports = {
  elasticsearchOptions,
  esClient,
};
