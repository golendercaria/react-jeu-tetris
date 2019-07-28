import React, { Component } from 'react'
import './App.scss'
import Menu from './Menu'
import Game from './Game'
import Options from './Options'
import ReactGA from 'react-ga';

class App extends Component{

	state = {
		componentToLoaded: null,
		actions: null
	}

	componentDidMount() { 
		
		this.launchMenu()

		ReactGA.initialize("UA-114649554-2");
		ReactGA.pageview(window.location.pathname + window.location.search)
		
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
