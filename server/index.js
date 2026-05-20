import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { GameState } from './game/GameState.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ['websocket'],
  pingTimeout: 60000,
  pingInterval: 25000
});

app.use(cors());
app.use(express.json());

// Хранилище игр и комнат
const games = new Map();
const rooms = new Map();

// Игровой цикл
setInterval(() => {
  for (const [roomId, gameState] of games) {
    if (gameState.players.size > 0) {
      gameState.update();
      const state = gameState.getSerializedState();
      io.to(roomId).emit('game_state', state);
    }
  }
}, 50); // 20 FPS

// Очистка пустых комнат каждую минуту
setInterval(() => {
  for (const [roomId, gameState] of games) {
    if (gameState.players.size === 0) {
      games.delete(roomId);
      rooms.delete(roomId);
    }
  }
}, 60000);

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);
  
  let currentRoom = null;
  let currentPlayer = null;

  // Создание комнаты
  socket.on('create_room', ({ playerName }) => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const gameState = new GameState(roomId);
    
    games.set(roomId, gameState);
    rooms.set(roomId, { players: new Map() });
    
    currentRoom = roomId;
    currentPlayer = gameState.addPlayer(socket.id, playerName);
    
    socket.join(roomId);
    socket.emit('room_created', { roomId, playerId: socket.id });
    io.to(roomId).emit('players_list', gameState.getPlayersList());
  });

  // Подключение к комнате
  socket.on('join_room', ({ roomId, playerName }) => {
    const gameState = games.get(roomId);
    
    if (!gameState) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }
    
    if (gameState.players.size >= 8) {
      socket.emit('error', { message: 'Room is full' });
      return;
    }
    
    currentRoom = roomId;
    currentPlayer = gameState.addPlayer(socket.id, playerName);
    
    socket.join(roomId);
    socket.emit('room_joined', { roomId, playerId: socket.id });
    io.to(roomId).emit('players_list', gameState.getPlayersList());
  });

  // Начало игры
  socket.on('start_game', () => {
    const gameState = games.get(currentRoom);
    if (gameState && gameState.players.get(socket.id)?.isHost) {
      gameState.startGame();
      io.to(currentRoom).emit('game_started');
    }
  });

  // Движение игрока
  socket.on('player_move', (data) => {
    const gameState = games.get(currentRoom);
    if (gameState && gameState.gameActive) {
      gameState.updatePlayerPosition(socket.id, data);
    }
  });

  // Стрельба
  socket.on('player_shoot', (data) => {
    const gameState = games.get(currentRoom);
    if (gameState && gameState.gameActive) {
      const hit = gameState.processShoot(socket.id, data);
      if (hit) {
        io.to(currentRoom).emit('hit_marker', { shooterId: socket.id, hitPlayerId: hit.playerId });
      }
    }
  });

  // Отключение
  socket.on('disconnect', () => {
    if (currentRoom) {
      const gameState = games.get(currentRoom);
      if (gameState) {
        gameState.removePlayer(socket.id);
        io.to(currentRoom).emit('players_list', gameState.getPlayersList());
      }
    }
    console.log(`Player disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});