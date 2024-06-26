// The url with data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Display the default plots
function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Fetch the JSON data and console log it
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // An array of id names
        let names = data.names;

        // Iterate through the names Array
        names.forEach((name) => {
            // Append each name as an option to the drop down menu
            // This is adding each name to the html file as an option element with value = a name in the names array
            dropdownMenu.append("option").text(name).property("value", name);
        });

        // Assign the first name to name variable
        let name = names[0];

        // Call functions to make the demographic panel, bar chart, and bubble chart
        demo(name);
        bar(name);
        bubble(name);
        gauge(name);
    });
}

// Make the demographics panel
function demo(selectedValue) {
    // Fetch the JSON data and console log it
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // An array of metadata objects
        let metadata = data.metadata;
        
        // Filter data where id = selected value after converting their types 
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
      
        // Assign the first object to obj variable
        let obj = filteredData[0]
        
        // Clear the child elements in div with id sample-metadata
        d3.select("#sample-metadata").html("");
  
        // Object.entries() is a built-in method in JavaScript 
        let entries = Object.entries(obj);
        
        // Iterate through the entries array
        // Add a h5 child element for each key-value pair to the div with id sample-metadata
        entries.forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        //make key values bold and first letter capital
            d3.select("#sample-metadata").selectAll("h5").style("text-transform", "capitalize").style("font-weight", "normal");
        // Change bbtype to Belly Button Type, and wfreq to Washing Frequency in Demo Panel
            d3.select("#sample-metadata").selectAll("h5").text(function(d) {
                return d3.select(this).text().replace("bbtype", "Belly Button Type").replace("wfreq", "Washing Frequency");
            }
        );
        
        });

        // Log the entries Array
        console.log(entries);
    });
  }
  

// Make the bar chart
function bar(selectedValue) {
    // Fetch the JSON data and console log it
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // An array of sample objects
        let samples = data.samples;

        // Filter data where id = selected value 
        let filteredData = samples.filter((sample) => sample.id === selectedValue);

        // Assign the first object to obj variable
        let obj = filteredData[0];
        
        // Trace for the data for the horizontal bar chart
        let trace = [{
            // Slice the top 10 otus
            x: obj.sample_values.slice(0,10).reverse(),
            y: obj.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: obj.otu_labels.slice(0,10).reverse(),
            type: "bar",
            marker: {
                color: "rgb(213, 225, 223)"
            },
            orientation: "h"
        }];
         // Define the layout
         let layout = {
            title: 'Top 10 Microbial Species Found (OTUs)', 
        };
        // Change title font and size to match the guage chart
        layout.title = {
            text: 'Top 10 Microbial Species Found (OTUs)',
            font: {
                size: 24,
                weight: 'bold'
            }
        };

        
        // Use Plotly to plot the data in a bar chart
        Plotly.newPlot("bar", trace, layout);
    });
}

  
// Make the bubble chart
function bubble(selectedValue) {
    // Fetch the JSON data and console log it
    d3.json(url).then((data) => {

        // An array of sample objects
        let samples = data.samples;
    
        // Filter data where id = selected value 
        let filteredData = samples.filter((sample) => sample.id === selectedValue);
    
        // Assign the first object to obj variable
        let obj = filteredData[0];
        
        // Trace for the data for the bubble chart
        let trace = [{
            x: obj.otu_ids,
            y: obj.sample_values,
            text: obj.otu_labels,
            mode: "markers",
            marker: {
                size: obj.sample_values,
                color: obj.otu_ids,
                colorscale: "Earth"
            }
        }];
    
        // Apply the x-axis lengend to the layout
        let layout = {
            title: {text: " Microbial Species Found (OTUs)"},
            font: {size: 24},
            xaxis: {title: "OTU ID"},

        };
    
        // Use Plotly to plot the data in a bubble chart
        Plotly.newPlot("bubble", trace, layout);
    });
}

// Make the gauge chart 
function gauge(selectedValue) {
    // Fetch the JSON data and console log it 
    d3.json(url).then((data) => {
        // An array of metadata objects
        let metadata = data.metadata;
        
        // Filter data where id = selected value after converting their types 
        // (bc meta.id is in integer format and selectValue from is in string format)
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
      
        // Assign the first object to obj variable
        let obj = filteredData[0]

        // Trace for the data for the gauge chart
        let trace = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: obj.wfreq,
            title: { text: "Belly Button Washing Frequency<br>Scrubs per Week", font: {size: 24}},
            type: "indicator", 
            mode: "gauge+number",
            gauge: {
                axis: {range: [null, 10]}, 
                bar: {color: "rgb(68,166,198)"},
                steps: [
                    { range: [0, 1], color: "rgb(213, 225, 223)" },
                    { range: [1, 2], color: "rgb(204, 219, 206)" },
                    { range: [2, 3], color: "rgb(195, 214, 190)" },
                    { range: [3, 4], color: "rgb(187, 208, 173)" },
                    { range: [4, 5], color: "rgb(178, 203, 156)" },
                    { range: [5, 6], color: "rgb(169, 197, 140)" },
                    { range: [6, 7], color: "rgb(160, 192, 123)" },
                    { range: [7, 8], color: "rgb(152, 186, 106)" },
                    { range: [8, 9], color: "rgb(143, 181, 90)" },
                    { range: [9, 10], color: "rgb(134, 175, 73)" }
                ]
            }
        }];

         // Use Plotly to plot the data in a gauge chart
         Plotly.newPlot("gauge", trace);
    });
}

// Toggle to new plots when option changed
function optionChanged(selectedValue) {
    demo(selectedValue);
    bar(selectedValue);
    bubble(selectedValue);
    gauge(selectedValue)
}

init();