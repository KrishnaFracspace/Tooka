// import { io, Socket } from 'socket.io-client';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// type SocketEventListener = (data: any) => void;

// class SocketService {
//   private socket: Socket | null = null;
//   private listeners: Record<string, Set<SocketEventListener>> = {};

//   async connect(): Promise<void> {
//     if (this.socket && this.socket.connected) {
//       console.log('[SocketService] connect ignored. Already connected.');
//       return;
//     }

//     try {
//       const token = await AsyncStorage.getItem('authToken');
//       // console.log('Socket Token:', token);
//       // console.log('Socket Role:', 'user');
//       if (!token) {
//         console.warn('[SocketService] Cannot connect without auth token.');
//         return;
//       }

//       console.log('[SocketService] Connecting to production Socket.IO backend...');
//       this.socket = io('https://api.tooka.app', {
//         auth: {
//           token,
//           role: 'user',
//         },
//         transports: ['websocket'],
//         reconnection: true,
//       });

//       this.socket.on('connect', () => {
//         console.log('[SocketService] Socket connected successfully.');
//         console.log('[SocketService] Socket ID:', this.socket?.id);
//         console.log('[SocketService] Connected:', this.socket?.connected);
//       });

//       this.socket.onAny((event, ...args) => {
//         console.log(
//           '[Socket]',
//           event,
//           JSON.stringify(args, null, 2)
//         );
//       });

//       this.socket.on('connect', () => {
//         console.log('[SocketService] Socket connected successfully.', this.socket?.id);
//       });

//       this.socket.on('disconnect', (reason) => {
//         console.log(`[SocketService] Socket disconnected: ${reason}`);
//       });

//       this.socket.on('connect_error', (error) => {
//         console.error('[SocketService] Socket connection error:', error);
//       });

//       // Bind all existing local listeners to the new socket instance
//       this.rebindListeners();

//     } catch (error) {
//       console.error('[SocketService] Initialization error:', error);
//     }
//   }

//   disconnect() {
//     console.log('[SocketService] Disconnecting socket...');
//     if (this.socket) {
//       this.socket.disconnect();
//       this.socket = null;
//     }
//     // We clear listeners on disconnect to prevent memory leaks across sessions
//     this.listeners = {};
//   }

//   isConnected(): boolean {
//     return this.socket?.connected || false;
//   }

//   on(event: string, listener: SocketEventListener) {
//     if (!this.listeners[event]) {
//       this.listeners[event] = new Set();
//     }
//     if (this.listeners[event].has(listener)) {
//       console.log(`[SocketService] Warning: listener for ${event} already registered.`);
//       return;
//     }
//     this.listeners[event].add(listener);

//     // If socket is already active, bind it immediately
//     if (this.socket) {
//       this.socket.on(event, listener);
//     }
//   }

//   off(event: string, listener: SocketEventListener) {
//     if (!this.listeners[event]) return;
//     this.listeners[event].delete(listener);

//     if (this.socket) {
//       this.socket.off(event, listener);
//     }
//   }

//   emit(event: string, data?: any) {
//     if (!this.socket || !this.socket.connected) {
//       console.warn(`[SocketService] Emit failed for event: ${event}. Socket is not connected.`);
//       return;
//     }
//     // console.log(`[SocketService] Emitting event: ${event}`, data);
//     console.log(
//   '[SocketService] Emitting:',
//   event,
//   JSON.stringify(data, null, 2),
// );
//     this.socket.emit(event, data);
//   }

//   private rebindListeners() {
//     if (!this.socket) return;
//     Object.keys(this.listeners).forEach((event) => {
//       this.listeners[event].forEach((listener) => {
//         this.socket!.on(event, listener);
//       });
//     });
//   }
// }

// export const socketService = new SocketService();



import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SocketEventListener = (data: any) => void;

class SocketService {
  private socket: Socket | null = null;
  private listeners: Record<string, Set<SocketEventListener>> = {};

  async connect(): Promise<void> {
    if (this.socket && this.socket.connected) {
      console.log('[SocketService] Already connected.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.warn('[SocketService] Cannot connect without auth token.');
        return;
      }

      console.log('[SocketService] Connecting to Socket.IO backend...');
      this.socket = io('https://api.tooka.app', {
        auth: {
          token,
          role: 'user',
        },
        transports: ['websocket', 'polling'], // Allow polling fallback for RN reliability
        reconnection: true,
      });

      this.socket.on('connect', () => {
        console.log('[SocketService] Socket connected successfully. ID:', this.socket?.id);
        this.rebindListeners();
      });

      this.socket.onAny((event, ...args) => {
        console.log('[Socket Received Event]:', event, JSON.stringify(args, null, 2));
      });

      this.socket.on('disconnect', (reason) => {
        console.log(`[SocketService] Socket disconnected: ${reason}`);
      });

      this.socket.on('connect_error', (error) => {
        console.error('[SocketService] Socket connection error:', error);
      });

    } catch (error) {
      console.error('[SocketService] Initialization error:', error);
    }
  }

  disconnect() {
    console.log('[SocketService] Disconnecting socket...');
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners = {};
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  on(event: string, listener: SocketEventListener) {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set();
    }
    this.listeners[event].add(listener);

    if (this.socket) {
      this.socket.off(event, listener); // Prevent duplicate listeners
      this.socket.on(event, listener);
    }
  }

  off(event: string, listener: SocketEventListener) {
    if (this.listeners[event]) {
      this.listeners[event].delete(listener);
    }
    if (this.socket) {
      this.socket.off(event, listener);
    }
  }

  // Updated to accept optional acknowledgment callback (ack)
  emit(event: string, data?: any, ack?: (response: any) => void) {
    if (!this.socket || !this.socket.connected) {
      console.warn(`[SocketService] Emit failed for event: ${event}. Socket not connected.`);
      return;
    }
    console.log('[SocketService] Emitting:', event, JSON.stringify(data, null, 2));
    
    if (ack) {
      this.socket.emit(event, data, ack);
    } else {
      this.socket.emit(event, data);
    }
  }

  private rebindListeners() {
    if (!this.socket) return;
    Object.keys(this.listeners).forEach((event) => {
      this.listeners[event].forEach((listener) => {
        this.socket!.off(event, listener); // Ensure clean bind
        this.socket!.on(event, listener);
      });
    });
  }
}

export const socketService = new SocketService();