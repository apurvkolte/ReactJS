import React, { Component } from 'react';
import CanvasJSReact from '../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class PieChart extends Component {
	constructor(props) {
		super(props);
		this.state = { data: props };
	}
	render() {
		const processing = this.state.data.data[0].processing
		const shipped = this.state.data.data[1].shipped
		const delivered = this.state.data.data[2].delivered
		const cancel = this.state.data.data[3].cancel
		const returned = this.state.data.data[4].returned
		const returnApproved = this.state.data.data[5].returnApproved

		// console.log("this.state", cancel);

		const options = {
			exportEnabled: true,
			animationEnabled: true,
			title: {
				text: "Orders Status"
			},
			data: [{
				type: "pie",
				startAngle: 75,
				toolTipContent: "<b>{label}</b>: {y}%",
				showInLegend: "true",
				legendText: "{label}",
				indexLabelFontSize: 16,
				indexLabel: "{label}  {y}",
				dataPoints: [
					{ y: processing, label: "Processing" },
					{ y: shipped, label: "Shipped" },
					{ y: delivered, label: "Delivered" },
					{ y: cancel, label: "Cancel" },
					{ y: returned, label: "Return" },
					{ y: returnApproved, label: "Returned" }
				]
			}]
		}

		return (
			<div className='border border-secondary' >
				{/* <h1>Pie Chart</h1> */}
				<CanvasJSChart options={options}
				/* onRef={ref => this.chart = ref} */
				/>
				{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
			</div>
		);
	}
}

export default PieChart;