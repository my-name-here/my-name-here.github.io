



// basic framework from class example, edited to work for my needs
// started with a copy of my bar chart, and edited
// Set up the SVG container
const svgWidth = 1000;
const svgHeight = 700;
const margin = { top: 50, right: 100, bottom: 100, left: 100 };
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;
console.log(width)
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




    var colorScale = d3.scaleSequential()
        .interpolator(d3.interpolateRdBu)
        .nice()
        .domain([-1, 1]);
    let nodesList = [];
    let linksList = [];
    var UsedNodes = [];// nodes we have already Used
   // based on the code in the source(https://gist.github.com/d3noob/5155181)
   d3.csv("https://raw.githubusercontent.com/my-name-here/my-name-here.github.io/refs/heads/main/nodeLinkGraphD3/nodes.csv").then(function (data) {

    //loop over the links in the csv
    data.forEach(function(d) {
        // node either uses existing node if src already a node, or creates a new node in correct format if not
        if (!UsedNodes.includes(d.Src)){
            nodesList.push({"id": d.Src})
            UsedNodes.push(d.Src)

        }
        // now we need to do the same witht he destination node, creating it if it doesn;t exist
        if (!UsedNodes.includes(d.Dest)){
            nodesList.push({"id": d.Dest})
            UsedNodes.push(d.Dest)

        }
        d.value = +d.value;
        // use source, target, value, to match with names used in data from https://observablehq.com/@d3/force-directed-graph-component
        linksList.push({"source":d.Src, "target": d.Dest, "value": +d.Val})
    });
    //console.log(nodesList);

// see https://github.com/d3/d3-force/issues/32
var graph = {
    "nodes":nodesList,
    "links":linksList,
}
links = graph.links.map(d => ({...d}));
const nodes = graph.nodes.map(d => ({...d}));

// force simulation based onhttps://d3js.org/d3-force/simulation and https://observablehq.com/@d3/force-directed-graph/2?collection=@d3/d3-force

  // Create a simulation with several forces.
  const simulation = d3.forceSimulation(nodes)
      //.force("link", d3.forceLink(links))
      // another fix based on github issues(https://github.com/d3/d3-force/issues/32)
      .force('link', d3.forceLink(links).id(function(d) { return d.id; })
        // distance from on https://d3js.org/d3-force/link
        .distance(100)
    )
      // force strength adjsutment from https://d3js.org/d3-force/many-body
      .force("charge", d3.forceManyBody().strength(-1500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);


    console.log(links)
    // lnik code based on https://observablehq.com/@d3/force-directed-graph/2?collection=@d3/d3-force
    const link = svg.append("g")// new group containing links
        .selectAll()
        .data(links)
        .join("line")// adds a new line for each link

    //  node code based on https://observablehq.com/@d3/force-directed-graph/2?collection=@d3/d3-force, as well as the link code
    const node = svg.append("g")// new node group
        .selectAll()
        .data(nodes)
        // adding text based on https://stackoverflow.com/a/60691259
        .join("g")
    node.append("circle")
    // a rect that will go behind the text
    // https://brettromero.com/d3-js-adding-a-colored-background-to-a-text-element/
    // since no nice way of adding backfround to text, just fake it with a rectangle
    node.append("rect")

    node.append("text").text(d=>d.id)


    //ticked based on https://observablehq.com/@d3/force-directed-graph/2?collection=@d3/d3-force
    function ticked() {
        link
            // start and end set to current positions
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
            // set color of links based on value
            .attr("stroke-width", 3)// set a stroke width

            .attr("stroke", d=>colorScale(d.value));
    
        node
        //  selecting circle based on https://d3js.org/d3-selection/selecting
            node.select("circle")
            // center the circle at the new position
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", 5);
        node.select("rect")
            .attr("x", d => d.x+10)
            .attr("y", d => d.y-30)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", "white")
        // since text not going to location, need to update location of text as well
        node.select("text")
            // + and - 10, to shift it so it doesn't overlap with the circles
            .attr("x", d => d.x+10)
            .attr("y", d => d.y-10)

      }

   });