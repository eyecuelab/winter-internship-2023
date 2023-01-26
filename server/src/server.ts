import app from './app';
import http from 'http';

const server = http.createServer(app);

server.listen(3000, () =>
  console.log('Server ready at: http://localhost:3000'),
)