// basic framework from class example, edited to work for my needs
// started with a copy of my bar chart, and edited
// Set up the SVG container
const svgWidth = 1000;
const svgHeight = 1000;
const margin = { top: 50, right: 20, bottom: 100, left: 250 };
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
d3.csv("cars.csv").then(function (data) {

    // Convert string values to numbers
    data.forEach(function (d) {
        d["economy (mpg)"] = +d["economy (mpg)"];
        d["weight (lb)"] = +d["weight (lb)"]
        d["cylinders"] = +d["cylinders"]
        d["power (hp)"] = +d["power (hp)"]
        d.year = +d.year
        d.name = d.name;
    });

    data.sort((a,b) => a.name>b.name);
    console.log(data);
    // https://observablehq.com/@d3/d3-group
    const years = d3.rollup(data, v => d3.mean(v, d => d["power (hp)"]), d => d.year);
    console.log(years)
    // Define X and Y scales
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d["weight (lb)"])])
        .nice()
        .range([ 0, -height])
        //.padding(0.1);
    console.log(d3.max(data, d => d["economy (mpg)"]))
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d["economy (mpg)"])])
        .nice()
        .range([ 0, width]);
    
    const size = d3.scaleLinear()
        .domain([d3.min(data, d => d["cylinders"]), d3.max(data, d => d["cylinders"])])
        .nice()
        .range([ minSize, maxSize]);

    const color = d3.scaleLinear()
        .domain([d3.min(data, d => d["power (hp)"]), d3.max(data, d => d["power (hp)"])])
        .nice()
        .range([ 50, 255]);
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
        .attr("r", d => size(d["cylinders"]))
        .attr("fill", d =>  `rgb(${color(d["power (hp)"])}, ${color(d["power (hp)"])}, ${color(d["power (hp)"])})`)
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
    
        .text("bubble plot of the weights of cars vs the mpg, with size representing the number of cylinders and  darker colors representing higher power")
        .attr("class", "title")
        .attr("x", 0)
        .attr("y", -margin.top/2)
});