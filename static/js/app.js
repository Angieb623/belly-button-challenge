


// function that populates meta data
function demoInfo(sample)
{
    //console.log(sample);

    // use d3.json to get data 
    d3.json("samples.json").then((data) => {
        
        // get metadata
        let metaData = data.metadata;
        //console.log(metaData);

        // filter based on the value of the sample (returns 1 result from dataset)
        let result = metaData.filter(sampleResult => sampleResult.id == sample);
        //console.log(result);

        // access index 0 from the array
        let resultData = result[0];
        //console.log(resultData);

        // clear the metadata out
        d3.select("#sample-metadata").html(""); //clears out the html

        // use Object.entries to get the value key pairs
        Object.entries(resultData).forEach(([key, value]) =>{
            // add to the sample data / demographics section
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`);
        });
    
    });
}

// function that builds graphs
function buildBarChart(sample)
{
    //console.log(sample);

    //let data = d3.json("samples.json");
    //console.log(data)

    // use d3.json to get data
    d3.json("samples.json").then((data) => {
        
        // get sample data
        let sampleData = data.samples;
        //console.log(sampleData);

        // filter based on the value of the sample (returns 1 result from dataset)
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        //console.log(result);

        // access index 0 from the array
        let resultData = result[0];
        //console.log(resultData);

        // retrieve otu_ids, labels, and sample_values from data
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;
        // console.log(otu_ids);
        // console.log(otu_labels);
        // console.log(sample_values);

        // build bar chart
        // get y ticks
        let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`)
        //console.log(yticks);

        // get x values
        let xValues = sample_values.slice(0, 10);
        //console.log(xValues)

        // get labels
        let textLabels = otu_labels.slice(0, 10);
        //console.log(textLabels)

        // create bar chart
        let barChart = {
            y: yticks.reverse(),
            x: xValues.reverse(),
            text: textLabels.reverse(),
            type: "bar",
            orientation: "h"
        }

        let layout = {
            title: "Top 10 Belly Button Bacteria"
        };

        Plotly.newPlot("bar", [barChart], layout);
    
    });
}

// function that builds bubble chart
function buildBubbleChart(sample)
{
    //console.log(sample);

    //let data = d3.json("samples.json");
    //console.log(data)

    // use d3.json to get data
    d3.json("samples.json").then((data) => {
        
        // get sample data
        let sampleData = data.samples;

        // filter based on the value of the sample (returns 1 result from dataset)
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);

        // access index 0 from the array
        let resultData = result[0];

        // retrieve otu_ids, labels, and sample_values from data
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;
    

        // build bubble chart
        let bubbleChart = {
            y: sample_values,
            x: otu_ids,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "RdBu"
            }
        }

        let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
        };

        Plotly.newPlot("bubble", [bubbleChart], layout);
    
    });
}

// function that initializes dashboard
function initialize()
{
  
    //let data = d3.json("samples.json");
    //console.log(data)

    // access the dropdown selector from the index.html file
    var select = d3.select("#selDataset");

    // use d3.json to get data and make an array of the Names
    d3.json("samples.json").then((data) => {
        let sampleNames = data.names;
        // console.log(sampleNames);

        // use foreach to create options for each sample in the selector
        sampleNames.forEach((sample) => {
            select.append("option")
                .text(sample)
                .property("value", sample);
        });

        // pass in information for the first sample by initializing
        let sample1 = sampleNames[0];

        // call on function to build metadata
        demoInfo(sample1);

        // call on function to build bar chart
        buildBarChart(sample1);

        // call on function to build bubble chart
        buildBubbleChart(sample1);
    });
}

// function that updates dashboard
function optionChanged(item)
{
    // call the udpate to the metadata
    demoInfo(item);

    // call on function to build the bar chart
    buildBarChart(item);

    // call on function to build the bubble chart
    buildBubbleChart(item);
}

// call the initialize function
initialize();