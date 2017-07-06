$(function(){
    const DEFAULTCOLUMN = '사망률'
    const DEFAULTGENDER = '남자'
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

    var xAxisLabel = svg.append('g')
                        .attr('transform', `translate(${margin.left}, ${drawHeight + margin.top})`)
                        .attr('class', 'axis')

    var yAxisLabel = svg.append('g')
                        .attr('transform', `translate(${margin.left},${margin.top})`)



    d3.csv('./data/data.csv', function(error, allData){
        var orderedData = [];
        var selectedGender = [];
        var selected = DEFAULTGENDER;
        var selectedColumn = DEFAULTCOLUMN

        var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        var yFormat = d3.format('.2s')
        var xScale = d3.scaleBand();
        var yScale = d3.scaleLinear();
        var xAxis = d3.axisBottom()
        var yAxis = d3.axisLeft().tickFormat(yFormat);

        function filterData(){
            orderedData = allData.filter((d)=>(d['성별']) == selected)
                                .sort((a,b)=>d3.descending(+a[selectedColumn], +b[selectedColumn]))
                                .slice(0,10)
        }
        
        function setScale(){
            xScale.range([0, drawWidth])
                .padding(0.1)
                .domain(orderedData.map((d)=>(d['시'] + " " + d['군구'])))

            //set XScale
            var yMax = orderedData[0][selectedColumn] * 1.1
            yScale.range([drawHeight, 0])
                .domain([0, yMax]);
        }

        function setAxis(){
            xAxis.scale(xScale)
            yAxis.scale(yScale);

            xAxisLabel.transition()
                    .duration(1000)
                    .call(xAxis)
                    .selectAll('text')
                    .attr('transform', 'rotate(-45)')
                    .style('text-anchor', 'end');

            yAxisLabel.transition().duration(1000).call(yAxis);


        }
        
        function draw(){
            g.selectAll('rect').remove();
            g.selectAll('text').remove();
            var bar = g.selectAll('rect')
                    .data(orderedData, (d)=>(d['시'] + " " + d['군구']))

            bar.enter()
            .append('rect')
            .merge(bar)
            .attr('class', 'bar')
            .attr('x', (d)=>+xScale(d['시'] + " " + d['군구']))
            .attr('y', drawHeight)
            .attr('fill', (d)=>colorScale(d['시']))
            .transition()
            .duration(1500)
            .delay((d, i)=> i*50)
            .attr('y', (d)=>yScale(d[selectedColumn]))
            .attr('width', xScale.bandwidth())
            .attr('height', (d)=> drawHeight-yScale(d[selectedColumn]))

            bar.enter()
                .append("text")
                .attr("x", (d)=>+xScale(d['시'] + " " + d['군구']) + 40)
                .attr("y", 0)
                .transition()
                .duration(1500)
                .delay((d, i)=> i*50)
                .attr("y", (d)=> yScale(d[selectedColumn])-2)
                .attr("text-anchor", "middle")
                .text(function(d){
                    return (d[selectedColumn] + (selectedColumn == '사망률' ? '%' : '명'));
                    })
    
            bar.exit().remove();


            $('.legendLinear').remove();

            var legend = svg.append("g")
                .attr("class", "legendLinear")
                .attr("transform", `translate(${width*50/100},0)`);

            var legendLinear = d3.legendColor()
                .shapeWidth(40)
                .orient('horizontal')
                .scale(colorScale);

            svg.select(".legendLinear").call(legendLinear);
        }

        function render(){
            filterData()
            setScale();
            setAxis();
            draw();
        }
        render();

        $("input[type=radio]").on('change', function() {
            // Get value, determine if it is the sex or type controller
            data = $(this).val();
            switch(data){
                case '1':
                    selectedColumn = '사망자수'
                    break;
                case '2':
                    selectedColumn = '사망률'
                    break;
            }
            render()
        })

        $('input[type=checkbox]').on('click', ()=>{
            selectedGender = []
            $('input[type=checkbox]:checked').each(function() {
                selectedGender.push($(this).val())
            });
            if(selectedGender.length == 2){
                selected = '계'
                render();
            } else if (selectedGender.length == 1){
                if(selectedGender[0]=='m'){
                    selected = '남자'
                } else {
                    selected = '여자'
                }
                render();
            } else {
                g.selectAll('rect').remove();
                g.selectAll('text').remove();
            }
        })
    })
})