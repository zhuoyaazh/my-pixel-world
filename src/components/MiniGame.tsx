'use client';

import { useState, useEffect, useCallback } from 'react';

type GameType = 'memory' | 'tictactoe';

interface MiniGameProps {
  labels: {
    memory?: string;
    game2048?: string;
    tictactoe: string;
    gameOver: string;
    score: string;
    highScore: string;
    restart: string;
    yourTurn: string;
    computerTurn: string;
    youWin: string;
    youLose: string;
    draw: string;
  };
}

export default function MiniGame({ labels }: MiniGameProps) {
  const [gameType, setGameType] = useState<GameType>('memory');

  return (
    <div className="space-y-4">
      {/* Game Selector */}
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          onClick={() => setGameType('memory')}
          className={`px-3 py-2 text-[10px] sm:text-xs font-bold border-2 border-black transition-all ${
            gameType === 'memory' ? 'bg-pastel-mint text-black' : 'bg-white hover:bg-gray-100'
          }`}
        >
          🎴 Memory
        </button>
        <button
          onClick={() => setGameType('tictactoe')}
          className={`px-3 py-2 text-[10px] sm:text-xs font-bold border-2 border-black transition-all ${
            gameType === 'tictactoe' ? 'bg-pastel-mint text-black' : 'bg-white hover:bg-gray-100'
          }`}
        >
          {labels.tictactoe}
        </button>
      </div>

      {/* Game Canvas */}
      {gameType === 'memory' && <MemoryGame labels={labels} />}
      {gameType === 'tictactoe' && <TicTacToeGame labels={labels} />}
    </div>
  );
}

// Memory Card Game
function MemoryGame({ labels }: MiniGameProps) {
  const CARDS = ['🍎', '🍊', '🍋', '🍌', '🍓', '🍑', '🍒', '🥝'];
  const [gameCards] = useState(() => [...CARDS, ...CARDS].sort(() => Math.random() - 0.5));

  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [highScore, setHighScore] = useState<number | null>(null);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('memoryHighScore');
    if (saved) {
      const timer = setTimeout(() => {
        setHighScore(parseInt(saved));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  // Check for matches
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (gameCards[first] === gameCards[second]) {
        setTimeout(() => {
          setMatched([...matched, first, second]);
          setFlipped([]);
          setMoves(moves + 1);
        }, 0);
      } else {
        // Delay 1.2s to show both cards before flipping back
        setTimeout(() => {
          setFlipped([]);
          setMoves(moves + 1);
        }, 1200);
      }
    }
  }, [flipped, matched, gameCards, moves]);

  const handleCardClick = (index: number) => {
    if (flipped.includes(index) || matched.includes(index) || flipped.length === 2) return;
    setFlipped([...flipped, index]);
  };

  const restart = () => {
    if (matched.length === gameCards.length) {
      if (highScore === null || moves < highScore) {
        setHighScore(moves);
        localStorage.setItem('memoryHighScore', moves.toString());
      }
    }
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  const isWon = matched.length === gameCards.length;

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[9px] sm:text-[10px] font-bold">
        <span>{labels.score}: {moves}</span>
        {highScore !== null && <span>{labels.highScore}: {highScore}</span>}
      </div>

      {isWon && (
        <div className="text-center py-4 bg-pastel-yellow border-2 border-black">
          <p className="text-sm font-bold text-retro-border">🎉 {labels.youWin}!</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 mx-auto">
        {gameCards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => handleCardClick(idx)}
            disabled={isWon}
            className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-black font-bold text-2xl transition-all"
            style={{
              backgroundColor: flipped.includes(idx) || matched.includes(idx) ? '#ffd1dc' : '#b8e6f0',
              cursor: isWon ? 'default' : 'pointer',
            }}
          >
            {flipped.includes(idx) || matched.includes(idx) ? card : '?'}
          </button>
        ))}
      </div>

      <button
        onClick={restart}
        className="w-full px-3 py-2 bg-pastel-purple border-2 border-black font-bold text-[9px] sm:text-[10px] text-white hover:bg-opacity-80"
      >
        {labels.restart}
      </button>
    </div>
  );
}

