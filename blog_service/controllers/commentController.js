const Comment = require('../models/comment');

module.exports = {

  createComment: async (req, res) => {
    try {
      const { postId, content, userId } = req.body;
  
      const comment = await Comment.create({ postId, content, userId });
      res.json(comment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  getComment: async (req, res) => {
    try {
      const { postId } = req.params;
      console.log(postId)
      const comments = await Comment.findAll({ where: { postId } });
      res.json(comments);
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
        res.json(comment);
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
        res.json({ message: 'Comment deleted' });
      } else {
        res.status(404).json({ error: 'Comment not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  

};

