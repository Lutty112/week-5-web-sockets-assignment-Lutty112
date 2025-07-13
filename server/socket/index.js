// socket/index.js
const User = require('../models/User'); 
const Message = require('../models/Message'); 
const Room = require('../models/Room');


module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log("Socket Connected:", socket.id);
         let currentUser = null;
         let currentRoom = null;

    // Handle user joining
     socket.on("joinRoom", async ({ username, roomId })=> {
           currentUser = await User.findOneAndUpdate(
                  { username },
                { socketId: socket.id, isOnline: true },
                { new: true }
            );
           currentRoom = await Room.findOne({ name: roomId });

            socket.join(roomId);
            io.to(roomId).emit("userJoined", { user: currentUser, roomId });
             });

    // Global or room-based message
      socket.on("sendMessage", async (data) => {
          if (!currentUser || !currentRoom) {
        // optionally: reject or ignore sendMessage until user joins
        return;
      }
        const { content, type } = typeof data === 'string'
          ? { content: data, type: 'text' }
          : data;

        const message = await Message.create({
          sender: currentUser._id,
          room: currentRoom._id,
          content,
          type: type || 'text',
          isPrivate: false,
          recipients: [],
          timestamp: new Date().toISOString(),
        });

        const fullMessage = await message.populate("sender", "username");
         io.to(currentRoom.name).emit("newMessage", fullMessage);
       });

    // Typing indicator
    socket.on("typing", () => {
      if (currentRoom && currentUser) {
        socket.to(currentRoom.name).emit("typing", currentUser.username);
      }
    });

    socket.on("stopTyping", () => {
      if (currentRoom && currentUser) {
        socket.to(currentRoom.name).emit("stopTyping", currentUser.username);
      }
    });

    // Private message
    socket.on("privateMessage", async (data) => {

        const { content, recipientSocketId } = data;

        const message = await Message.create({
          sender: currentUser._id,
          room: currentRoom._id,
          content,
          isPrivate: true,
          recipients: [recipientSocketId],
          timestamp: new Date().toISOString(),
        });

        const fullMessage = await message.populate("sender", "username");
        io.to(recipientSocketId).emit("newPrivateMessage", fullMessage);
      });
  

    // Read Receipt
      socket.on('messageRead', async ({ messageId }) => {
       try {
        const updated = await Message.findByIdAndUpdate(
        messageId,
        { $addToSet: { readBy: currentUser._id } },
        { new: true }
        ).populate('readBy', 'username');

         io.to(currentRoom.name).emit('messageReadUpdate', {
         messageId,
         userId: currentUser._id,
         username: currentUser.username,  // Fix here
     });
    } catch (err) {
      console.error('Read receipt error:', err);
  }
});
      // Reactions
      socket.on('addReaction', async ({ messageId, emoji }) => {
       try {
        const updated = await Message.findByIdAndUpdate(
        messageId,
        { $addToSet: { reactions: { user: currentUser._id, emoji } } },
        { new: true }
        ).populate('reactions.user', 'username');

         io.to(currentRoom.name).emit('reactionUpdate', {
         messageId,
         reaction: { userId: currentUser._id, username: currentUser.username, emoji }, // Fix here
    });
   } catch (err) {
     console.error('Reaction error:', err);
  }
});
    // Handle disconnection
    socket.on("disconnect", async () => {
         if (currentUser) {
        await User.findOneAndUpdate(
          { socketId: socket.id },
          { isOnline: false }
        );
        io.emit("userOffline", currentUser.username);
      }
    });
  });
};

