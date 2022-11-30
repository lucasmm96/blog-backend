let io;

module.exports = {
  init: (httpServer, corsOrigin) => {
    io = require('socket.io')(httpServer, { cors: { origin: corsOrigin } });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io is not initialized');
    }
    return io;
  }
};