/** @format */

import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
} from "../component/board/config/BoardConfig";

class BotBrain {
  constructor() {
    // Fine-tuned competitive weights
    this.weights = {
      lines: 0.85,
      holes: -0.95,
      aggregateHeight: -0.55,
      bumpiness: -0.22,
      maxHeight: -0.4,
      wells: -0.3, // Penalize deep, unmanaged wells
    };
  }

  cloneBoard(board) {
    return board.map((row) => [...row]);
  }

  getCells(piece, x, y) {
    const shape = piece.shape;
    const cells = [];

    for (let py = 0; py < shape.length; py++) {
      for (let px = 0; px < shape[py].length; px++) {
        if (!shape[py][px]) continue;
        cells.push({ x: x + px, y: y + py });
      }
    }
    return cells;
  }

  collides(board, piece, x, y) {
    const cells = this.getCells(piece, x, y);
    for (const cell of cells) {
      if (cell.x < 0 || cell.x >= BOARD_WIDTH || cell.y >= BOARD_HEIGHT) {
        return true;
      }
      if (cell.y >= 0 && board[cell.y]?.[cell.x]) {
        return true;
      }
    }
    return false;
  }

  getDropY(board, piece, x) {
    let y = -1;
    while (!this.collides(board, piece, x, y + 1)) {
      y++;
    }
    return y;
  }

  placePiece(board, piece, x, y) {
    const nextBoard = this.cloneBoard(board);
    const cells = this.getCells(piece, x, y);

    for (const cell of cells) {
      if (
        cell.y >= 0 &&
        cell.y < BOARD_HEIGHT &&
        cell.x >= 0 &&
        cell.x < BOARD_WIDTH
      ) {
        nextBoard[cell.y][cell.x] = piece.type;
      }
    }
    return nextBoard;
  }

  clearLines(board) {
    const remaining = board.filter((row) => row.some((cell) => !cell));
    const cleared = BOARD_HEIGHT - remaining.length;

    while (remaining.length < BOARD_HEIGHT) {
      remaining.unshift(Array(BOARD_WIDTH).fill(null));
    }

    return { board: remaining, lines: cleared };
  }

  getColumnHeights(board) {
    const heights = [];
    for (let x = 0; x < BOARD_WIDTH; x++) {
      let height = 0;
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        if (board[y][x]) {
          height = BOARD_HEIGHT - y;
          break;
        }
      }
      heights.push(height);
    }
    return heights;
  }

  getHoles(board) {
    let holes = 0;
    for (let x = 0; x < BOARD_WIDTH; x++) {
      let blockFound = false;
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        if (board[y][x]) {
          blockFound = true;
          continue;
        }
        if (blockFound) holes++;
      }
    }
    return holes;
  }

  getBumpiness(heights) {
    let bumpiness = 0;
    for (let i = 0; i < heights.length - 1; i++) {
      bumpiness += Math.abs(heights[i] - heights[i + 1]);
    }
    return bumpiness;
  }

  // Advanced metric: sum of well depths to discourage chaotic stacking
  getWells(heights) {
    let wells = 0;
    for (let i = 0; i < heights.length; i++) {
      const left = i === 0 ? Infinity : heights[i - 1];
      const right = i === heights.length - 1 ? Infinity : heights[i + 1];
      const current = heights[i];
      const depth = Math.min(left, right) - current;
      if (depth > 0) {
        wells += depth;
      }
    }
    return wells;
  }

  evaluate(board, lines) {
    const heights = this.getColumnHeights(board);
    const aggregateHeight = heights.reduce((sum, h) => sum + h, 0);
    const maxHeight = Math.max(...heights);
    const holes = this.getHoles(board);
    const bumpiness = this.getBumpiness(heights);
    const wells = this.getWells(heights);

    return (
      lines * this.weights.lines +
      holes * this.weights.holes +
      aggregateHeight * this.weights.aggregateHeight +
      bumpiness * this.weights.bumpiness +
      maxHeight * this.weights.maxHeight +
      wells * this.weights.wells
    );
  }

  getRotatedPiece(piece, rotation) {
    let result = piece.shape.map((row) => [...row]);
    for (let i = 0; i < rotation; i++) {
      const height = result.length;
      const width = result[0].length;
      const rotated = Array.from({ length: width }, () =>
        Array(height).fill(0),
      );

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          rotated[x][height - 1 - y] = result[y][x];
        }
      }
      result = rotated;
    }
    return { ...piece, shape: result };
  }

  getPossibleMoves(board, piece) {
    const moves = [];
    for (let rotation = 0; rotation < 4; rotation++) {
      const rotatedPiece = this.getRotatedPiece(piece, rotation);
      const width = rotatedPiece.shape[0].length;

      for (let x = 0; x <= BOARD_WIDTH - width; x++) {
        const y = this.getDropY(board, rotatedPiece, x);
        if (this.collides(board, rotatedPiece, x, y)) continue;

        const placed = this.placePiece(board, rotatedPiece, x, y);
        const result = this.clearLines(placed);
        const score = this.evaluate(result.board, result.lines);

        moves.push({
          x,
          y,
          rotation,
          score,
          lines: result.lines,
          resultingBoard: result.board,
        });
      }
    }
    return moves;
  }

  /**
   * Pro feature: 2-Piece Lookahead Search
   * Evaluates the current piece AND simulates the best response for the next piece.
   */
  chooseBestMove(board, currentPiece, nextPiece = null) {
    const currentMoves = this.getPossibleMoves(board, currentPiece);
    if (!currentMoves.length) return null;

    if (!nextPiece) {
      // Fallback to 1-ply if no next piece is provided
      currentMoves.sort((a, b) => b.score - a.score);
      return currentMoves[0];
    }

    let bestOverallMove = null;
    let maxOverallScore = -Infinity;

    for (const move of currentMoves) {
      // Simulate next piece moves on the resulting board
      const nextMoves = this.getPossibleMoves(move.resultingBoard, nextPiece);

      let bestNextScore = 0;
      if (nextMoves.length > 0) {
        nextMoves.sort((a, b) => b.score - a.score);
        bestNextScore = nextMoves[0].score;
      } else {
        // If next piece results in game over / no moves, heavily penalize this branch
        bestNextScore = -10000;
      }

      // Combine current move score with weighted future score (Lookahead weight: 0.6)
      const combinedScore = move.score + bestNextScore * 0.6;

      if (combinedScore > maxOverallScore) {
        maxOverallScore = combinedScore;
        bestOverallMove = { ...move, score: combinedScore };
      }
    }

    return bestOverallMove;
  }
}

export default BotBrain;
