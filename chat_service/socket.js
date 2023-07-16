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
        socket.on('chat message', async (data) => {
          console.log('Message:', data.message);
          if (data.recipient) {
            // Send message to individual user
            const recipientSocketId = connectedUsers[data.recipient];
            if (recipientSocketId) {
      
              // Save the chat message to MongoDB
              let sentMessage = await saveChatMessage(data);
              
              io.to(recipientSocketId).emit('chat message', sentMessage);

            } else {
              let sentMessage = await saveChatMessage(data);
            }
          } else {
            // Broadcast the message to all connected clients
            /*
            io.emit('chat message', {
              sender: data.from ?? "",
              message: data.message
            });
            */

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

    const { sender, recipient, message } = data;
    
    const userFrom = await User.findOne({ userId: sender });
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

        return ChatMessage.findById(chatMessage._id)
        .populate('sender')
        .populate('recipient');
    } catch (error) {
        throw error;
    }
    
}

module.exports = { setupSocketIO }