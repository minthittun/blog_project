const sequelize = require('../config/database')
const path = require('path');
const User = require('../models/user');
const Post = require('../models/post');


module.exports = {

  showPostPhoto: async (req, res) => {
    try {
      const {postId} = req.query;
      const post = await Post.findByPk(postId);
      if (!post || !post.photo) {
        return res.status(404).json({ message: 'Photo not found' });
      }
      const photoPath = path.join(__dirname, '..', post.photo);
      res.status(200).sendFile(photoPath);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  getAllPost: async (req, res) => {
    try {

      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const posts = await Post.findAndCountAll({
        order: [['createdAt', 'DESC']],
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
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getAllPostByUserId: async (req, res) => {
    try {

      const userId = req.params.userId;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const posts = await Post.findAndCountAll({
        order: [['createdAt', 'DESC']],
        where: {
          userId: userId
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
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getSinglePost: async (req, res) => {
    
    try {
      const postId = req.params.id;
      const post = await Post.findByPk(postId, {
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
        }
      });
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  createPost: async (req, res) => {
    
    try {
      const { title, content, status, userId } = req.body;
      const file = req.file;

      
      let filePath = null;

      if(file) filePath = file.path;

      const post_create = {
        title: title, 
        content: content, 
        status: status, 
        userId: userId, 
        photo: filePath
      }

      const newPost = await Post.create(post_create);
      res.status(200).json(newPost);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updatePost: async (req, res) => {
    
    try {
      const postId = req.params.id;
      const { title, content, status, photo } = req.body;

      const file = req.file;
      
      let filePath = null;

      if(file) {
        filePath = file.path;
      } else {
        filePath = photo;
      }

      const post = await Post.findByPk(postId);
      if (post) {
        post.title = title;
        post.content = content;
        post.status = status;
        post.photo = filePath;

        await post.save();
        res.status(200).json(post);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (error) {
      console.log(error)
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
        res.status(200).json({ message: 'Post deleted successfully' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

};
