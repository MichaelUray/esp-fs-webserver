let chart = Highcharts.chart('container', {
	chart: {
		zoomType: 'x'
	},
	title: {
		text: 'Total heap size and max free block of RAM'
	},
	subtitle: {
		text: 'click and drag in the plot area to zoom in'
	},
	xAxis: {
		type: 'datetime'
	},
	yAxis: {
		title: {
			text: 'Bytes'
		}
	},
	legend: {
		enabled: false
	},
	plotOptions: {
		area: {
			fillColor: {
				linearGradient: {
					x1: 0,
					y1: 0,
					x2: 0,
					y2: 1
				},
				stops: [
					[0, Highcharts.getOptions().colors[0]],
					[1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
				]
			},
			marker: {
				radius: 2
			},
			lineWidth: 1,
			states: {
				hover: {
					lineWidth: 1
				}
			},
			threshold: null
		}
	},

	series: [{
			type: 'area',
			name: 'Total heap size',
			data: []
		},
		{
			type: 'area',
			name: 'Max contiguos RAM block',
			data: []
		},
	]
});


function addPoint(total, max) {

	chart.series[0].addPoint([Date.now(), total]);
	chart.series[1].addPoint([Date.now(), max]);
}


// WebSocket handling
var connection = new WebSocket('ws://' + location.hostname + ':81/');
connection.onopen = function () {
	connection.send('Connected - ' + new Date());
};
connection.onerror = function (error) {
	console.log('WebSocket Error ', error);
};
connection.onmessage = function (e) {
	console.log('Server: ', e.data);
	parseMessage(e.data);
};
connection.onclose = function () {
	console.log('WebSocket connection closed');
};

function parseMessage(msg) {
	try {
		const obj = JSON.parse(msg);
		if (typeof obj === 'object' && obj !== null) {
			// Add new point to chart message
			if (obj.addPoint !== null) {
				var date = new Date(0); // The 0 sets the date to epoch
				date.setUTCSeconds(obj.timestamp);
				document.getElementById("esp-time").innerHTML = date;
				addPoint(obj.totalHeap, obj.maxBlock);
			}
		}
	} catch {
		console.log('Error on parse message ' + msg);
	}
}