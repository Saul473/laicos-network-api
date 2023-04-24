const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

const headCount = async () => {
    const numberOfUsers = await User.aggregate()
        .count('userCount');
    return numberOfUsers;
}

module.exports = {
    // Get all users
    async getUsers(req, res) {
        try {
            const users = await User.find();

            res.status(200).json(users);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },


    // Get a single user
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId });

            if (!user) {
                return res.status(400).json({ message: 'no user with that ID!' });
            }
            res.status(200).json(user);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    // Create a new user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    // Update a user 
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { new: true }
            );
            if (!user) {
                return res.status(400).json({ message: 'no user with that ID!' });
            }
            res.status(200).json({ message: 'user updated successfully!' })
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // delete a user and thoughts attached to user
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndRemove({ _id: req.params.userId });

            if (!user) {
                return res.status(400).json({ message: 'no user with that ID!' });
            }

            const thoughts = await Thought.findOneAndUpdate(
                { users: req.params.userId },
                { $pull: { users: req.params.userId } },
                { new: true }
            );

            if (!thoughts) {
                return res.status(404).json({ message: 'user has been deleted but there were no thoughts found.' });
            }
            res.json({ message: 'successfully deleted!' });
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    async addFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID!' })
            }
            res.status(200).json({ message: 'Friend added successfully!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Delete a friend
    async removeFriend(req, res) {
        try {
            const user = await User.findByIdAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { new: true }
            );

            if (!user) {
                res.status(404).json({ message: 'No friend found with that ID!' });
            }
            res.status(200).json({ message: 'Friend removed successfully omg beefy *O*' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

};