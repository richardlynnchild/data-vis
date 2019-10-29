class Bubblechart {

    constructor(data){
        this.words = data;

        // Setup padding
        this.paddingY = 0;
        this.paddingX = 0;

        // Circle size scale from "total" property
        let totals = [];
        for(let d of data){
            totals.push(+d.total)
        }
        const totalMin = Math.round(d3.min(totals));
        const totalMax = Math.round(d3.max(totals));
        console.log("Total min: " + totalMin);
        console.log("Total max: " + totalMax);
        this.circleSizeMin = 3;
        this.circleSizeMax = 10;
        this.circleSizeScale = d3.scaleLinear()
        .domain([totalMin,totalMax])
        .range([this.circleSizeMin,this.circleSizeMax]);

        // Offset for svg group transformation
        this.axis_group_offset = 70;
        this.chart_top_offset = this.axis_group_offset + this.circleSizeMax + Math.round(0 - d3.min(data, function(d){
            return d.sourceY;
        }));

        // Set the total chart width and height
        let sourceXMax = Math.round(d3.max(data, function(d){ return d.sourceX}));
        let sourceXMin = Math.round(d3.min(data, function(d){ return d.sourceX}));
        this.chart_width = this.circleSizeMax*2 + this.paddingX*2 + sourceXMax;
        console.log("Chart Width: " + this.chart_width);
        this.chart_height = this.chart_top_offset + this.circleSizeMax + this.paddingY*2 + Math.round(d3.max(data, function(d){
            return d.moveY;
        }));

        // Category names for circle color scale
        let raw_categories = [... new Set(data.map(word => word.category))]
        this.categories = [];
        for(let cat of raw_categories){
             this.categories.push(cat.charAt(0).toUpperCase() + cat.substring(1));
        }
        console.log("Categories: " + this.categories)
        let colors = ['#5BC7A3','#C4826E','#A3E249','#E991BC','#FEE046','#9AA0BF']
        this.colorScale = d3.scaleOrdinal().domain(this.categories).range(colors)

        // Bubble scale for the axis
        let positionMin = d3.min(data, function(d) {return d.position});
        let positionMax = d3.max(data, function(d) {return d.position});
        this.bubbleScale = d3.scaleLinear()
                            .domain([positionMin, positionMax])
                            .range([sourceXMin, sourceXMax])
                            .nice();

        // Expanded toggle
        this.expanded = false;
        
    }

    createChart(){
        //const svgW = this.chart_width+this.circleSizeMax*2+this.paddingX;
        //const svgH = this.chart_height+this.circleSizeMax*2+this.paddingY;
        let svg = d3.select(".chart-view").append("svg")
                    .attr("width", this.chart_width)
                    .attr("height", this.chart_height);

        svg.append("text").text("Democratic Leaning")
            .attr("x","30")
            .attr("y","20");
        svg.append("text").text("Republican Leaning")
            .attr("x",this.chart_width*0.8+this.paddingX)
            .attr("y","20");

        let formatter = d3.format("0");
        let bubbleAxis = d3.axisBottom();
        bubbleAxis.scale(this.bubbleScale)
        .tickFormat(function(d){
            if(d < 0){
                d = -d;
            }
            return formatter(d);
        });
        let gAxis = svg.append("g")
                    .attr("transform","translate("+this.paddingX+" 40)")
                    .call(bubbleAxis);
        let gChart = svg.append("g")
                    .attr("transform","translate("+this.paddingX +" "+(this.paddingY+this.chart_top_offset)+")")
                    .attr("id","chart-group");

        let tooltipDiv = d3.select("body").append("div").classed("chart-tooltip",true)
            .style("opacity", 0);
        
        let circleSizeScale = this.circleSizeScale;
        let colorScale = this.colorScale;
        gChart.selectAll('circle').data(this.words)
            .enter()
            .append('circle')
            .attr("cx",function(d){return Math.round(d.sourceX)})
            .attr("cy",function(d){return Math.round(d.sourceY)})
            .attr('r',function(d){return Math.round(circleSizeScale(d.total))})
            .attr("fill",function(d){return colorScale(d.category)})
            .attr("stroke-width","1")
            .attr("stroke","black")
            .on("mouseover", function(d){
                tooltipDiv.transition()
                    .duration(200)
                    .style("opacity", .9);
                let phrase_nice = d.phrase.charAt(0).toUpperCase() + d.phrase.substring(1);
                let percent = Math.round(d.total/50*100);
                let lean = "D ";
                if(+d.position > 0){
                    lean = "R +"
                }
                tooltipDiv.html(phrase_nice + "<br>" + lean + Math.round(d.position*100)/100 + "% <br> In " + percent + "% of speeches");
                tooltipDiv.style("left", (d3.event.pageX)+"px")
                    .style("top", (d3.event.pageY+20)+"px");
            })
            .on("mouseout", function(){
                tooltipDiv.transition()
                    .duration(500)
                    .style("opacity", 0);
            }); 
    }

    collapseChart(){
        let gChart = d3.select("g#chart-group").data(this.words)
                        .selectAll("circle")
                        .attr("cx", function(d){ return d.sourceX})
                        .attr("cy", function(d){ return d.sourceY});
    }

    expandChart(){
        let gChart = d3.select("g#chart-group").data(this.words)
                        .selectAll("circle")
                        .attr("cx", function(d){ return d.moveX})
                        .attr("cy", function(d){ return d.moveY});
    }

    handleExpandClick(){
        this.expanded = !this.expanded;
        if(this.expanded){
            d3.select("button#btn-expand").text("Collapse!");
            console.log(this);
            let circles = d3.selectAll("g circle");
            circles.transition().duration(1000).attr("cx", function(d){ return d.moveX})
                    .attr("cy", function(d){ return d.moveY});
        }
        else {
            d3.select("button#btn-expand").text("Expand!");
            console.log(this);
            let circles = d3.selectAll("g circle");
            circles.transition().duration(1000).attr("cx", function(d){ return d.sourceX})
                        .attr("cy", function(d){ return d.sourceY});
        }
    }
}