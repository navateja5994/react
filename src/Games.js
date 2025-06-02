import React, { useState } from 'react';
import BackgroundLayout from './BackgroundLayout';
import BackButton from './BackButton';
import candycrush from './candycrush.png';
import clans from './clans.png';
import among from './among.png';
import pubg from './pubg.png';
import pokemon from './pokemon.png';
import tetris from './tetris.png';
import tictac from './tictac.png';
import teja from './2048.png';


const gamesData = [
  { id: 1, name: 'Candy Crush', image: candycrush ,url: 'https://www.culinaryschools.org/kids-games/candy-crush/' },
  { id: 2, name: 'Clash of Clans', image: clans },
  { id: 3, name: 'Among Us', image: among ,url :'https://amongus-online.net/game/amongus'},
  { id: 4, name: 'PUBG Mobile', image: pubg },
  { id: 5, name: 'Pokemon Go', image: pokemon , url: 'https://www.play-games.com/game/29304/pokemon-x-y.html'},
  { id: 6, name: '2048', image: teja, url: null },
  { id: 7, name: 'Tetris', image: tetris, url: null },
  { id: 8, name: 'Tic Tac Toe', image: tictac, url: null },
];

const Games = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGames = gamesData.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <BackgroundLayout>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <h1 style={{
          color: '#39ff14',
          textShadow: '0 0 5px #39ff14, 0 0 10px #39ff14, 0 0 20px #39ff14, 0 0 40px #39ff14'
        }}>Mobile Games</h1>
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            marginBottom: '20px',
            padding: '8px',
            width: '300px',
            backgroundColor: '#000',
            color: '#39ff14',
            border: '2px solid #39ff14',
            borderRadius: '5px',
            boxShadow: '0 0 5px #39ff14, 0 0 10px #39ff14'
          }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {filteredGames.map(game => (
            <div key={game.id} style={{ width: '150px', textAlign: 'center', cursor: game.url || game.name === 'Tic Tac Toe' || game.name === 'Tetris' ? 'pointer' : 'default' }}
              onClick={() => {
                if (game.url) {
                  window.open(game.url, '_blank');
                } else if (game.name === 'Tic Tac Toe') {
                  window.location.href = '/tictactoe';
                } else if (game.name === 'Tetris') {
                  window.location.href = '/tetris';
                } else if (game.name === '2048') {
                  window.location.href = '/2048';
                }
              }}
            >
              <img
                src={game.image}
                alt={game.name}
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
              />
              <p style={{ color: '#1aff1a', textShadow: '0 0 3px #1aff1a' }}>{game.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 1000 }}>
        <BackButton />
      </div>
    </BackgroundLayout>
  );
};

export default Games;
