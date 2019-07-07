import React, { Component } from 'react'
import Modal from "./Modal"
import touchAndHelper from "./touchAndHelper"

class Options extends Component {

	state = {
		options: {
			touch: {
				"bottom": 40,
				"left": 37,
				"right": 39,
				"rotateLeft": 89,
				"rotateRight":88
			},
			helpers: {
				"projection":true
			}
		},
		captureTouch: false,
		modalActive:false
	}

	componentDidMount() { 
		let options = JSON.parse(localStorage.getItem("tetris_options"))
		if (options === null || options === "") { 
			options = touchAndHelper
		}
		this.setState({ options }, () => {
			window.addEventListener("keydown", this.keydownActions)
		})
	}

	keydownActions = (e) => { 
		if (this.state.captureTouch !== false) {
			let touch = this.state.options.touch
			touch[ this.state.captureTouch ] = e.keyCode
			this.setState({ touch, captureTouch:false, modalActive:false })
		}
	}

	componentWillUnmount() {
		localStorage.setItem("tetris_options", JSON.stringify(this.state.options))
		window.removeEventListener("keydown", this.keydownActions)
	}

	updateTouch = (touch) => {
		this.setState({captureTouch:touch, modalActive:true})
	}

	updateHelper = (helper) => {

		let helpers = this.state.options.helpers

		if (helpers[helper] === true) {
			helpers[helper] = false
		} else { 
			helpers[helper] = true
		}
		
		this.setState({ helpers })
	}

	render() { 
		return (
			<div id="options">

				<Modal active={this.state.modalActive}/>

				<h1>Options</h1>
				<h2>Liste des options</h2>
				{
					Object.keys(this.state.options.touch).map((t) => {
						return <button onClick={ () => this.updateTouch(t) } key={"touch_"+t}>{t} ({this.state.options.touch[t]})</button>
					})
				}
				<h2>Liste des helpers</h2>
				{
					Object.keys(this.state.options.helpers).map((h) => {
						return <button onClick={() => this.updateHelper(h)} key={"helper_" + h}>{h} ({
							(this.state.options.helpers[h] === true) ? "ON" : "OFF"
						})</button>
					})
				}
				<button onClick={ () => this.props.actions.launchMenu() }>Back</button>
			</div>
		)
	}
}

export default Options;