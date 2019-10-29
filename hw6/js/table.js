class Table {

    constructor(data){
        this.words = data;
        this.headers = ["Phrase","Frequency","Percentages","Total"];
        
        this.freq_scale = d3.scaleLinear().domain([0,1]).range([0,200]);
        this.percent_scale = d3.scaleLinear().domain([-100,100]).range([0,400]);
    }

    createTable() {
        let table = d3.select(".table-view").append("table");
        let head = table.append("thead");
        let head_row = head.append("tr");
        console.log(this.headers);
        let head_tds = head_row.selectAll("td").data(this.headers)
                        .enter()
                        .append("td").text((d)=>d);
        let tbody = table.append("tbody")
        let trows = tbody.selectAll('tr').data(this.words).enter().append('tr');
        let td = trows.selectAll("td").data(function(d){
            let arr = [
                {
                    vis:"text",
                    value:d.phrase
                },
                {
                    vis:"freq",
                    value: Math.round(d.total/50*100)/100
                },
                {
                    vis:"percent",
                    value: [d.percent_of_d_speeches,d.percent_of_r_speeches]
                },
                {
                    vis:"text",
                    value: d.total
                }
            ];
            return arr;
        })
        .enter().append("td");

        let texts = td.filter(function(d) {
            return d.vis == "text";
        });

        texts.text(function(d){
            return d.value;
        });

        let freqs = td.filter(function(d) {
            return d.vis == "freq";
        });
        let _freq_scale = this.freq_scale;
        freqs.append("svg")
            .attr("width",200)
            .attr("height",20)
            .append("rect")
            .attr("x",0)
            .attr("y",20)
            .attr("height",20)
            .attr("width",function(d){
                console.log("freq: " + d);
                console.log(_freq_scale(d.value));
                return _freq_scale(d.value);
            })
            .attr("fill","black");

        let percents = td.filter(function(d){
            return d.vis == "percent";
        });

        percents.text(function(d){
            return "D: " + d.value[0] + " |  R: " + d.value[1];
        });
    }
}