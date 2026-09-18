// src/types.ts

export type Suit = "dots" | "bamboo" | "characters";
export type Honor = "winds" | "dragons";

export interface MahjongTile {
  id: string; // Unique ID for React keys
  type: Suit | Honor;
  value: number | string; // 1-9 for suits, N/E/S/W for winds, R/G/W for dragons
}

export interface Player {
  id: number;
  name: string;
  isHuman: boolean;
  hand: MahjongTile[];
  exposed: MahjongTile[][]; // Claimed sets (Pung, Chow, Kong)
  discards: MahjongTile[];
}

export interface GameState {
  wall: MahjongTile[];
  players: Player[];
  currentTurn: number; // 0 to 3
  tableDiscards: MahjongTile[];
}
