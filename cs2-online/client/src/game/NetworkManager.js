import { io } from 'socket.io-client';

export class NetworkManager {
  constructor() {
    this.socket = io(window.location.origin, {
      transports: ['websocket']
    });
    this.listeners = new Map();
  }

  on(event, callback) {
    this.socket.on(event, callback);
    this.listeners.set(event, callback);
  }

  emit(event, data) {
    this.socket.emit(event, data);
  }

  createRoom(playerName) {
    this.emit('create_room', { playerName });
  }

  joinRoom(roomId, playerName) {
    this.emit('join_room', { roomId, playerName });
  }

  startGame() {
    this.emit('start_game');
  }

  sendMove(moveX, moveZ, rotation, delta) {
    this.emit('player_move', { moveX, moveZ, rotation, delta });
  }

  sendShoot(rayDirection) {
    this.emit('player_shoot', { rayDirection });
  }

  disconnect() {
    this.socket.disconnect();
  }
}