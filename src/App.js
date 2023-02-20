import React, { useState, useRef, useCallback } from 'react'
import produce from 'immer'

import './App.css';

const numRows = 70;
const numCols = 70;
const delay = 100


const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
]

function generateEmptyGrid() {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0))
  }
  return rows
}

function App() {
  const [running, setRunning] = useState(false)
  const [color, setColor] = useState("#111")
  let [counter, setCounter] = useState(0)
  const [deathMode, setDeathMode] = useState(false)
  

  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid()
  })

  const runningRef = useRef(running)
  runningRef.current = running

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

      setGrid(g => {
        return produce(g, gridCopy => {
           
          for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
              let neighbors = 0;

              
              operations.forEach(([x, y]) => {
                const newI = i + x
                const newKJ= j + y
                
                if (newI >= 0 && newI < numRows && newKJ >= 0 && newKJ < numCols) {
                  neighbors += g[newI][newKJ]
                }
              })

              
              
              if (neighbors < 2 || neighbors > 3) {
                gridCopy[i][j] = 0;
              }
              
              else if (g[i][j] === 0 && neighbors === 3) {
                gridCopy[i][j] = 1;
              }
              
            
            }
          }
        })
      }) 
    setTimeout(runSimulation, delay)
  }, [])

  function handleStartSimulation() {
    setRunning(!running);
    if(!running) {
      runningRef.current = true
      runSimulation()
    }
  }
  
  
  function handleNodeClick(i,j) {
    const newGrid = produce(grid, gridCopy => {
    gridCopy[i][j] = !grid[i][j] })
    setGrid(newGrid) 
  }

  
  function handleRandomizeGrid() {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => Math.random() > 0.6 ? 1 : 0))
    }
    setGrid(rows)
  }

  
  function handleDeathMode() {
      if (counter < 4) {
        setCounter(counter + 1) 
        setDeathMode(false)
      }
      else if (counter === 4){
        setDeathMode(true)
        handleRandomizeGrid()
        handleStartSimulation()
        setColor("#EE3633")
        setCounter(-1) 
      }
  }

  
  return (
    <div className="page">
      <div className="title" 
        onClick={() => handleDeathMode()}
        style={{
          color: "#1860B6"
      }}>
        <h1>
          라이프게임
        </h1>
      </div>

      <div className="btns">
        <a  className="startBtn" 
          style={{
            backgroundColor: "#1860B6",
            color: "#fff"
          }} 
          onClick={handleStartSimulation}> 
        {running ? "STOP" : "START"} 
        </a>

        <a  className="clearBtn" onClick={() => {
          setGrid(generateEmptyGrid())
          setRunning(false);
          if(running) {
            runningRef.current = false
          }
        }}> 
          삭제
        </a>

        <a  className="randomizeBtn" onClick={handleRandomizeGrid}>
          랜덤
        </a>
        
      </div>
    

      <div className="grid" style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 20px)`
        }}>
        {grid.map((rows, i) => 
          rows.map((col, j) => 
            <div className="node"
            key={`${i}-${j}`}
            onClick={() => handleNodeClick(i,j)}
            style={{
              width: 20,
              height: 20,
              border: 'solid 1px grey',
              backgroundColor: grid[i][j] ? color : undefined
            }} 
            />
          ))}
      </div>
    </div>
  );
}

export default App;