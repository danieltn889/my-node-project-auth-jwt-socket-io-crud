const Message = require('./models/Message');
const User = require('./models/User');

module.exports = async (io) => {
  const users = new Set();
  const messages = [];
  let founder = null;
  let typingUsers = new Set();
  const userSockets = new Map(); // username to socket

  // Load messages from db - all
  const dbMessages = await Message.find().sort({ timestamp: -1 });
  messages.push(...dbMessages.reverse().map(m => ({ id: m.id, userName: m.userName, text: m.text, replyTo: m.replyTo, replyText: m.replyText, replyUser: m.replyUser })));

  io.on('connection', (socket) => {
    console.log('A user connected');

    // Send current users and messages to the new connection
    socket.emit('userList', Array.from(users));
    socket.emit('loadMessages', messages);

    socket.on('join', (data) => {
      const { name, id } = data;
      if (!name) return;
      socket.userId = id;
      socket.username = name;
      userSockets.set(name, socket);
      User.findByIdAndUpdate(id, { online: true });
      if (!users.has(name)) {
        users.add(name);
        if (!founder) founder = name;
        io.emit("userJoined", name);
      }
      socket.emit('isFounder', socket.username === founder);
      io.emit('userList', Array.from(users));
      socket.emit('loadMessages', messages);
    });

    socket.on('disconnect', () => {
      if (users.has(socket.username)) {
        users.delete(socket.username);
        userSockets.delete(socket.username);
        User.findByIdAndUpdate(socket.userId, { online: false });
        io.emit('userLeft', socket.username);
        io.emit('userList', Array.from(users));
      }
      typingUsers.delete(socket.username);
      socket.broadcast.emit('typingUsers', Array.from(typingUsers));
      console.log('A user disconnected');
    });

    socket.on('ChatMessage', async (data) => {
      const message = typeof data === 'string' ? data : data.text;
      const msgData = { id: Date.now() + Math.random(), userName: socket.username, text: message };
      if (data.replyTo) msgData.replyTo = data.replyTo;
      if (data.replyText) msgData.replyText = data.replyText;
      if (data.replyUser) msgData.replyUser = data.replyUser;
      if (data.private && data.recipient) {
        const recipientSocket = userSockets.get(data.recipient);
        if (recipientSocket) {
          recipientSocket.emit('privateMessage', msgData);
          socket.emit('privateMessage', msgData); // also send to sender
        }
      } else {
        messages.push(msgData);
        const msg = new Message({ user: socket.userId, ...msgData });
        await msg.save();
        io.emit('ChatMessage', msgData);
      }
      typingUsers.delete(socket.username);
      socket.broadcast.emit('typingUsers', Array.from(typingUsers));
    });

    socket.on('deleteMessage', async (id) => {
      const index = messages.findIndex(m => m.id === id);
      if (index > -1) {
        const message = messages[index];
        if (message.userName === socket.username || socket.username === founder) {
          messages.splice(index, 1);
          await Message.findOneAndDelete({ id });
          io.emit('messagesUpdate', messages);
        }
      }
    });

    socket.on('editMessage', async (data) => {
      const { id, text } = data;
      const index = messages.findIndex(m => m.id === id);
      if (index > -1) {
        const message = messages[index];
        if (message.userName === socket.username || socket.username === founder) {
          messages[index].text = text;
          await Message.findOneAndUpdate({ id }, { text });
          io.emit('messageEdited', messages[index]);
        }
      }
    });

    socket.on('kickUser', (username) => {
      if (socket.username === founder && users.has(username)) {
        users.delete(username);
        io.emit('userLeft', username);
        io.emit('userList', Array.from(users));
        typingUsers.delete(username);
        socket.broadcast.emit('typingUsers', Array.from(typingUsers));
      }
    });

    socket.on('clearUsers', () => {
      if (socket.username === founder) {
        users.clear();
        founder = null;
        io.emit('userList', []);
        io.emit('message', 'Users list cleared by founder');
        typingUsers.clear();
        socket.broadcast.emit('typingUsers', []);
      }
    });

    socket.on('clearMessages', async () => {
      if (socket.username === founder) {
        messages.length = 0;
        await Message.deleteMany({});
        io.emit('messagesUpdate', []);
        io.emit('message', 'Messages cleared by founder');
      }
    });

    socket.on('typing', () => {
      typingUsers.add(socket.username);
      socket.broadcast.emit('typingUsers', Array.from(typingUsers));
    });

    socket.on('leave', () => {
      if (users.has(socket.username)) {
        users.delete(socket.username);
        userSockets.delete(socket.username);
        User.findByIdAndUpdate(socket.userId, { online: false });
        io.emit('userLeft', socket.username);
        io.emit('userList', Array.from(users));
        typingUsers.delete(socket.username);
        socket.broadcast.emit('typingUsers', Array.from(typingUsers));
      }
    });

    socket.on('loadMoreMessages', async (lastMessageId) => {
      const lastMsg = await Message.findOne({ id: lastMessageId });
      if (lastMsg) {
        const olderMessages = await Message.find({ timestamp: { $lt: lastMsg.timestamp } }).sort({ timestamp: -1 }).limit(50);
        socket.emit('olderMessages', olderMessages.reverse().map(m => ({ id: m.id, userName: m.userName, text: m.text })));
      }
    });
  });
};