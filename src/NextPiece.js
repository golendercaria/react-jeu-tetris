import React from 'react'

function NextPiece({ grid, color }) {
	
	return (
		<div id="wrapper_next_piece">
			<span className="title">NEXT PIECE</span>
			<div id="next_piece" className="grid">
				{
					grid.map(
						(line, y) => { 
							return line.map(
								(col, x) => { 

									let classes = []

									if (x === 0) { 
										classes.push("first")
									}

									if (grid[y][x] > 0) { 
										classes.push("color-" + color)
									}

									return <span key={x + "_" + y} className={classes.join(" ")}></span>
								}
							)
						}
					)
				}
			</div>
		</div>
	)
}

export default NextPiece;