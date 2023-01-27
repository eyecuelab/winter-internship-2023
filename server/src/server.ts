import app from './app';
import http from 'http';

import googleRoutes from './Routes/google-routes';

const server = http.createServer(app);

server.listen(3000, () =>
  console.log('Server ready at: http://localhost:3000'),
)