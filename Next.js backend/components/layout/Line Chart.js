import React, { Component } from 'react';
import CanvasJSReact from '../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class LineChart extends Component {
	constructor(props) {
		super(props);
		this.state = { yearSales: props };
	}

	render() {
		const year = this.state.yearSales.yearSales
		// console.log("yesra", year[0]);
		const options = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", // "light1", "dark1", "dark2"
			title: {
				text: "Total Sales by Year"
			},
			axisY: {
				title: "Price",
				includeZero: true,
				prefix: "Rs ",
			},
			axisX: {
				title: "Year",
				prefix: "",
				interval: 1
			},
			data: [{
				type: "line",
				toolTipContent: "Week {x}: {y}",
				dataPoints: [
					// { x: new Date().getFullYear() - 9, y: year[9] },
					// { x: new Date().getFullYear() - 8, y: year[8] },
					// { x: new Date().getFullYear() - 7, y: year[7] },
					{ x: new Date().getFullYear() - 6, y: year[6] },
					{ x: new Date().getFullYear() - 5, y: year[5] },
					{ x: new Date().getFullYear() - 4, y: year[4] },
					{ x: new Date().getFullYear() - 3, y: year[3] },
					{ x: new Date().getFullYear() - 2, y: year[2] },
					{ x: new Date().getFullYear() - 1, y: year[1] },
					{ x: new Date().getFullYear(), y: year[0] }
				]
			}]
		}

		return (
			<div className='border border-secondary'>
				{/* <h1>Charts</h1><br /> */}
				<CanvasJSChart options={options}
				/* onRef={ref => this.chart = ref} */
				/>
				{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
			</div>
		);
	}
}

export default LineChart;                           