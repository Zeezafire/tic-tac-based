import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";

type Player = "X" | "O";
type CellValue = Player | null;
type Board = CellValue[];

interface WinningLine {
  indices: number[];
}

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | "Draw" | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [scores, setScores] = useState({ player: 0, computer: 0 });
  const [isComputerThinking, setIsComputerThinking] = useState(false);

  const PLAYER = "X";
  const COMPUTER = "O";

  const checkWinner = (board: Board): WinningLine | null => {
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { indices: combo };
      }
    }
    return null;
  };

  const minimax = (board: Board, depth: number, isMaximizing: boolean): number => {
    const winResult = checkWinner(board);
    
    if (winResult) {
      const winnerPlayer = board[winResult.indices[0]];
      return winnerPlayer === COMPUTER ? 10 - depth : depth - 10;
    }
    
    if (board.every((cell) => cell !== null)) {
      return 0;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = COMPUTER;
          const score = minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = PLAYER;
          const score = minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const getBestMove = (board: Board): number => {
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = COMPUTER;
        const score = minimax(board, 0, false);
        board[i] = null;
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  };

  const makeComputerMove = (currentBoard: Board) => {
    setIsComputerThinking(true);
    
    setTimeout(() => {
      let move: number;
      
      // 40% chance to make a random move (easier difficulty)
      if (Math.random() < 0.4) {
        const availableMoves = currentBoard
          .map((cell, index) => (cell === null ? index : -1))
          .filter((index) => index !== -1);
        move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      } else {
        move = getBestMove([...currentBoard]);
      }
      
      if (move !== -1 && move !== undefined) {
        const newBoard = [...currentBoard];
        newBoard[move] = COMPUTER;
        setBoard(newBoard);

        const winResult = checkWinner(newBoard);
        if (winResult) {
          setWinner(COMPUTER);
          setWinningLine(winResult.indices);
          setScores((prev) => ({
            ...prev,
            computer: prev.computer + 1,
          }));
        } else if (newBoard.every((cell) => cell !== null)) {
          setWinner("Draw");
        } else {
          setCurrentPlayer(PLAYER);
        }
      }
      
      setIsComputerThinking(false);
    }, 500);
  };

  useEffect(() => {
    if (currentPlayer === COMPUTER && !winner && !isComputerThinking) {
      makeComputerMove(board);
    }
  }, [currentPlayer, winner]);

  const handleCellClick = (index: number) => {
    if (board[index] || winner || currentPlayer !== PLAYER || isComputerThinking) return;

    const newBoard = [...board];
    newBoard[index] = PLAYER;
    setBoard(newBoard);

    const winResult = checkWinner(newBoard);
    if (winResult) {
      setWinner(PLAYER);
      setWinningLine(winResult.indices);
      setScores((prev) => ({
        ...prev,
        player: prev.player + 1,
      }));
    } else if (newBoard.every((cell) => cell !== null)) {
      setWinner("Draw");
    } else {
      setCurrentPlayer(COMPUTER);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(PLAYER);
    setWinner(null);
    setWinningLine(null);
    setIsComputerThinking(false);
  };

  const resetScores = () => {
    setScores({ player: 0, computer: 0 });
    resetGame();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-title">
            Tic-Tac-Toe
          </h1>
          <p className="text-muted-foreground">Play against the Computer</p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Card className="flex-1 p-3 text-center">
            <div className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              You (X)
            </div>
            <div className="text-2xl font-bold" data-testid="text-score-player">
              {scores.player}
            </div>
          </Card>
          <Card className="flex-1 p-3 text-center">
            <div className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Computer (O)
            </div>
            <div className="text-2xl font-bold" data-testid="text-score-computer">
              {scores.computer}
            </div>
          </Card>
        </div>

        <Card className="p-6 md:p-8 border-2 border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={!!cell || !!winner}
                data-testid={`button-cell-${index}`}
                style={
                  cell === "X"
                    ? { textShadow: "0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.5)" }
                    : cell === "O"
                    ? { textShadow: "0 0 20px rgba(96, 165, 250, 0.8), 0 0 40px rgba(96, 165, 250, 0.5)" }
                    : {}
                }
                className={`
                  aspect-square rounded-xl border-2 
                  flex items-center justify-center
                  text-5xl md:text-6xl font-bold
                  transition-all duration-200
                  select-none
                  ${
                    cell
                      ? "cursor-default"
                      : winner
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover-elevate active-elevate-2"
                  }
                  ${
                    winningLine?.includes(index)
                      ? "bg-primary/20 border-primary scale-105 shadow-lg"
                      : "border-white/30 bg-white/5"
                  }
                  ${cell === "X" ? "text-white" : ""}
                  ${cell === "O" ? "text-blue-400" : ""}
                `}
              >
                {cell && (
                  <span className="animate-in fade-in zoom-in duration-200">
                    {cell}
                  </span>
                )}
              </button>
            ))}
          </div>
        </Card>

        <div className="text-center space-y-4">
          <div
            className="text-xl md:text-2xl font-semibold min-h-[2rem]"
            data-testid="text-status"
          >
            {winner === "Draw" ? (
              <span className="text-muted-foreground">Based minds think alike</span>
            ) : winner === PLAYER ? (
              <span className="text-primary">🏆 You are based!</span>
            ) : winner === COMPUTER ? (
              <span className="text-destructive">💀 You are not based enough!</span>
            ) : isComputerThinking ? (
              <span className="text-muted-foreground">Computer is thinking...</span>
            ) : currentPlayer === PLAYER ? (
              <span>Your Turn</span>
            ) : (
              <span className="text-muted-foreground">Computer's Turn</span>
            )}
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              onClick={resetGame}
              variant="default"
              className="px-8"
              data-testid="button-reset"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Game
            </Button>
            <Button
              onClick={resetScores}
              variant="outline"
              data-testid="button-reset-scores"
            >
              Reset Scores
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
