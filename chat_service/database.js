const mongoose = require('mongoose');

function connectToMongoDB() {

  let con_string_dev = 'mongodb://localhost:27018/chat_service_db'
  let con_string_pro = 'mongodb://mongo_chat_service:27017/chat_service_db'

  mongoose.connect(process.env.NODE_ENV === 'production' ? con_string_pro : con_string_dev, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
}


// User schema
const userSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  name: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);


// Conversation schema
const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  recentMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' }
});
const Conversation = mongoose.model('Conversation', conversationSchema);


// Chat message schema
const chatMessageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  timestamp: { type: Date, default: Date.now },
});
const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = { connectToMongoDB, User, Conversation, ChatMessage };
