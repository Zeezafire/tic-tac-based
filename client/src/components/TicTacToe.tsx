import { useState } from "react";
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
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const checkWinner = (board: Board): WinningLine | null => {
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { indices: combo };
      }
    }
    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const winResult = checkWinner(newBoard);
    if (winResult) {
      setWinner(currentPlayer);
      setWinningLine(winResult.indices);
      setScores((prev) => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer] + 1,
      }));
    } else if (newBoard.every((cell) => cell !== null)) {
      setWinner("Draw");
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setWinningLine(null);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0 });
    resetGame();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-title">
            Tic-Tac-Toe
          </h1>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Card className="flex-1 p-3 text-center">
            <div className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Player X
            </div>
            <div className="text-2xl font-bold" data-testid="text-score-x">
              {scores.X}
            </div>
          </Card>
          <Card className="flex-1 p-3 text-center">
            <div className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Player O
            </div>
            <div className="text-2xl font-bold" data-testid="text-score-o">
              {scores.O}
            </div>
          </Card>
        </div>

        <Card className="p-6 md:p-8 shadow-xl">
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={!!cell || !!winner}
                data-testid={`button-cell-${index}`}
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
                      ? "bg-primary/10 border-primary scale-105 shadow-lg"
                      : "border-border bg-card"
                  }
                  ${cell === "X" ? "text-primary" : ""}
                  ${cell === "O" ? "text-destructive" : ""}
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
              <span className="text-muted-foreground">It's a Draw!</span>
            ) : winner ? (
              <span className="text-primary">Player {winner} Wins!</span>
            ) : (
              <span>Player {currentPlayer}'s Turn</span>
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
