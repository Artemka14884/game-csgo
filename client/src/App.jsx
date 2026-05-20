import React, { useState, useEffect } from 'react';
import Menu from './components/Menu';
import Lobby from './components/Lobby';
import Game from './components/Game';
import { NetworkManager } from './game/NetworkManager';

function App() {
  const [gameState, setGameState] = useState('menu'); // menu, lobby, game
  const [roomId, setRoomId] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [network, setNetwork] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const net = new NetworkManager();
    setNetwork(net);

    net.on('room_created', ({ roomId, playerId }) => {
      setRoomId(roomId);
      setPlayerId(playerId);
      setGameState('lobby');
    });

    net.on('room_joined', ({ roomId, playerId }) => {
      setRoomId(roomId);
      setPlayerId(playerId);
      setGameState('lobby');
    });

    net.on('players_list', (playersList) => {
      setPlayers(playersList);
    });

    net.on('game_started', () => {
      setGameState('game');
    });

    net.on('error', ({ message }) => {
      alert(message);
    });

    return () => {
      net.disconnect();
    };
  }, []);

  const handleCreateRoom = (playerName) => {
    network.createRoom(playerName);
  };

  const handleJoinRoom = (roomId, playerName) => {
    network.joinRoom(roomId, playerName);
  };

  const handleStartGame = () => {
    network.startGame();
  };

  const handleLeaveLobby = () => {
    setGameState('menu');
    setRoomId(null);
  };

  const handleLeaveGame = () => {
    setGameState('menu');
    window.location.reload(); // Простой способ перезагрузить игру
  };

  return (
    <div className="app">
      {gameState === 'menu' && (
        <Menu onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />
      )}
      {gameState === 'lobby' && (
        <Lobby
          roomId={roomId}
          players={players}
          playerId={playerId}
          onStartGame={handleStartGame}
          onLeave={handleLeaveLobby}
        />
      )}
      {gameState === 'game' && (
        <Game
          roomId={roomId}
          playerId={playerId}
          network={network}
          onLeave={handleLeaveGame}
        />
      )}
    </div>
  );
}

export default App;