$(function(){
    var margin = {
        top: 10,
        right: 10,
        bottom: 150,
        left: 60
    };

    // SVG width and height
    var width = 960;
    var height = 500;

    // Graph width and height - accounting for margins
    var drawWidth = width - margin.left - margin.right;
    var drawHeight = height - margin.top - margin.bottom;

    /************************************** Create chart wrappers ***************************************/
    // Create a variable `svg` in which you store a selection of the element with id `viz`
    // Set the width and height to your `width` and `height` variables
    var svg = d3.select('#viz')
                .attr('height', height)
                .attr('width', width)

    // Append a `g` element to your svg in which you'll draw your bars. Store the element in a variable called `g`, and
    // Transform the g using `margin.left` and `margin.top`
    var g = svg.append('g')
               .attr('transform', `translate(${margin.left}, ${margin.top})`)
               .attr('height', drawHeight)
               .attr('width', drawWidth)


    d3.csv('./data/data.csv', function(error, allData){
        console.log(allData)
        var selectedColumn = '사망자수'
        
        var xScale = d3.scaleBand()
                       .range([0, drawWidth])
                       .padding(0.1)
                       .domain(allData.map((d)=>d['군구']))

        var xAxis = d3.axisBottom()
                    .scale(xScale)

        var yMax = d3.max(allData, (d)=>(+d[selectedColumn])) * 1.1
        
        // Create a `yScale` for drawing the heights of the bars. Given the data type, `d3.scaleLinear` is a good approach.
        var yScale = d3.scaleLinear()
                       .range([drawHeight, 0])
                       .domain([0, yMax]);

        var yAxis = d3.axisLeft()
                      .scale(yScale);


        var bar = g.selectAll('rect')
                   .data(allData)
        
        bar.enter()
        .append('rect')
        .attr('height', (d)=>{console.log(d)})



    })
})