const {Conversation, User, ChatMessage} = require('../database')


module.exports = {

  testApi: async (req, res) => {
  
    try {
        const newUser1 = new User({
        userId: 1,
        name: 'David',
        });
        newUser1.save();

        const newUser2 = new User({
        userId: 2,
        name: 'Michael',
        });
        newUser2.save();

        res.json("Temp");
    } catch (err) {
        res.status(500).json({ error: 'An error occurred.' });
    }
},

getConversationByUserId: async (req, res) => {
  const userId = req.params.userId

  try {
    const user = await User.findOne({ userId: userId });;
    const conversations = await Conversation.find({ participants: user._id })
      .populate('participants', 'name')
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
      .populate('sender', 'name')
      .populate('recipient', 'name');
  
      res.json(messages);
    } catch (err) {
      res.status(500).json({ error: 'An error occurred while retrieving chat messages.' });
    }
  }


};
