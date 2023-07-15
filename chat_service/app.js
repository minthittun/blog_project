const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const { connectToMongoDB } = require('./database')
const { setupSocketIO } = require('./socket')

const conversationRoutes = require('./routes/conversationRoutes');
const dataSyncRoutes = require('./routes/dataSyncRoutes');

app.use(express.json());

// Route
app.use('/api/conversations', conversationRoutes);
app.use('/api/sync', dataSyncRoutes);

// Serve static files from the "public" directory
app.use(express.static('public'));

// Connect to MongoDb
connectToMongoDB();

// Setup Socket.IO
setupSocketIO(io);


// Start the server
const port = 3001;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});