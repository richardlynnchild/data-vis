/** Class representing a Tree. */
class Tree {
    /**
     * Creates a Tree Object
     * Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
     * note: Node objects will have a name, parentNode, parentName, children, level, and position
     * @param {json[]} json - array of json objects with name and parent fields
     */
    constructor(json) {
        this.nodeId = 0;
        let tempNodes = [];
        json.forEach(function(d){
            // Create the new Node
            let node = new Node(d.name,d.parent);
            tempNodes.push(node);
            // Search for parent Node object and make a reference
            tempNodes.forEach(function(n){
                if (n.name == node.parentName){
                    node.parentNode = n;
                }
            });
        });
        this.nodes = tempNodes.slice(0);
    }

    /**
     * Function that builds a tree from a list of nodes with parent refs
     */
    buildTree() {
        // Add child links for each parent
        for(let node of this.nodes){
            if (node.parentNode != null){
                let parent = node.parentNode
                parent.addChild(node);
            }
        }
        for(let node of this.nodes){
            if (node.parentName == "root"){
                this.assignLevel(node,0);
                this.assignPosition(node,0);
            }
        }
    }

    /**
     * Recursive function that assign levels to each node
     */
    assignLevel(node, level) {
        if (node.parentNode == null) {
            node.level = 0;
        }
        else {
            node.level = node.parentNode.level+1
        }
        if (node.children.length == 0){
            return
        }
        else {
            for (let child of node.children) {
                this.assignLevel(child,0);
            }
        }
        
    }

    /**
     * Recursive function that assign positions to each node
     */
    assignPosition(node, position) {
        let childPosition = 0;
        if(node.children.length == 0){
            node.position = node.level*100+this.nodeId++;
            return node.position;
        }
        for(let child of node.children){
            childPosition = this.assignPosition(child,position);
            if (node.position == -1){
                node.position = childPosition-100;
            }
        }
        return node.position;
    }

    /**
     * Function that renders the tree
     */
    renderTree() {
        // Append the SVG
        let body = d3.select("body");
        body.append("svg").attr("height",1600).attr("width",1200);
        
        let sortedNodes = this.nodes.sort((a,b)=> b.position - a.position);

        let svg = d3.select("svg");

        let edges = svg.selectAll("line").data(this.nodes);
        edges
            .join("line")
            .attr("x1",(d)=>d.level*200+50)
            .attr("y1",(d)=>d.position%100*100+50)
            .attr("x2",function (d) {
                if(d.parentNode == null){
                    return d.level*200+50;
                }
                else {
                    return d.parentNode.level*200+50;
                }
            })
            .attr("y2", function (d) {
                if(d.parentNode == null){
                    return d.position%100*100+50;
                }
                else {
                    return d.parentNode.position%100*100+50;
                }
            });

        let groups = svg.selectAll("g").data(sortedNodes);
        groups
            .join("g")
            .classed("nodeGroup",true)
            .attr("transform",(d)=> 
                "translate("+
                (d.level*200).toString()+
                ","+((d.position%100)*100).toString()+")");

        svg.selectAll("g").data(sortedNodes)
            .append("circle")
            .attr("cx",50)
            .attr("cy",50)
            .attr("r",50);

        svg.selectAll("g").data(sortedNodes)
            .append("text")
            .classed("label",true)
            .attr("x",50)
            .attr("y",50)
            .text((d)=>d.name);

        
        
    }

}