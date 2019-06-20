// funzione per ottenere la data
function get_date(){
	$(".button").click(function(){
		date = $(this).text();

		// qui passo la data alla funzione per generare la chart
		bubble_chart(date)
	})
}

// funzione per generare la chart
function bubble_chart(date){
	console.log(date);

	var container = "#dataviz";
 	var width = 1000;
 	var height = 600;

	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("width",width)
	svg.setAttribute("height",height)

	var pack = d3.pack()
		.size([width-150, height])
		.padding(1.5);

	d3.csv("assets/data/data.csv", function(d) {
		if (d.date == date) {
			d.hdi_rank = +d["hdi_rank"];
			d.country = d["country"];
			d.value = +d["value"];
			d.label = d["label"];
		 	return d;
		}
	},
	function(error, data) {
		if (error) throw error;

		var color_palette = d3.scaleLinear()
			// .domain(data.map(function(d){
			// 	return d.value;
			// }))
			.domain([300, 1000])
			.range(["#E3E2FF","#1919f9"]);
			// .range(["red","blue"]);

	  	var root = d3.hierarchy({children: data})
			.sum(function(d) {
				return d.value;
			})
			.sort(function(a, b) {
				return b.value - a.value;
			});

		var node = d3.select(svg).selectAll(".node")
			.data(pack(root).leaves())
			.enter()
			.append("g")
			.attr("class", "node")
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});

		node.append("circle")
			.attr("r", function(d) { return d.r; })
			.attr("class", function(d) {
				return d.value
			})
			.style("fill", function(d) {
				if (d.data.country == "Switzerland"){
					return "red"
				}
				else {
					return color_palette(d.data.value);
				}
			})
			.style("stroke", function(d) {
				return "black";
			})
			.style("stroke-width",2)

		node.append("text")
			.text(function(d) {
				return d.data.country + " " + d.data.label;
			})
			.attr("class",function(d) {
				return d.data.country;
			})
			.attr("opacity", function(d) {
				if (d.data.country == "Switzerland"){
					return 1
				}
				else {
					return 0
				}
			})
			.attr("text-anchor","middle")
			.on("mouseover", handleMouseOver)
			.on("mouseout", handleMouseOut )

		// Add interactivity
		function handleMouseOver(d, i) {

        // Use D3 to select element, change opacity
        	d3.select(this)
        		.attr("opacity",1)
    	}
    	function handleMouseOut(d, i) {
        	d3.select(this)
        		.attr("opacity", function(d) {
					if (d.data.country == "Switzerland"){
						return 1
					}
					else {
						return 0
					}
				})
		}

        document.querySelector(container).innerHTML = "";
        document.querySelector(container).appendChild(svg);

	});
}

$(document).ready(function() {
	get_date();
	bubble_chart(2017);
});

// reference
// https://bl.ocks.org/carlvlewis/53d42df2300231c1daacdaf9067043c0
