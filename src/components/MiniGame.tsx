'use client';

import { useState, useEffect, useCallback } from 'react';

type GameType = 'snake' | 'tictactoe';
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

interface MiniGameProps {
  labels: {
    snake: string;
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
  const [gameType, setGameType] = useState<GameType>('snake');

  return (
    <div className="space-y-4">
      {/* Game Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setGameType('snake')}
          className={`flex-1 px-3 py-2 text-[10px] sm:text-xs font-bold border-2 border-black transition-all ${
            gameType === 'snake' ? 'bg-pastel-mint text-black' : 'bg-white hover:bg-gray-100'
          }`}
        >
          {labels.snake}
        </button>
        <button
          onClick={() => setGameType('tictactoe')}
          className={`flex-1 px-3 py-2 text-[10px] sm:text-xs font-bold border-2 border-black transition-all ${
            gameType === 'tictactoe' ? 'bg-pastel-mint text-black' : 'bg-white hover:bg-gray-100'
          }`}
        >
          {labels.tictactoe}
        </button>
      </div>

      {/* Game Canvas */}
      {gameType === 'snake' ? (
        <SnakeGame labels={labels} />
      ) : (
        <TicTacToeGame labels={labels} />
      )}
    </div>
  );
}

// Snake Game Component
function SnakeGame({ labels }: MiniGameProps) {
  const GRID_SIZE = 15;
  const CELL_SIZE = 16;
  const INITIAL_SPEED = 150;

  const [snake, setSnake] = useState<Position[]>([{ x: 7, y: 7 }]);
  const [food, setFood] = useState<Position>({ x: 3, y: 3 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('snakeHighScore');
    if (saved) {
      const parsed = parseInt(saved);
      if (!Number.isNaN(parsed)) {
        const id = setTimeout(() => setHighScore(parsed), 0);
        return () => clearTimeout(id);
      }
    }
  }, []);

  // Generate random food position
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some((seg) => seg.x === newFood.x && seg.y === newFood.y));
    return newFood;
  }, []);

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const interval = setInterval(() => {
      setDirection(nextDirection);

      setSnake((prevSnake) => {
        const head = prevSnake[0];
        let newHead: Position;

        switch (nextDirection) {
          case 'UP':
            newHead = { x: head.x, y: head.y - 1 };
            break;
          case 'DOWN':
            newHead = { x: head.x, y: head.y + 1 };
            break;
          case 'LEFT':
            newHead = { x: head.x - 1, y: head.y };
            break;
          case 'RIGHT':
            newHead = { x: head.x + 1, y: head.y };
            break;
        }

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((prev) => {
            const newScore = prev + 10;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('snakeHighScore', newScore.toString());
            }
            return newScore;
          });
          setFood(generateFood(newSnake));
          return newSnake;
        } else {
          newSnake.pop();
          return newSnake;
        }
      });
    }, INITIAL_SPEED);

    return () => clearInterval(interval);
  }, [nextDirection, food, gameOver, isPaused, highScore, generateFood]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction !== 'DOWN') setNextDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
          if (direction !== 'UP') setNextDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction !== 'RIGHT') setNextDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
          if (direction !== 'LEFT') setNextDirection('RIGHT');
          break;
        case ' ':
          setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver]);

  const restartGame = () => {
    setSnake([{ x: 7, y: 7 }]);
    setFood({ x: 3, y: 3 });
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setIsPaused(true);
  };

  return (
    <div className="space-y-3">
      {/* Score Display */}
      <div className="flex justify-between text-[9px] sm:text-[10px] font-bold">
        <span>
          {labels.score}: {score}
        </span>
        <span>
          {labels.highScore}: {highScore}
        </span>
      </div>

      {/* Game Board */}
      <div className="relative mx-auto" style={{ width: GRID_SIZE * CELL_SIZE }}>
        <div
          className="border-4 border-black bg-white grid relative"
          style={{
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          }}
        >
          {/* Grid cells */}
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border border-gray-200" />
          ))}

          {/* Snake */}
          {snake.map((segment, idx) => (
            <div
              key={idx}
              className={`absolute ${idx === 0 ? 'bg-pastel-mint' : 'bg-pastel-blue'}`}
              style={{
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
                border: '1px solid black',
              }}
            />
          ))}

          {/* Food */}
          <div
            className="absolute bg-pastel-pink"
            style={{
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              border: '1px solid black',
            }}
          />

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white font-bold text-sm mb-2">{labels.gameOver}</p>
                <p className="text-pastel-yellow font-bold text-xs">
                  {labels.score}: {score}
                </p>
              </div>
            </div>
          )}

          {/* Paused Overlay */}
          {isPaused && !gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <p className="text-white font-bold text-[10px]">SPACE to start</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            disabled={gameOver}
            className="flex-1 px-3 py-2 bg-pastel-yellow border-2 border-black font-bold text-[9px] sm:text-[10px] hover:bg-opacity-80 disabled:opacity-50"
          >
            {isPaused ? '▶️ PLAY' : '⏸️ PAUSE'}
          </button>
          <button
            onClick={restartGame}
            className="flex-1 px-3 py-2 bg-pastel-purple border-2 border-black font-bold text-[9px] sm:text-[10px] text-white hover:bg-opacity-80"
          >
            {labels.restart}
          </button>
        </div>
        <p className="text-[8px] text-center text-gray-600 font-bold">
          Arrow keys / WASD to move, SPACE to pause
        </p>
      </div>
    </div>
  );
}

// Tic Tac Toe Game Component
function TicTacToeGame({ labels }: MiniGameProps) {
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
  }, [minimax]);

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
