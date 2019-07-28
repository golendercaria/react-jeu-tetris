import React, { Component } from 'react'
import Modal from "./Modal"
import touchAndHelper from "./touchAndHelper"
import './Options.scss'

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

				<Modal active={this.state.modalActive} message={"Push on touch on your keyboard !"}/>

				<h1>Options</h1>
				<p className="description">For change option, click on shape and press you favorite touch</p>
				<h2>Liste des options</h2>
				{
					Object.keys(this.state.options.touch).map((t) => {
						return <button className={"option " + t} onClick={() => this.updateTouch(t)} key={"touch_" + t}>
							<span className="shape"></span>
							<span className="touch">{t} ({this.state.options.touch[t]})</span>
						</button>
					})
				}
				<h2>Liste des helpers</h2>
				{
					Object.keys(this.state.options.helpers).map((h) => {
						return <button className={"option " + h} onClick={() => this.updateHelper(h)} key={"helper_" + h}>
							<span className="shape"></span>
							<span className="shape2"></span>
							<span className="touch">{h} ({
								(this.state.options.helpers[h] === true) ? "ON" : "OFF"
							})
							</span>
						</button>
					})
				}
				<button className="back" onClick={ () => this.props.actions.launchMenu() }>Back</button>
			</div>
		)
	}
}

export default Options;