// Tic Tac Toe Game Component
function TicTacToeGame({ labels }: MiniGameProps) {
  const [difficulty, setDifficulty] = useState<'easy' | 'hard' | null>(null);
  type Cell = 'X' | 'O' | null;
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<'X' | 'O' | 'draw' | null>(null);

  const checkWinner = useCallback((squares: Cell[]): 'X' | 'O' | 'draw' | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    if (squares.every((cell) => cell !== null)) {
      return 'draw';
    }

    return null;
  }, []);

  const minimax = useCallback(function minimaxFn(squares: Cell[], isMaximizing: boolean): number {
    const result = checkWinner(squares);
    if (result === 'O') return 10;
    if (result === 'X') return -10;
    if (result === 'draw') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = 'O';
          const score = minimaxFn(squares, false);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = 'X';
          const score = minimaxFn(squares, true);
          squares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }, [checkWinner]);

  const getBestMove = useCallback((squares: Cell[]): number => {
    if (difficulty === 'easy') {
      // Easy mode: random valid move
      const empty = [];
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) empty.push(i);
      }
      return empty.length > 0 ? empty[Math.floor(Math.random() * empty.length)] : -1;
    }

    // Hard mode: minimax
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        squares[i] = 'O';
        const score = minimax(squares, false);
        squares[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  }, [minimax, difficulty]);

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(() => {
        const newBoard = [...board];
        const move = getBestMove(newBoard);
        if (move !== -1) {
          newBoard[move] = 'O';
          setBoard(newBoard);
          const result = checkWinner(newBoard);
          if (result) {
            setWinner(result);
          } else {
            setIsPlayerTurn(true);
          }
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, winner, board, getBestMove, checkWinner]);

  const handleClick = (index: number) => {
    if (board[index] || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
    } else {
      setIsPlayerTurn(false);
    }
  };

  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
  };

  return (
    <div className="space-y-3">
      {/* Difficulty selector */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', fontSize: '12px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <input 
            type="radio" 
            name="difficulty" 
            checked={difficulty === 'easy'}
            onChange={() => { setDifficulty('easy'); restartGame(); }}
          /> Easy
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <input 
            type="radio" 
            name="difficulty" 
            checked={difficulty === 'hard'}
            onChange={() => { setDifficulty('hard'); restartGame(); }}
          /> Hard
        </label>
      </div>

      {/* Status */}
      <div className="text-center text-[10px] sm:text-xs font-bold">
        {winner ? (
          winner === 'draw' ? (
            <span className="text-pastel-yellow">{labels.draw}</span>
          ) : winner === 'X' ? (
            <span className="text-pastel-mint">{labels.youWin}</span>
          ) : (
            <span className="text-pastel-pink">{labels.youLose}</span>
          )
        ) : isPlayerTurn ? (
          <span className="text-pastel-blue">{labels.yourTurn} (X)</span>
        ) : (
          <span className="text-pastel-purple">{labels.computerTurn} (O)</span>
        )}
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-2 mx-auto" style={{ width: 'fit-content' }}>
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            disabled={!!winner || !isPlayerTurn || !!cell}
            className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-black bg-white font-bold text-2xl sm:text-3xl hover:bg-gray-100 disabled:cursor-not-allowed transition-all"
          >
            {cell === 'X' && <span className="text-pastel-mint">✕</span>}
            {cell === 'O' && <span className="text-pastel-purple">◯</span>}
          </button>
        ))}
      </div>

      {/* Restart Button */}
      <button
        onClick={restartGame}
        className="w-full px-3 py-2 bg-pastel-purple border-2 border-black font-bold text-[9px] sm:text-[10px] text-white hover:bg-opacity-80"
      >
        {labels.restart}
      </button>
    </div>
  );
}
