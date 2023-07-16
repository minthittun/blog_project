const cors = require('cors');
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

// Models and relation
const User = require('./models/user')
const Post = require('./models/post')
const Comment = require('./models/comment')

Post.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });

Comment.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });

Comment.belongsTo(Post, { foreignKey: 'postId', onDelete: 'CASCADE' });
Post.hasMany(Comment, { foreignKey: 'postId', onDelete: 'CASCADE' });


// cors
app.use(cors());

// Middleware
// Parse JSON request bodies
app.use(express.json());


// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server started on port ' + PORT);
});
