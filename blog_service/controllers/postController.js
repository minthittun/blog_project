const sequelize = require('../config/database')
const User = require('../models/user');
const Post = require('../models/post');


module.exports = {

  getAllPost: async (req, res) => {
    try {

      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const posts = await Post.findAndCountAll({
        where: {
          status: true
        },
        include: [
          {
            model: User,
            attributes: ['fullName']
          }
        ],
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM "Comments" WHERE "Comments"."postId" = "Post"."id")'), 'commentCount']
          ]
        },
        limit: limit,
        offset: offset
      });
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  createPost: async (req, res) => {
    const { title, content, status, userId } = req.body;
    try {
      const newPost = await Post.create({ title, content, status, userId });
      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updatePost: async (req, res) => {
    
    try {
      const postId = req.params.id;
      const { title, content, status } = req.body;
      const post = await Post.findByPk(postId);
      if (post) {
        post.title = title;
        post.content = content;
        post.status = status;
        await post.save();
        res.json(post);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  deletePost: async (req, res) => {
    const postId = req.params.id;
    try {
      const deletedRowCount = await Post.destroy({ where: { id: postId } });
      if (deletedRowCount === 0) {
        res.status(404).json({ error: 'Post not found' });
      } else {
        res.json({ message: 'Post deleted successfully' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

};
