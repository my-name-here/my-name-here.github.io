

// node link graph based on https://gist.github.com/d3noob/5155181


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

    svg.append("text")
    
        .text("force directed layout")
        .attr("class", "title")
        .attr("x", 0)
        .attr("y", -margin.top/2)


    svg.append("g")
        .attr("transform", `translate(${width},0)`)
        .call(legend);


    // based on the code in the source(https://gist.github.com/d3noob/5155181)
    d3.csv("nodes.csv", function(error, links) {
        var nodes = {};
        //loop over the links in the csv
        links.forEach(function(link) {
            // node either uses existing node if src already a node, or creates a new node in correct format if not
            link.Src = nodes[link.Src] || 
                (nodes[link.Src] = {name: link.Src});
            // now we need to do the same witht he destination node, creating it if it doesn;t exist
            link.Dest = nodes[link.Dest] || 
                (nodes[link.Dest] = {name: link.Dest});
            link.value = +link.value;
        });
        // will color the points based on whether value is positive or negative, using linear scale to get it all positive, but shouldn't matter

        valueScale = d3.scaleLinear()
            .domain([-1,1])
            .range([0,100])
    });
