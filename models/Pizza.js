const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
      required: 'You need to provide a pizza name!',
      trim: true
    },
    createdBy: {
      type: String,
      required: 'You need to provide the creator\'s name!',
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      required: true,
      enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
      default: 'Large'
    },
    toppings: {
      type: Array
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
  // the reduce method runs through an array like .map, reduce takes in two inputs, the callback function and the initial value
  // the callback function has the "current total" on the left, which is either the initial value or the result of the last run
  // then it has the "current value" on the right, which can be the number in the array, or in this case the comment + replies
  return this.comments.reduce((total, comment) => total + comment.replies.length +1, 0);
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;