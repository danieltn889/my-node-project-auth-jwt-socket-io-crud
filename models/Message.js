const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  text: String,
  id: String,
  timestamp: { type: Date, default: Date.now },
  replyTo: { type: String, default: null },
  replyText: { type: String, default: null },
  replyUser: { type: String, default: null }
});

module.exports = mongoose.model('Message', messageSchema);