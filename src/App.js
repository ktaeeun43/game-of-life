import React, { useState, useRef, useCallback } from 'react'
import produce from 'immer'
import styled from 'styled-components';
import Grid from './Grid';

const TitleWrapper = styled.div`
display: flex;
justify-content: center;
`;

const Title = styled.div`
font-size: 30px;
font-weight: bold;
color: blue;
`;

const ButtonWrapper = styled.div`
display: flex;
justify-content: center;
`;

const Buttons = styled.button`
  font-weight: bold;
  text-align: center;
  font-size: 15px;
  padding: 2px 25px;
  border-radius: 5px;
  margin-right: 10px;
  padding-left: 40px;
  opacity: 1;
`;


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
  
  
  function handleCellClick(i,j) {
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

  function handleClearButton() {
    setGrid(generateEmptyGrid())
          setRunning(false);
          if(running) {
            runningRef.current = false
          }
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
    <>
    <TitleWrapper>
      <Title>
        라이프 게임
      </Title>
    </TitleWrapper>

      <ButtonWrapper>
        <Buttons 
          onClick={handleStartSimulation}> 
        {running ? "STOP" : "START"} 
        </Buttons>

        <Buttons onClick={handleClearButton}> 
          삭제
        </Buttons>

        <Buttons onClick={handleRandomizeGrid}>
          랜덤
        </Buttons>
      </ButtonWrapper>
      <div className="grid" style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 20px)`
        }}>
        {grid.map((rows, i) => 
          rows.map((col, j) => 
            <div className="node"
            key={`${i}-${j}`}
            onClick={() => handleCellClick(i,j)}
            style={{
              width: 20,
              height: 20,
              border: 'solid 1px grey',
              backgroundColor: grid[i][j] ? color : undefined
            }} 
            />
          ))}
      </div>
      </>
  );
}

export default App;