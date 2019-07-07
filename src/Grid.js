import React from 'react'

function Grid({ grid, piece, projection }) {

	grid = colorizedEmptyCellule(grid)

	let projectionCoordinate = []
	if (piece && projection ) { 
		projectionCoordinate = getProjectionCoordinate(grid, piece)
	}

	return (
		<div id="grid" className="grid">
			{
				grid.map(
				  	(line, y) => { 
						return line.map(
							(col, x) => { 

								let classes = []

								if (x === 0) { 
									classes.push("first")
								}
								if (piece !== null) {
									if (piece.mergeData.indexOf(y + "_" + x) !== -1) {
										classes.push("color-" + piece.color)
									}
								}

								if (grid[y][x] < 0) {
									classes.push("colorizedEmptyCellule" + grid[y][x])
									grid[y][x] = 0
								} 


								if (projectionCoordinate.indexOf(y + "_" + x) !== -1) {
									classes.push("projection")
								}

								if (grid[y][x] > 0) { 
									classes.push("color-" + grid[y][x])
								}

								return <span key={x + "_" + y} className={classes.join(" ")}></span>
							}
						)
					}
				)
			}
		</div>
	)
}

function colorizedEmptyCellule(grid) { 

	let colorLine = grid[ grid.length - 1 ]

	for (let y = grid.length - 2; y > -1; y--) {
		for (let x = 0; x < grid[0].length; x++) {

			if (grid[y][x] <= 0 && colorLine[x] !== 0) {
				grid[y][x] = Math.abs(colorLine[x]) * -1
			}

		}
		colorLine = grid[y]
	}
	
	return grid
}

function getProjectionCoordinate(grid, piece) { 
	
	let previousCordinate = []
	let coordinate = []

	for (let virtualY = piece.posY; virtualY < grid.length; virtualY++) { 

		previousCordinate = coordinate
		coordinate = []

		for (let y = 0; y < piece.grid.length; y++) {
			for (let x = 0; x < piece.grid[0].length; x++) {
				if (piece.grid[y][x] > 0) { 

					if (grid[y + virtualY] === undefined) { 
						return previousCordinate
					}

					if (grid[y + virtualY][x + piece.posX] > 0) { 
						return previousCordinate
					}

					coordinate.push( (y + virtualY) + "_" + (x + piece.posX) )
				}
			}
		}

	}

	return coordinate


	/*
	let coordinate = []

	for (let y = 0; y < piece.grid.length; y++) {
		for (let x = 0; x < piece.grid[0].length; x++) {
			if (piece.grid[y][x] > 0) { 

				if (virtualY <= 0) { 
					return false
				}

				if (grid[y + virtualY] === undefined) { 
					virtualY--
					return getProjectionCoordinate(grid, piece, virtualY)
				}

				if (grid[y + virtualY][x + piece.posX] > 0) { 
					virtualY--
					return getProjectionCoordinate(grid, piece, virtualY)
					//piece exist deja
					//recusif y--
				}

				coordinate.push( (y + virtualY) + "_" + (x + piece.posX) )
			}
		}
	}

	return coordinate*/

}


export default Grid;