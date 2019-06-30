import React from 'react'

function Menu({ actions }) {
	return (
		<div id="menu">
			<h1>Tetris</h1>
			<button onClick={ () => actions.launchGame() }>Play</button>
			<button onClick={ () => actions.launchOptions() }>Options</button>
		</div>
	)
}

export default Menu;