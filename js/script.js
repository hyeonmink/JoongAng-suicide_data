$(function(){
    const DEFAULTCOLUMN = '사망자수'
    /**Initial setting */
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
        // console.log(allData)
        var orderedData = [];
        var selectedColumn = DEFAULTCOLUMN
        var xScale = d3.scaleBand()
        var yScale = d3.scaleLinear()
        var xAxis = d3.axisBottom()
        var yAxis = d3.axisLeft();
                
        function filterData(columnName){
            orderedData = allData.sort((a,b)=>d3.descending(+a[columnName], +b[columnName]))
                                .slice(0,10)
        }
        
        function setScale(){
            xScale.range([0, drawWidth])
                .padding(0.1)
                .domain(orderedData.map((d)=>d['군구']))

            //set XScale
            var yMax = orderedData[0][selectedColumn]
            yScale.range([drawHeight, 0])
                .domain([0, yMax]);
        }

        function setAxis(){
            xAxis.scale(xScale)
            yAxis.scale(yScale);
        }
        
        function draw(){
            var bar = g.selectAll('rect')
                    .data(allData)

            var xAxisLabel = svg.append('g')
                                .attr('transform', `translate(${margin.left}, ${drawHeight + margin.top})`)
                                .attr('class', 'axis')
                                .call(xAxis)
                                .selectAll('text')
                                .attr('transform', 'rotate(-45)')
                                .style('text-anchor', 'end');

            var yAxisLabel = svg.append('g')
                                .attr('transform', `translate(${margin.left},${margin.top})`)
                                .call(yAxis);
            
            var bar = g.selectAll('rect')
                    .data(orderedData)

            bar.enter()
            .append('rect')
            .merge(bar)
            .attr('class', 'bar')
            .attr('x', (d)=>xScale(d['군구']))
            .attr('y', drawHeight)
            .transition()
            .duration(1500)
            .delay((d, i)=> i*50)
            .attr('y', (d)=>yScale(d[selectedColumn]))
            .attr('width', xScale.bandwidth())
            .attr('height', (d)=> drawHeight-yScale(d[selectedColumn]))

            bar.exit()
            .remove()
        }

        function render(){
            filterData(DEFAULTCOLUMN)
            setScale();
            setAxis();
            draw();
        }
        render();


    })
})