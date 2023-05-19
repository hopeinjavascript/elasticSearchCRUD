'use strict';

import { Client } from '@elastic/elasticsearch';

function initElasticSearch(url, username, password) {
  // url => []
  const urlList = url.split(',').length === 1 ? url : url.split(','),
    field = url.split(',').length === 1 ? 'node' : 'nodes';

  return new Client({
    [field]: urlList,
    auth: {
      username,
      password,
    },
    maxRetries: 5,
    requestTimeout: 6000,
    // sniffOnStart: true,
  });
}

export default initElasticSearch(
  process.env.ELASTIC_SEARCH_URL,
  process.env.ELASTIC_SEARCH_PASSWORD,
  process.env.ELASTIC_SEARCH_USERNAME
);
