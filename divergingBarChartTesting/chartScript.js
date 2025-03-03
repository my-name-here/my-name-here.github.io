// basic framework from class example, edited to work for my needs
// Set up the SVG container
const svgWidth = 1000;
const svgHeight = 4000;
const margin = {
    top: 50,
    right: 100,
    bottom: 30,
    left: 250,
};
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

const svg = d3
    .select('#chart-container')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)

    .append('g')
    .attr(
        'transform',
        `translate(${margin.left},${margin.top})`,
    );

// Read data from CSV
d3.csv(
    'https://gist.githubusercontent.com/my-name-here/945eb7a96c48a4e44d4e8d28dc2f8f8e/raw/f507ae593a044f4176a1908f1e3b56ff4d54c723/carsDataVis.csv',
).then(function (data) {
    // Convert string values to numbers
    data.forEach(function (d) {
        d['economy (mpg)'] = +d['economy (mpg)'];
        d.name = d.name;
        d["power (hp)"] = +d["power (hp)"];
    });
    data.sort((a, b) => a.name > b.name);
    console.log(data);

    // Define X and Y scales
    const y = d3
        .scaleBand()
        .domain(data.map((d) => d.name))
        .range([0, height])
        .padding(0.1);
    console.log(d3.max(data, (d) => d['economy (mpg)']));
    const x = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d['economy (mpg)'])])
        .nice()
        .range([0, width]);

    var colorScale = d3.scaleSequential()
        .interpolator(d3.interpolateRdBu)
        .nice()
        .domain([d3.min(data, (d) => d['power (hp)']),d3.max(data, (d) => d['power (hp)'])]);



    // Add X and Y axes
    svg
        .append('g')
        .attr('class', 'axis axis-x')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(20));

    svg
        .append('g')
        .attr('class', 'axis axis-y')
        .call(d3.axisLeft(y).ticks(1));

    // Add bars
    // adding multiple elements on same level with groups based on https://stackoverflow.com/questions/65434376/append-two-elements-in-svg-at-the-same-level
    bars = svg
        .selectAll('.bar')
        .data(data)
        .enter()
        .append('g');

    bars
        .append('rect')
        .attr('class', 'bar')
        .attr('y', (d) => y(d.name))
        .attr('height', y.bandwidth())
        .attr('x', (d) => 0)
        .attr('width', (d) => x(d['economy (mpg)']))
        .attr('fill', d => colorScale(d['power (hp)']));

    bars
        .append('text')
        .attr('class', 'barLabel')
        .text((d) => `mpg: ${d['economy (mpg)']}`)
        .attr('y', (d) => y(d.name) + 15)
        .attr('x', (d) => 25);
        

    svg
        .append('text')
        .text('Vehicle Name')
        .attr('x', -100)
        .attr('y', 0);

    svg
        .append('text')
        .text('MPG')
        .attr('x', 150)
        .attr('y', 0);

    svg
        .append('text')

        .text('barchart of MPG of cars with color representing power, sorted by name')
        .attr('class', 'title')
        .attr('x', 0)
        .attr('y', -margin.top / 2);
    var legend = d3.legendColor()
		.title("Color Legend: Power (Horsepower)")
		.titleWidth(100)
        .cells(10) // change the number of cells during demo 
        .scale(colorScale);
		

    svg.append("g")
        .attr("transform", `translate(${width},0)`)
        .call(legend);

});
