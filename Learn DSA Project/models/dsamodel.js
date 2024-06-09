const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the "Topic" collection
const topicSchema = new Schema({
  topicName: {
    type: String,
    required: true
  },
  position: {
    type: Number,
    required: true
  },
  started: {
    type: Boolean,
    default: false
  },
  doneQuestions: {
    type: Number,
    default: 0
  },
  questions: [{
    Topic: String,
    Problem: String,
    Done: {
      type: Boolean,
      default: false
    },
    Bookmark: {
      type: Boolean,
      default: false
    },
    Notes: String,
    URL: String,
    URL2: String
  }]
});

// Create a model for the "Topic" collection using the schema
const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
