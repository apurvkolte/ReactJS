import React, { Component } from 'react';
import CanvasJSReact from '../assets/canvasjs.stock.react';
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

class StockChartWithRangeSelector extends Component {
	constructor(props) {
		super(props);
		this.state = { dataPoints: [], isLoaded: false, sales: props };
		// console.log("this", props.sales);
	}

	componentDidMount() {
		// //Reference: https://reactjs.org/docs/faq-ajax.html#example-using-ajax-results-to-set-local-state
		// fetch("https://canvasjs.com/data/gallery/react/btcusd2017-18.json")
		//   .then(res => res.json())
		//   .then(
		// // 	(data) => {
		// console.log("this.sales", this.state.sales.sales.length);
		// const data = [{ "date": 1483228800000, "close": 997.39 }, { "date": 1483315200000, "close": 1037.5 }]
		const data = this.state.sales.sales
		var dps = [];
		for (var i = 0; i < data.length; i++) {
			// console.log("this.sales", new Date(data[i].order_date));

			dps.push({
				x: new Date(data[i].order_date),
				y: Number(data[i].sale_price)
			});
		}
		this.setState({
			isLoaded: true,
			dataPoints: dps
		});
		// 	}
		//   )
	}

	render() {
		const options = {
			title: {
				text: "Sales Orders Chart with Month"
			},
			theme: "light2",
			subtitles: [{
				text: "INR"
			}],
			charts: [{
				axisX: {
					crosshair: {
						enabled: true,
						snapToDataPoint: true,
						valueFormatString: "MMM DD YYYY"
					}
				},
				axisY: {
					title: "Orders Price",
					prefix: "₹",
					crosshair: {
						enabled: true,
						snapToDataPoint: true,
						valueFormatString: "₹#,###.##"
					}
				},
				toolTip: {
					shared: true
				},
				data: [{
					name: "Price (in INR)",
					type: "splineArea",
					color: "#3576a8",
					yValueFormatString: "₹#,###.##",
					xValueFormatString: "MMM DD YYYY",
					dataPoints: this.state.dataPoints
				}]
			}],
			navigator: {
				slider: {
					minimum: new Date("2022-1-01"),
					maximum: new Date("2030-05-01")
				}
			}
		};
		const containerProps = {
			width: "100%",
			height: "450px",
			margin: "auto"
		};
		return (<>
			<h1 className='heading'>Charts</h1><br />
			<div className='border border-secondary'>
				{
					// Reference: https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator
					this.state.isLoaded &&
					<CanvasJSStockChart containerProps={containerProps} options={options}
					/* onRef = {ref => this.chart = ref} */
					/>
				}
			</div>
		</>

		);
	}
}

export default StockChartWithRangeSelector;