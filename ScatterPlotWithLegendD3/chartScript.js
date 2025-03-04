// basic framework from class example, edited to work for my needs
// started with a copy of my bar chart, and edited
// Set up the SVG container
const svgWidth = 1000;
const svgHeight = 1000;
const margin = { top: 50, right: 100, bottom: 100, left: 250 };
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

const minSize = 1
const maxSize = 6
const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Read data from CSV
d3.csv("https://gist.githubusercontent.com/my-name-here/945eb7a96c48a4e44d4e8d28dc2f8f8e/raw/f507ae593a044f4176a1908f1e3b56ff4d54c723/carsDataVis.csv").then(function (data) {

    // Convert string values to numbers
    data.forEach(function (d) {
        d["economy (mpg)"] = +d["economy (mpg)"];
        d["weight (lb)"] = +d["weight (lb)"]
        d["cylinders"] = +d["cylinders"]

        d.name = d.name;
    });
    data.sort((a,b) => a.name>b.name);
    console.log(data);

    // Define X and Y scales
    const y = d3.scaleLinear()
        .domain([d3.min(data, d => d["weight (lb)"])-200, d3.max(data, d => d["weight (lb)"])])
        .nice()
        .range([ 0, -height])
        //.padding(0.1);
    console.log(d3.max(data, d => d["economy (mpg)"]))
    const x = d3.scaleLinear()
        .domain([d3.min(data, d => d["economy (mpg)"])-2, d3.max(data, d => d["economy (mpg)"])])
        .nice()
        .range([ 0, width]);
    
    // ordinal scale, see https://d3js.org/d3-scale/ordinal
    var colorScale = d3.scaleOrdinal()
        .domain( [3,4,5,6,8])

        // colors from colorbrewer
        .range(["#1b9e77", "#d95f02", "#7570b3","#e7298a","#66a61e"]);
        


    // Add X and Y axes
    svg.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(20));

    svg.append("g")
        .attr("class", "axis axis-y")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisLeft(y).ticks(20));

    // Add bars
    // adding multiple elements on same level with groups based on https://stackoverflow.com/questions/65434376/append-two-elements-in-svg-at-the-same-level
    bars =  svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")
        

       
    bars.append("circle")
        .attr("cx", d => x(d["economy (mpg)"]))
        .attr("cy", d => y(d["weight (lb)"]))
        .attr("r", 5)
        .attr("fill", d =>  colorScale(d.cylinders))
        .attr("transform", `translate(0, ${height})`)// translate points down to match with axis

    
    // bars.append("text")
    //     .attr("class", "barLabel")
    //     .text(d => `mpg: ${(d["economy (mpg)"])}`)
    //     .attr("y", d => y(d.name)+15)
    //     .attr("x", d => 25)
        



    svg.append("text")
        .text("weight")
        .attr("x", -100)
        .attr("y", height/2)
        
    svg.append("text")
        .text("mpg")
        .attr("x", width/2)
        .attr("y", height+margin.bottom/2)

    svg.append("text")
    
        .text("scatter plot of the weights of cars vs the mpg, colored by the number of cylinders")
        .attr("class", "title")
        .attr("x", 0)
        .attr("y", -margin.top/2)
        var legend = d3.legendColor()
		.title("Color Legend: distance from avg mpg")
		.titleWidth(100)
        .cells(11) // change the number of cells during demo 
        .scale(colorScale);
		

    svg.append("g")
        .attr("transform", `translate(${width},0)`)
        .call(legend);
});