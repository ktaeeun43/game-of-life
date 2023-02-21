import React from 'react';
import styled from 'styled-components';
import "./App.js";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: ${({ numCols }) => `repeat(${numCols}, 20px)`};
`;

const Cell = styled.div`
  width: 20px;
  height: 20px;
  border: solid 1px grey;
  background-color: ${({ isColored, color }) => isColored ? color : 'transparent'};
`;

function Grid({ grid, numCols, handleCellClick, color }) {
  return (
    <>
      <GridContainer numCols={numCols}>
        {grid.map((rows, i) => 
          rows.map((col, j) => (
            <Cell
              key={`${i}-${j}`}
              onClick={() => handleCellClick(i, j)}
              isColored={grid[i][j]}
              color={color}
            />
          ))
        )}
      </GridContainer>
    </>
  );
}

export default Grid;