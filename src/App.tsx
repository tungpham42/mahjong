// src/App.tsx
import React from "react";
import { useMahjong } from "./hooks/useMahjong";
import { Tile } from "./components/Tile";
import "./App.css";

function App() {
  const { gameState, discardTile } = useMahjong();

  if (!gameState) return <div>Shuffling Wall...</div>;

  const humanPlayer = gameState.players[0];

  return (
    <div
      style={{
        backgroundColor: "#2b5329",
        minHeight: "100vh",
        color: "white",
        fontFamily: "sans-serif",
        padding: "20px",
      }}
    >
      <h1 style={{ textAlign: "center" }}>React SVG Mahjong</h1>

      {/* Header Info */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <p>Wall remaining: {gameState.wall.length}</p>
        <p>Current Turn: {gameState.players[gameState.currentTurn].name}</p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "40px",
        }}
      >
        {/* Top AI (Player 2) */}
        <div>
          <h3>{gameState.players[2].name}</h3>
          <div style={{ display: "flex" }}>
            {gameState.players[2].hand.map((tile) => (
              <Tile key={tile.id} tile={tile} isHidden={true} />
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "1000px",
          }}
        >
          {/* Left AI (Player 3) */}
          <div style={{ transform: "rotate(90deg)" }}>
            <h3>{gameState.players[3].name}</h3>
            <div style={{ display: "flex" }}>
              {gameState.players[3].hand.map((tile) => (
                <Tile key={tile.id} tile={tile} isHidden={true} />
              ))}
            </div>
          </div>

          {/* Center Table (Discards) */}
          <div
            style={{
              width: "400px",
              height: "250px",
              border: "2px solid rgba(255,255,255,0.2)",
              display: "flex",
              flexWrap: "wrap",
              alignContent: "flex-start",
              padding: "10px",
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: "10px",
            }}
          >
            {gameState.tableDiscards.map((tile, i) => (
              <div key={i} style={{ transform: "scale(0.8)", margin: "-4px" }}>
                <Tile tile={tile} />
              </div>
            ))}
          </div>

          {/* Right AI (Player 1) */}
          <div style={{ transform: "rotate(-90deg)" }}>
            <h3>{gameState.players[1].name}</h3>
            <div style={{ display: "flex" }}>
              {gameState.players[1].hand.map((tile) => (
                <Tile key={tile.id} tile={tile} isHidden={true} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Human (Player 0) */}
        <div
          style={{
            border: gameState.currentTurn === 0 ? "2px solid yellow" : "none",
            padding: "10px",
          }}
        >
          <h3>{humanPlayer.name} (You)</h3>
          <div style={{ display: "flex" }}>
            {humanPlayer.hand.map((tile) => (
              <Tile
                key={tile.id}
                tile={tile}
                onClick={(t) => discardTile(humanPlayer.id, t.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
