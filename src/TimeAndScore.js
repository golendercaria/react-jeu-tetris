import React from 'react'

function TimeAndScore() {
	return (
		<div id="time_and_score" className="ui-text">
			<div className="time">
				<span className="title">TIME</span>
				<span className="value">09:53</span>
			</div>
			<div className="score">
				<span className="title">SCORE</span>
				<span className="value">23.456</span>
			</div>
		</div>
	)
}

export default TimeAndScore;