d3.json('data/words.json').then( data => {
    console.log("Loaded the words.json file!");
    let viewsDiv = d3.select("body").append("div").classed("views",true);
    let chartDiv = viewsDiv.append("div").classed("chart-view",true);
    chartDiv.append("div").classed("btn-div","true").append("button").text("Expand!").attr("id","btn-expand");
    chartDiv.select("div.btn-div").append("button").text("Show Extremes!").attr("id","btn-extremes");
    let bubbleChart = new Bubblechart(data);
    d3.select("button#btn-expand").on("click",bubbleChart.handleExpandClick);
    bubbleChart.createChart();

    let tableDiv = viewsDiv.append("div").classed("table-view",true);
    let table = new Table(data);
    table.createTable();
    d3.selectAll("thead tr:first-child td").on("click",function(){
        let header = d3.select(this);
        console.log(header.text());
    });
})