import express from 'express';
import logger from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'node:http';

const port = process.env.PORT ?? 3000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
   cors: {
      origin: "*", 
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
   },
});

io.on('connection', (socket) => {
   console.log('A new client connected');

   socket.on('message', (data) => {
      console.log('Mensaje recibido:', data); 
      io.emit('message', data);
   });

   socket.on('disconnect', () => {
      console.log('A client disconnected');
   });

   socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
   })
});

app.use(logger('dev'));

app.get('/', (req, res) => {
   res.sendFile(process.cwd() + '/client/index.html');
});

server.listen(port, () => {
   console.log('Servidor escuchando en el puerto port');
});