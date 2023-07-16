const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);


const { connectToMongoDB } = require('./database')
const { setupSocketIO } = require('./socket')

const conversationRoutes = require('./routes/conversationRoutes');
const dataSyncRoutes = require('./routes/dataSyncRoutes');

// cors
app.use(cors());

app.use(express.json());

const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
});

// Route
app.use('/api/conversations', conversationRoutes);
app.use('/api/sync', dataSyncRoutes);

// Serve static files from the "public" directory
//app.use(express.static('public'));

// Connect to MongoDb
connectToMongoDB();

// Setup Socket.IO
setupSocketIO(io);


// Start the server
const port = 3001;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});