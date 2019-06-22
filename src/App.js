import React, { Component } from 'react'
import './App.css'
import Grid from './Grid'
import pieceCollection from './pieceCollection'

class App extends Component{

	state = {
		grid: null,
		gridHeight: 15,
		gridWidth: 8,
		piece: null,
		nbrCleanLine: 0,
		lvl:1
	}

	// preview next piece


	componentDidMount() { 
		this.initGame()

		let key_pressed = []
		let multiple_key_pressed = false

		window.addEventListener("keyup", (e) => {
			multiple_key_pressed = false
			let index = key_pressed.indexOf(e.keyCode)
			if (index !== -1) { 
				key_pressed.splice(index, 1)
			}
		})

		window.addEventListener("keydown", (e) => { 
		
			if(key_pressed.indexOf(e.keyCode) === -1){
				key_pressed.push(e.keyCode)
			}

			if (key_pressed.length > 1) {
				key_pressed.forEach(
					(keyCode, index) => {
						if ( multiple_key_pressed === false && index === 0) {
							multiple_key_pressed = true
						} else { 
							this.executeKeyCode(keyCode)
						}
					}
				)
			} else { 
				this.executeKeyCode(key_pressed[0])
			}

			//37 gauche
			//39 right
			//bas 40
		})

	}

	executeKeyCode = (keyCode) => {
		switch (keyCode) { 
			case 39: this.pieceMoveToXAxis(1)
				break
			case 37: this.pieceMoveToXAxis(-1)
				break
			case 40: this.pieceMoveToYAxis(1)
				break
			case 88: this.rotatePiece("right")
				break
			case 89: this.rotatePiece("left")
				break
			default: break
		}
	}

	initGame = () => {
		this.setState({ grid: this.buildGrid() }, () => {
			this.generatePiece()

			this.launchTimer()
		})
	}

	closeGame = () => {
		//mettre fin au jeu
		clearInterval(this.timer)
	}

	//TIMER FONCTION
	launchTimer = () => { 
		this.timer = setInterval(() => {
			this.pieceMoveToYAxis(1)
		}, this.convertLvlToTime())
	}

	convertLvlToTime = () => { 
		if (this.state.lvl === 1) {
			return 10000000
		} else if (this.state.lvl === 2) {
			return 10000000
		}
	}

	//GRID FUNCTIONS
	buildGrid = () => {

		let grid = []

		for (let y = 0; y < this.state.gridHeight; y++) {
			let line = []
			for (let x = 0; x < this.state.gridWidth; x++) {
				line.push(0);
			}
			grid.push(line)
		}

		return grid

	}

	mergePieceToGrid = () => {

		let lvl = this.state.lvl
		let lvlChanged = false
		const virtualGrid = this.state.grid
		let nbrCleanLine = this.state.nbrCleanLine

		this.state.piece.mergeData.forEach(element => {
			const [y, x] = element.split("_")
			virtualGrid[y][x] = this.state.piece.color
		});

		let { cleanGrid, nbrLineCompleted } = this.cleanGrid(virtualGrid)
		nbrCleanLine += nbrLineCompleted

		if (nbrCleanLine > 1) { 
			lvl = 2
			clearInterval(this.timer)
			lvlChanged = true
		}
		
		this.setState({ grid: cleanGrid, piece: null, nbrCleanLine:nbrCleanLine, lvl }, () => { 
			this.generatePiece()
			if (lvlChanged) { 
				this.launchTimer()
			}
		})
	}

	//PIECE FUNCTIONS
	generatePiece = () => {

		let piece = {}
		piece.posY = 0

		let indexPieceCollection = Math.floor( Math.random() * pieceCollection.length )
		piece.color = indexPieceCollection + 1 // +1 because 0 is empty cell

		piece.grid = pieceCollection[indexPieceCollection]
		//if value of 0,0 coordinate equal 0 offset y to -1 for init spawn
		if (piece.grid[0][0] === 0) { 
			piece.posY--
		}

		piece.posX = Math.floor( (this.state.gridWidth - piece.grid[0].length) / 2 )
		
		piece.mergeData = []
		let coordinate = this.pieceCanBeMove(piece)
		if (coordinate !== false) {
			piece.mergeData = coordinate
			this.setState({ piece })
		} else { 
			this.closeGame()
		}

	}

