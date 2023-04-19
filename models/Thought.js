const { Schema, model } = require('mongoose');
const reactionSchema = require('../models/Reaction')

// const reactionSchema = new Schema(
//     {
//         reactionId: {
//             type: Schema.Types.ObjectId,
//             default: () => new Types.ObjectId()
//         },
//         reactionBody: {
//             type: String,
//             required: true,
//             min_length: 1,
//             max_length: 280,
//         },
//         username: {
//             type: String,
//             required: true,
//         },
//         createdAt: {
//             type: Date,
//             default: Date.now(),
//             // format timestamp on query
//         }
//     }
// )

// Schema for what makes up a thought
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            min_Length: 1,
            max_Length: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // format timestamp on query
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [
            reactionSchema
        ]
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

thoughtSchema
    .virtual('reactionCount')
    //Getter
    .get(function() {
        return this.reactions.length;
    });

    const Thought = model('thought', thoughtSchema);
    module.exports = Thought;
    

