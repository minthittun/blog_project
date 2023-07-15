const {User} = require('../database')


module.exports = {

    syncUserData: async (req, res) => {
        
        const { userId, name } = req.body;
        try {
            

            const userData = { userId, name };
              
              // Find a user with the given userId
              User.findOneAndUpdate(
                { userId: userData.userId },
                { $set: userData },
                { upsert: true, new: true }
              )
                .then(user => {})
                .catch(err => {
                });

          res.status(201).json({ userId, name });
        } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
        }
      },


};
