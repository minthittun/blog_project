const { User, Conversation, ChatMessage } = require('./database');
const connectedUsers = {};

function setupSocketIO(io) {
    io.on('connection', (socket) => {

        const user_id = socket.handshake.query.user_id;
      
        // Store recipient and corresponding socket ID
        if (user_id) {
          connectedUsers[user_id] = socket.id;
          console.log('User connected: ' + Object.keys(connectedUsers).length);
        }
      
        // Handle incoming chat messages
        socket.on('chat message', (data) => {
          console.log('Message:', data.message);
          if (data.recipient) {
            // Send message to individual user
            const recipientSocketId = connectedUsers[data.recipient];
            if (recipientSocketId) {
      
              io.to(recipientSocketId).emit('chat message', {
                sender: data.from ?? "",
                recipient: data.recipient ?? "",
                message: data.message
              });

              // Save the chat message to MongoDB
              saveChatMessage(data);

            } else {
              console.log(`Recipient '${data.recipient}' not found`);
            }
          } else {
            // Broadcast the message to all connected clients
            io.emit('chat message', {
              sender: data.from ?? "",
              message: data.message
            });

            // Save the chat message to MongoDB
            // saveChatMessageToDB(data);
          }
        });
      
        // Handle disconnections
        socket.on('disconnect', () => {
      
          delete connectedUsers[user_id];
      
        
          console.log('User disconnected: ' + Object.keys(connectedUsers).length);
        });
      });
}

async function saveChatMessage(data) {

    const { from, recipient, message } = data;

    const userFrom = await User.findOne({ userId: from });
    const userRecipient = await User.findOne({ userId: recipient });

    let conversation = await Conversation.findOne({
        participants: { $all: [userFrom._id, userRecipient._id] }
    });

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [userFrom._id, userRecipient._id]
        });
    }
    
    const chatMessage = new ChatMessage({
        conversationId: conversation._id,
        sender: userFrom._id,
        recipient: userRecipient._id,
        message: message,
      });

    try {
        await chatMessage.save();

        conversation.recentMessage = chatMessage._id;
        await conversation.save();

        console.log('Chat message saved to MongoDB');
    } catch (error) {
        console.error('Error saving chat message:', error);
    }

}

module.exports = { setupSocketIO }