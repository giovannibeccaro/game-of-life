import React, { useState, useEffect, useCallback } from "react";

const Index = () => {
  const nCols = 50;
  const nRows = 50;
  const [grid, setGrid] = useState<number[][]>(() => populateGrid(false));
  const [isGameOn, setIsGameOn] = useState<boolean>(false);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);
  const [animation, setAnimation] = useState<boolean>(true);
  const [borderVisibility, setBorderVisibility] = useState<boolean>(true);
  const [isSpaceBig, setIsSpaceBig] = useState<boolean>(true);
  const [cellsRateo, setCellsRateo] = useState<number>(2); // 1 for no cells, 2 for 50/50, 1.5: 75/25, 2.5: 25/75
  const [color, setColor] = useState<string>("rgb(24, 67, 124)");

  // thene colors
  const colors = [
    "rgb(24, 67, 124)",
    "rgb(29, 124, 24)",
    "rgb(124, 31, 24)",
    "rgb(106, 24, 124)",
    "rgb(124, 111, 24)",
  ];

  function handleStart() {
    setGrid(populateGrid(true)); // populates grid with 0 and 1
    setIsGameStarted(true); // states that the game has started
    setIsGameOn(true); // states that the game is running
    generateNext(); // calls next generation of cells
  }

  function populateGrid(isRandom: boolean) {
    let grid: number[][] = [];
    for (let i = 0; i < nCols; i++) {
      grid[i] = []; // create empty arr for every row to be filled with with cols in the next for loop
      for (let j = 0; j < nRows; j++) {
        grid[i][j] = isRandom ? Math.floor(Math.random() * cellsRateo) : 0; // this populates aforementioned array with 0 or 1
      }
    }
    return grid;
  }

  const generateNext = useCallback(() => {
    if (!isGameOn) return;

    // direction that we check for each cell
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [1, 1],
      [1, -1],
      [-1, 0],
      [-1, 1],
      [-1, -1],
    ];

    //? this current generation check --> new generation
    setGrid((prevGrid) => {
      return prevGrid.map((row, i) => {
        return row.map((_, j) => {
          let surroundingCells = 0; // this will keep track of the alive cells next to the cell we are checking
          directions.forEach((direction) => {
            const x = i + direction[0];
            const y = j + direction[1];
            // check if we are within the margins of our grid
            if (x >= 0 && x < nRows && y >= 0 && y < nCols) {
              surroundingCells += prevGrid[x][y];
            }
          });
          if (surroundingCells < 2 || surroundingCells > 3) {
            return 0;
          }
          if (prevGrid[i][j] === 0 && surroundingCells === 3) {
            return 1;
          }
          return prevGrid[i][j];
        });
      });
    });
  }, [isGameOn]);

  // calls generate next every X milliseconds
  useEffect(() => {
    const interval = setInterval(generateNext, speed);

    return () => {
      clearInterval(interval);
    };
  }, [grid, generateNext]);

  //useEffect for animation speed
  useEffect(() => {
    function handleAnimation() {
      document.documentElement.style.setProperty(
        "--transition-duration",
        animation ? speed + "ms" : "0"
      );
    }
    handleAnimation();
  }, [speed, animation]);

  // useEffect for cellColor
  useEffect(() => {
    function handleAnimation() {
      document.documentElement.style.setProperty("--color", color);
    }
    handleAnimation();
  }, [color]);

  return (
    <>
      <div className="btn-section">
        <button onClick={handleStart} className="start-btn">
          NUOVA GENERAZIONE
        </button>
        <button
          disabled={!isGameStarted}
          onClick={() => setIsGameOn(!isGameOn)}
          className="resume-btn"
        >
          {isGameOn ? "PAUSA" : "RIPRENDI"}
        </button>
        <button
          disabled={speed === 100}
          onClick={() => {
            setSpeed((prev) => (prev -= 100));
          }}
          className="speed-btn plus"
        >
          +
        </button>
        <button
          disabled={speed === 1500}
          onClick={() => {
            setSpeed((prev) => (prev += 100));
          }}
          className="speed-btn minus"
        >
          -
        </button>
        <button
          disabled={speed === 1500}
          onClick={() => setAnimation(!animation)}
          className="animation-btn"
        >
          ANIMAZIONI: {animation ? "ON" : "OFF"}
        </button>
        <div className="space-between-cells-section">
          <p>Spazio tra le celle</p>
          <select
            defaultValue="big"
            name="space-between-cells"
            id=""
            onChange={() => setIsSpaceBig(!isSpaceBig)}
          >
            <option value="small">Piccolo</option>
            <option value="big">Grande</option>
          </select>
        </div>
        <div className="border-section">
          <p>Bordo</p>
          <select
            defaultValue="visible"
            name="border"
            id=""
            onChange={() => setBorderVisibility(!borderVisibility)}
          >
            <option value="visible">Visibile</option>
            <option value="invisible">Invisibile</option>
          </select>
        </div>
        <div className="rateo-section">
          <p>Rapporto celle iniziale</p>
          <select
            defaultValue="2"
            name="cellRateo"
            id=""
            onChange={(e) => setCellsRateo(Number(e.target.value))}
          >
            <option value="1.5">Vive: 25% | Morte: 75%</option>
            <option value="2">Vive: 50% | Morte: 50%</option>
            <option value="2.5">Vive: 75% | Morte: 25%</option>
          </select>
        </div>
        <div className="themes-section">
          <p>Colori</p>
          <section className="colors">
            {colors.map((color, i) => (
              <div
                key={i}
                onClick={() => setColor(color)}
                style={{
                  backgroundColor: color,
                  width: "20px",
                  height: "20px",
                }}
              />
            ))}
          </section>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${nCols}, ${
            isSpaceBig ? "22px" : "19px"
          })`,
          gridTemplateRows: `repeat(${nRows}, ${isSpaceBig ? "22px" : "19px"})`,
        }}
        className="grid"
      >
        {grid.map((row, i) => {
          return row.map((_, j) => {
            return (
              <div
                className={`square ${grid[i][j] ? "active" : "non-active"}`}
                style={{
                  border: `${borderVisibility ? "1px solid black" : "none"}`,
                }}
                key={`${i}|${j}`}
              >
                <div className="square-color" />
              </div>
            );
          });
        })}
      </div>
    </>
  );
};

export default Index;
