import elasticClient from '../connections/elasticSearch.js';

// health check
async function health() {
  return await elasticClient.cluster.health();
}

// ping to see if the service is up and running
// In the new JavaScript client every option that is not intended for Elasticsearch lives in a second object
async function ping() {
  return await elasticClient.ping({}, { requestTimeout: 3000 });
}

// info about the ES we are connected to
async function info() {
  return await elasticClient.info();
}

async function createIndices(index) {
  const doesExists = await elasticClient.indices.exists({ index });

  if (doesExists) {
    const msg = 'index already exists - ' + index;
    console.log(msg);
    return msg;
  }

  // if it doesn't
  const resp = await elasticClient.indices.create({ index });

  const msg = 'index created - ' + index;
  console.log(msg);
  return msg;
}

async function deleteIndices(index) {
  if (!index) throw genHelpers.throwError('Provide index name');

  return await elasticClient.indices.delete({ index });
}

async function putMapping(index) {
  console.log('Creating Mapping index - ', index);

  return await elasticClient.indices.putMapping({
    index: index, // index is analogous to a database in SQL
    // type: '', // type is analogous to a table in SQL
    body: {
      properties: {
        id: { type: 'integer' },
        name: { type: 'text' },
        username: { type: 'text' },
        isManager: { type: 'boolean' },
        // children: { type: 'array' },
        parentId: { type: 'integer' },
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' },
      },
    },
  });
}

// index data
// When using the client.index API, the request automatically creates the index if it doesn’t already exist, as well as document IDs for each indexed document if they are not explicitly specified.
async function create(index, body) {
  const resp = await elasticClient.index({
    index,
    id: body.id,
    body,
  });

  await elasticClient.indices.refresh({ index });

  return resp;
}

async function search(index) {
  return await elasticClient.search({
    index,
    size: 100,
    track_total_hits: true,
    sort: [{ createdAt: { order: 'asc' } }], // ES sorts "randomly" based on "_score" property in the document, so we should explicitly sort on some field.
  });
}

// Update a Document
// doc: {
//   price: 5.99,
// };
async function updateDocumentById(index, fieldsToUpdate = {}) {
  return await elasticClient.update({
    index,
    // type: '',
    id: fieldsToUpdate.id,
    body: {
      // script: {
      //   source: "ctx._source.birthplace = 'Winterfell'", // ctx (context) is used with update queries
      // },
      doc: fieldsToUpdate,
    },
  });
}

async function deleteDocumentById(index, id) {
  if (!index)
    throw genHelpers.throwError(
      'Provide both index name and id of the document to delete'
    );

  return await elasticClient.delete({
    index,
    // type: '',
    id,
  });
}

const elasticSearch_Status = async () => {
  const respObj = {};
  respObj.ping = await ping();
  respObj.health = await health();
  respObj.info = await info();
  return respObj;
};

export default {
  health,
  ping,
  info,
  createIndices,
  deleteIndices,
  putMapping,
  create,
  search,
  updateDocumentById,
  deleteDocumentById,
  elasticSearch_Status,
};
