//function that filters and creates html elements for new data
function metaData(sample) {
    d3.json("http://localhost:8000/StarterCode/samples.json").then((data) => {
        console.log(data);
        var metadata = data.metadata;
        var outputArray = metadata.filter(sampleObject => sampleObject.id == sample);
        var output = outputArray[0];
        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");
        Object.entries(output).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

// Function to create horizontal bar chart
function createChart(sample) {
    d3.json("http://localhost:8000/StarterCode/samples.json").then((data) => {
        var samples = data.samples;
        var outputArray = samples.filter(sampleObject => sampleObject.id == sample);
        var output = outputArray[0];
        var sample_values = output.sample_values;
        var otu_ids = output.otu_ids;
        var otu_labels = output.otu_labels;
        //Construct horizontal bar chart for the most common otu's found in each individual
        //Bar chart
        var barData = [{
            type: "bar",
            x: sample_values.slice(0, 10).reverse(), 
            y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            orientation: "h"
        }];

        var barlayout = {
            title: "Most Common OTU's per Individual",
            margin: {t: 50, l: 100}
        };

        Plotly.newPlot("bar", barData, barlayout);

        //Bubble chart
        var trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                color: otu_ids,
                size: sample_values,
            }
        };

        var data = [trace1];

        var layout = {
            title: "Distribution of OTU's",
            showlegend: false,
            height: 600,
            width: 600,
            xaxis: {
                title:{
                    text: "OTU ids"
                }
            },
            yaxis: {
                title: {
                    text: "Sample Values"
                }
            }
        };

        Plotly.newPlot("bubble", data, layout);

    });
}

//create function init
function init() {
    var dropdownMenu = d3.select("#selDataset");
    d3.json("http://localhost:8000/StarterCode/samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            dropdownMenu.append("option").text(sample).property("value", sample);
        });
    var defaultSample = sampleNames[0];
    createChart(defaultSample);
    metaData(defaultSample);
    });
}

//Function to show data for new sample
// function optionChanged(testSubject) {
//     //create a variable to reference the dropdown where test subject can be changed
//     var menuOption = d3.select("#selDataset");
//     //create variable to select value for whatever user puts into this field
//     var userSelection = menuOption.property("value");
//     //run metadata and create chart function fors the new user choice
//     metaData(userSelection);
//     createChart(userSelection);
// };

// // //Event handler if id has changed
// userSelection.on("change", optionChanged(userSelection));

init();