	pieceCanBeMove = (piece) => { 
		
		let coordinate = []

		for (let y = 0; y < piece.grid.length; y++) {
			for (let x = 0; x < piece.grid[0].length; x++) {
				if (piece.grid[y][x] > 0) { 

					if (this.state.grid[y + piece.posY] === undefined) { 
						return false // out of range Y
					}

					if (this.state.grid[y + piece.posY][x + piece.posX] === undefined) { 
						return false //out of range X
					}

					if (this.state.grid[y + piece.posY][x + piece.posX] > 0) { 
						return false
					}

					coordinate.push( (y + piece.posY) + "_" + (x + piece.posX) )
				}
			}
		}

		return coordinate

	}

	pieceMoveToXAxis = (deltaX) => { 
		
		let piece = { ...this.state.piece }

		if (piece === null) { 
			return false
		}

		piece.posX += deltaX

		let coordinate = this.pieceCanBeMove(piece)
		if (coordinate !== false) { 
			piece.mergeData = coordinate
			this.setState({piece})
		}

	}


	pieceMoveToYAxis = (deltaY) => { 
		
		let piece = { ...this.state.piece }

		if (piece === null) { 
			return false
		}

		piece.posY += deltaY

		let coordinate = this.pieceCanBeMove(piece)
		if (coordinate !== false) {
			piece.mergeData = coordinate
			this.setState({ piece })
		} else { 
			this.mergePieceToGrid()
		}

	}

	rotatePiece = (sense) => {

		let piece = { ...this.state.piece }

		if (piece === null) { 
			return false
		}

		let newGrid = []

		if (sense === "right") {
			for (let x = 0; x < piece.grid[0].length; x++) {
				let line = []
				for (let y = piece.grid.length - 1; y > -1; y--) {
					line.push(piece.grid[y][x]);
				}
				newGrid.push(line)
			}
		} else if ( sense === "left") { 
			for (let x = piece.grid[0].length - 1; x > -1; x--) {
				let line = []
				for (let y = 0; y < piece.grid.length; y++) {
					line.push( piece.grid[y][x] );
				}
				newGrid.push( line )
			}
		}

		piece.grid = newGrid

		let coordinate = this.pieceCanBeMove(piece)
		if (coordinate !== false) {
			piece.mergeData = coordinate
			this.setState({ piece })
		} else { 

			let isPositionUpdate = false

			//if x is out of range
			if (piece.posX < 0) {
				piece.posX = 0
				isPositionUpdate = true
			} else if (piece.grid[0].length + piece.posX  > this.state.gridWidth) {
				piece.posX = this.state.gridWidth - piece.grid[0].length
				isPositionUpdate = true
			} else if (piece.posY < 0) {
				console.log(piece.posY)
				piece.posY = 0
				isPositionUpdate = true
			}

			if (isPositionUpdate) { 
				coordinate = this.pieceCanBeMove(piece)
				if (coordinate !== false) {
					piece.mergeData = coordinate
					this.setState({ piece })
				}
			}
		}
	}

	cleanGrid = (grid) => {

		let cleanGrid = []
		let nbrLineCompleted = 0

		for (let y = 0; y < this.state.gridHeight; y++) {

			let lineCompleted = true
			for (let x = 0; x < this.state.gridWidth; x++) {
				if (grid[y][x] === 0) { 
					lineCompleted = false
				}
			}

			if (lineCompleted === false) {
				cleanGrid.push(grid[y])
			}

		}

		nbrLineCompleted = this.state.gridHeight - cleanGrid.length

		for (let i = 0; i < nbrLineCompleted; i++) { 
			cleanGrid.unshift( this.makeCleanLine(this.state.gridWidth) )
		}

		console.log(cleanGrid)

		return { cleanGrid, nbrLineCompleted}

	}

	makeCleanLine(width) { 
		let line = []
		for (let x = 0; x < width; x++) {
			line.push(0)
		}
		return line
	}

	render() { 
		return (
			<div id="wrapper_tetris">
				<h1>Tetris</h1>
				<p className="score">{this.state.nbrCleanLine}</p>
				<p className="lvl">Lvl {this.state.lvl}</p>
				{
					this.state.grid !== null &&
						<Grid
							grid={this.state.grid}
							piece={this.state.piece}
						/>
				}
			</div>
		)
	}

}

export default App;
