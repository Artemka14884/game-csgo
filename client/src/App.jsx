import React, { useState, useEffect } from 'react';
import Menu from './components/Menu.jsx';
import Lobby from './components/Lobby.jsx';
import Game from './components/Game.jsx';
import { io } from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState('menu');
  const [roomId, setRoomId] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);

  useEffect(() => {
    const newSocket = io(window.location.origin, {
      transports: ['websocket']
    });
    setSocket(newSocket);

    newSocket.on('room_created', ({ roomId, playerId, room }) => {
      setRoomId(roomId);
      setPlayerId(playerId);
      setPlayers(room.players);
      setRoomInfo(room);
      setGameState('lobby');
    });

    newSocket.on('room_joined', ({ roomId, playerId, room }) => {
      setRoomId(roomId);
      setPlayerId(playerId);
      setPlayers(room.players);
      setRoomInfo(room);
      setGameState('lobby');
    });

    newSocket.on('players_update', (playersList) => {
      setPlayers(playersList);
    });

    newSocket.on('game_started', () => {
      setGameState('game');
    });

    newSocket.on('error', ({ message }) => {
      alert(message);
    });

    newSocket.on('left_room', () => {
      setGameState('menu');
      setRoomId(null);
      setPlayers([]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleCreateRoom = (playerName) => {
    socket.emit('create_room', { playerName });
  };

  const handleJoinRoom = (roomId, playerName) => {
    socket.emit('join_room', { roomId, playerName });
  };

  const handleStartGame = () => {
    socket.emit('start_game');
  };

  const handleLeaveLobby = () => {
    socket.emit('leave_room');
  };

  const handleLeaveGame = () => {
    socket.emit('leave_room');
  };

  return (
    <div className="app">
      {gameState === 'menu' && (
        <Menu 
          socket={socket}
          onCreateRoom={handleCreateRoom} 
          onJoinRoom={handleJoinRoom} 
        />
      )}
      {gameState === 'lobby' && (
        <Lobby
          roomId={roomId}
          players={players}
          playerId={playerId}
          roomInfo={roomInfo}
          onStartGame={handleStartGame}
          onLeave={handleLeaveLobby}
          socket={socket}
        />
      )}
      {gameState === 'game' && (
        <Game
          roomId={roomId}
          playerId={playerId}
          socket={socket}
          onLeave={handleLeaveGame}
        />
      )}
    </div>
  );
}

export default App;