import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../config/logger';

export const setupSocketHandlers = (io: Server) => {
  // Auth middleware for sockets
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      socket.data.userId = payload.sub;
      socket.data.role = payload.role;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.userId;
    logger.info(`Socket connected: ${userId}`);

    // Join personal room
    socket.join(`user:${userId}`);

    // Join booking session room
    socket.on('join:session', (sessionId: string) => {
      socket.join(`session:${sessionId}`);
      socket.to(`session:${sessionId}`).emit('peer:joined', { userId });
    });

    // In-session chat
    socket.on('session:message', ({ sessionId, content }: any) => {
      io.to(`session:${sessionId}`).emit('session:message', {
        senderId: userId,
        content,
        timestamp: new Date().toISOString(),
      });
    });

    // Async messages
    socket.on('message:send', (data: any) => {
      io.to(`user:${data.receiverId}`).emit('message:receive', {
        ...data,
        senderId: userId,
        timestamp: new Date().toISOString(),
      });
    });

    // Typing indicators
    socket.on('typing:start', ({ to }: any) => socket.to(`user:${to}`).emit('typing:start', { userId }));
    socket.on('typing:stop', ({ to }: any) => socket.to(`user:${to}`).emit('typing:stop', { userId }));

    // Notification emit helper (called from controllers)
    socket.on('notification:read', (notificationId: string) => {
      socket.emit('notification:updated', { id: notificationId, isRead: true });
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${userId}`);
      socket.to(`session:all`).emit('peer:left', { userId });
    });
  });

  return io;
};

// Utility: emit notification to a user
export const emitNotification = (io: Server, userId: string, notification: any) => {
  io.to(`user:${userId}`).emit('notification:new', notification);
};
