import { setupServer } from 'msw/node';
import authHandlers from './handlers/authHandlers.js';
import projectHandlers from './handlers/projectHandlers.js';
import taskHandlers from './handlers/taskHandlers.js';
import userHandlers from './handlers/userHandlers.js';
 
const server = setupServer(...authHandlers, ...projectHandlers, ...taskHandlers, ...userHandlers);

export default server;