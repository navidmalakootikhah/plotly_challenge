// Main Function
function getPlot(id) {
    d3.json("samples.json").then((data)=> {
        console.log(data)
  
        var wfreq = data.metadata.map(d => d.wfreq)
        console.log(`Washing Freq: ${wfreq}`)
        
        // filter ids
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        console.log(samples);
  
        // top 10 
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        
        // get the otu id's to the desired form for the plot
        var OTU_id = OTU_top.map(d => "OTU " + d)
  
      //   console.log(`OTU IDS: ${OTU_id}`)
  
  
        // get the top 10 labels for the plot
        var labels = samples.otu_labels.slice(0, 10);
  
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            type:"bar",
            orientation: "h",
        };
  
        var data = [trace];
  
        var layout = {
            title: "Top 10",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 300,
                r: 300,
                t: 120,
                b: 50
            }
        };
        Plotly.newPlot("bar", data, layout);
      
        // Bubble Plot
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
  
        };
  
        
        var layout_b = {
            xaxis:{title: "OTU ID"},
            height: 500,
            width: 800
        };

        var data1 = [trace1];
        Plotly.newPlot("bubble", data1, layout_b); 
  
 
      });
  }  
// obtain data
function getInfo(id) {
    d3.json("samples.json").then((data)=> {
        
        var metadata = data.metadata;
        console.log(metadata)

        // filter by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];
        var demographicInfo = d3.select("#sample-metadata");
        
        // Remove demographic info to get new id
        demographicInfo.html("");

        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}


function init() {
    // dropdown
    var dropdown = d3.select("#selDataset");
    d3.json("samples.json").then((data)=> {
        console.log(data)

        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();