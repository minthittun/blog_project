const {Conversation, User, ChatMessage} = require('../database')


module.exports = {


createConversation: async (req, res) => {
  
  try {
    const { sender, recipient } = req.body;

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
    
    const recent_conversations = await Conversation.findOne({ _id: conversation._id })
    .populate('participants')
    .populate('recentMessage');

    res.json(recent_conversations);
  } catch (err) {
      res.status(500).json({ error: 'An error occurred.' });
  }
},

getConversationByUserId: async (req, res) => {
  const userId = req.params.userId

  try {
    const user = await User.findOne({ userId: userId });;
    const conversations = await Conversation.find({ participants: user._id })
      .populate('participants')
      .populate('recentMessage');

    res.json(conversations);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'An error occurred.' });
  }
},

getMessagesByConversationId: async (req, res) => {
    const conversationId = req.params.conversationId;
  
    try {
      const messages = await ChatMessage.find({ conversationId })
      .populate('sender')
      .populate('recipient');
  
      res.json(messages);
    } catch (err) {
      res.status(500).json({ error: 'An error occurred while retrieving chat messages.' });
    }
  },

  getAllUsers: async (req, res) => {
  
    try {
      const users = await User.find();
  
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'An error occurred while retrieving chat messages.' });
    }
  }


};
