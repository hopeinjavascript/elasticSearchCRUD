import 'dotenv/config';

// Elastic Search Usage
import es from './utils/elasticSearchCrud.js';

const status = await es.elasticSearch_Status();

console.log(status);
