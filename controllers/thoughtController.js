const { Thought, User } = require('../models');


module.exports = {
    // Get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.status(200).json(thoughts);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // Get one single thought
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId }).select('-__v');

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID!' })
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Post a new thought
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body).then((newThought) => {
                return User.findOneAndUpdate(
                    { username: req.body.username },
                    { $push: { thoughts: { _id: newThought._id } } },
                    { new: true }
                );
            });
            res.status(200).json(thought);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    // Update a thought
    async updateThought(req, res) {
        try {
            const thought = Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );
            if (!thought) {
                res.status(404).json({ message: 'No thought with this ID!' });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Delete a thought
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId }).then(() => {
                return User.findOneAndUpdate(
                    { thoughts: req.params.thoughtId },
                    { $pull: { thoughts: req.params.thoughtId } },
                    { new: true }
                );
            });

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID.' });
            }

            res.status(200).json({ message: 'Thought has been deleted!' })

            //   await User.deleteMany({ _id: { $in: thought.users } });
            //   res.json({ message: 'Thought and user deleted!' });
            // } catch (err) {
            //   res.status(500).json(err);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Post a new reaction
    async createReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body }},
                { new: true }
            );
            if(!thought) {
               return res.status(404).json({ message: 'No thought with that ID.'});
            }
            res.status(200).json({ message: 'Reaction added!'})
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }, 

    // Delete a reaction 
    async removeReaction(req,res) {
        try{
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: {reactionId: req.params.reactionId }}},
                { new: true }
            )
            if(!thought) {
               return res.status(404).json({ message: 'No thought with that ID.'})
            }
            res.status(200).json({ message: 'Reaction added!'})
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
};