const Comment = require('../models/comment');
const User = require('../models/user');


module.exports = {

  createComment: async (req, res) => {
    try {
      const { postId, content, userId } = req.body;
  
      const comment = await Comment.create({ postId, content, userId });
      res.status(200).json(comment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  getComment: async (req, res) => {
    try {
      const { postId } = req.params;
      const comments = await Comment.findAll({ 
        order: [['createdAt', 'DESC']],
        where: { postId },
        include: [
          {
            model: User,
            attributes: ['fullName']
          }
        ],
      });
      res.status(200).json(comments);
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  updateComment: async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const comment = await Comment.findByPk(id);
      if (comment) {
        comment.content = content;
        await comment.save();
        res.status(200).json(comment);
      } else {
        res.status(404).json({ error: 'Comment not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;
      const comment = await Comment.findByPk(id);
      if (comment) {
        await comment.destroy();
        res.status(200).json({ message: 'Comment deleted' });
      } else {
        res.status(404).json({ error: 'Comment not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  

};

