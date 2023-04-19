const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            min_length: 3,
            max_legnth: 16,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            //  add validation method to make sure email is valid, regex validation mongoose.
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought',
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

userSchema
    .virtual('friendCount')
    .get(function() {
        return this.friends.length
    });

const User = model('user', userSchema);
module.exports = User;