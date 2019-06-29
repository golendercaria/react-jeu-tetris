import React, { Component } from 'react'
import './App.css'
import Menu from './Menu'
import Game from './Game'
import Options from './Options'

class App extends Component{

	state = {
		componentToLoaded: null,
		actions: null
	}

	componentDidMount() { 
		this.launchMenu()
	}

	launchGame = () => {
		this.setState({
			componentToLoaded: Game,
			actions: {
				launchMenu: () => this.launchMenu()
			}
		})
	}

	launchOptions = () => {
		this.setState({
			componentToLoaded: Options,
			actions: {
				launchMenu: () => this.launchMenu()
			}
		})
	}

	launchMenu = () => {
		this.setState({
			componentToLoaded: Menu,
			actions: {
				launchGame: () => this.launchGame(),
				launchOptions: () => this.launchOptions()
			}
		})
	}

	render() { 
		return (
			<div id="wrapper_tetris">
				{
					(this.state.componentToLoaded !== null) && 
						<this.state.componentToLoaded actions={this.state.actions} />
				}
			</div>
		)
	}

}

export default App;
