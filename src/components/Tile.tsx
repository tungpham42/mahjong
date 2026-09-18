// src/components/Tile.tsx
import React from "react";
import { MahjongTile } from "../types";

interface TileProps {
  tile: MahjongTile;
  onClick?: (tile: MahjongTile) => void;
  isHidden?: boolean;
}

export const Tile: React.FC<TileProps> = ({ tile, onClick, isHidden }) => {
  const getSymbol = () => {
    if (tile.type === "dots") return `⚪ ${tile.value}`;
    if (tile.type === "bamboo") return `🎋 ${tile.value}`;
    if (tile.type === "characters") return `萬 ${tile.value}`;
    if (tile.type === "winds") return `💨 ${tile.value}`;
    if (tile.type === "dragons") return `🐉 ${tile.value}`;
    return tile.value;
  };

  return (
    <svg
      width="40"
      height="60"
      viewBox="0 0 40 60"
      style={{
        cursor: onClick && !isHidden ? "pointer" : "default",
        margin: "2px",
        boxShadow: "2px 2px 5px rgba(0,0,0,0.3)",
        borderRadius: "4px",
      }}
      onClick={() => onClick && !isHidden && onClick(tile)}
    >
      {/* Tile Base */}
      <rect
        x="0"
        y="0"
        width="40"
        height="60"
        rx="4"
        fill="#fcf6e3"
        stroke="#ccc"
        strokeWidth="1"
      />
      <rect x="0" y="55" width="40" height="5" fill="#a4d1a2" />{" "}
      {/* Green back indicator */}
      {/* Tile Face */}
      {!isHidden && (
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="14"
          fill={tile.type === "characters" ? "red" : "black"}
          fontWeight="bold"
        >
          {getSymbol()}
        </text>
      )}
    </svg>
  );
};
