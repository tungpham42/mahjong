// src/hooks/useMahjong.ts
import { useState, useEffect, useCallback } from "react";
import { GameState, MahjongTile, Player } from "../types";
import { playTileClack } from "../audio";

// Helper to generate a standard 136-tile set (excluding flowers/seasons for simplicity)
const generateWall = (): MahjongTile[] => {
  const wall: MahjongTile[] = [];
  const suits: ("dots" | "bamboo" | "characters")[] = [
    "dots",
    "bamboo",
    "characters",
  ];
  const winds = ["N", "E", "S", "W"];
  const dragons = ["R", "G", "W"]; // Red, Green, White

  let idCounter = 0;

  // 4 copies of each tile
  for (let i = 0; i < 4; i++) {
    for (const suit of suits) {
      for (let v = 1; v <= 9; v++) {
        wall.push({ id: `t${idCounter++}`, type: suit, value: v });
      }
    }
    for (const w of winds) {
      wall.push({ id: `t${idCounter++}`, type: "winds", value: w });
    }
    for (const d of dragons) {
      wall.push({ id: `t${idCounter++}`, type: "dragons", value: d });
    }
  }

  // Shuffle (Fisher-Yates)
  for (let i = wall.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wall[i], wall[j]] = [wall[j], wall[i]];
  }
  return wall;
};

export const useMahjong = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);

  // Initialize Game
  useEffect(() => {
    const wall = generateWall();
    const players: Player[] = [
      {
        id: 0,
        name: "You",
        isHuman: true,
        hand: [],
        exposed: [],
        discards: [],
      },
      {
        id: 1,
        name: "AI 1",
        isHuman: false,
        hand: [],
        exposed: [],
        discards: [],
      },
      {
        id: 2,
        name: "AI 2",
        isHuman: false,
        hand: [],
        exposed: [],
        discards: [],
      },
      {
        id: 3,
        name: "AI 3",
        isHuman: false,
        hand: [],
        exposed: [],
        discards: [],
      },
    ];

    // Deal 13 tiles to each player
    for (let i = 0; i < 13; i++) {
      players.forEach((p) => p.hand.push(wall.pop()!));
    }

    // Player 0 (dealer) draws 14th tile
    players[0].hand.push(wall.pop()!);

    setGameState({
      wall,
      players,
      currentTurn: 0,
      tableDiscards: [],
    });
  }, []);

  const discardTile = useCallback((playerId: number, tileId: string) => {
    setGameState((prevState) => {
      if (!prevState) return prevState;
      if (prevState.currentTurn !== playerId) return prevState;

      const newState = { ...prevState, players: [...prevState.players] };
      const player = { ...newState.players[playerId] };

      const tileIndex = player.hand.findIndex((t) => t.id === tileId);
      if (tileIndex === -1) return prevState;

      const [discarded] = player.hand.splice(tileIndex, 1);
      newState.tableDiscards = [...newState.tableDiscards, discarded];

      // Play Sound
      playTileClack();

      // Next turn
      newState.currentTurn = (playerId + 1) % 4;

      // Next player draws a tile from the wall
      const nextPlayer = { ...newState.players[newState.currentTurn] };
      if (newState.wall.length > 0) {
        nextPlayer.hand.push(newState.wall.pop()!);
      }
      newState.players[playerId] = player;
      newState.players[newState.currentTurn] = nextPlayer;

      return newState;
    });
  }, []);

  // AI Logic Loop
  useEffect(() => {
    if (!gameState) return;

    const currentPlayer = gameState.players[gameState.currentTurn];

    // If it's an AI's turn
    if (!currentPlayer.isHuman) {
      const timer = setTimeout(() => {
        // Very basic AI: Discard a random tile from their hand
        const randomTile =
          currentPlayer.hand[
            Math.floor(Math.random() * currentPlayer.hand.length)
          ];
        discardTile(currentPlayer.id, randomTile.id);
      }, 1000); // 1 second delay for realism

      return () => clearTimeout(timer);
    }
  }, [gameState, discardTile]);

  return { gameState, discardTile };
};
