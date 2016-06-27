// console.log("connected to app.js");

$(document).ready(function(){
  // Step 1: Read File
  $('#fileInput').on('change', function(e){
    readFile(e);
  });

  // Step 2: Process File Data into Objects
  $('#graphGenerator').on('click', function(e){
    $("#countsSubtitle, #originalSubtitle, pre").css("display", "block");
    var fileData = d3.csv.parse($('#data').text());

    // COMMENT:
    // This sorts the data by gender.
    // REF:
    // https://github.com/d3/d3/wiki/Arrays#nest
    // SRC:
    // http://learnjsdata.com/group_data.html
    var textByGender = d3.nest()
      .key(function(d) { return d.Gender; })
      .entries(fileData);

    // Step 3:
    generateGraphs(textByGender);
  });
});

// COMMENT:
// This reads the file and puts content in <pre>
// SRC:
// http://www.htmlgoodies.com/beyond/javascript/read-text-files-using-the-javascript-filereader.html#fbid=rLpXzsIw45U
function readFile(event) {
  // console.log(event);
  var file = event.target.files[0];
  // console.log(f);
  if(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var contents = e.target.result;
      $('#data').html(contents);
    };
    reader.readAsText(file);
    console.log("File loaded and closed");
  } else {
    console.log("Failed to load file");
  }
}

function generateGraphs(dataArray){
  var combinedResults = [];
  var keywords = [];
  $('#counts').empty();
  // for each gender, combine casenotes into an array
  dataArray.forEach(function(gender, i){
    var largeNote = "";
    gender.values.forEach(function(entry, i){
      largeNote += " " + entry.Case_Notes.toLowerCase();
    });
    // COMMENT: Removes punctuation
    // SRC: http://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex
    var punctuationless = largeNote.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    var finalString = punctuationless.replace(/\s{2,}/g," ");
    //
    var count = countWords(finalString);
    console.log('count', count);

    // COMMENT: To sort by keys for an object
    // SRC: http://stackoverflow.com/questions/9658690/is-there-a-way-to-sort-order-keys-in-javascript-objects
    // Object.keys(temp1)
    //   .sort()
    //   .forEach(function(v, i) {
    //       console.log(v, temp1[v]);
    //    });

    keywords = $('#keywords').val().toLowerCase().split(', ');
    result = filterByKeyword(count,keywords);
    console.log('result',result);
    combinedResults.push(result);
    $("#counts").append("<h4>" + gender.key + "</h4><p>" + JSON.stringify(count) + "/<p>");
    $("#counts").append("<p><em>Filtered</em>: " + JSON.stringify(result) + "</p>");
  });

  // next things
  console.log(combinedResults);
  chartGeneration(dataArray, combinedResults, keywords);
}

function countWords(dataString){
  var words = dataString.split(" ");
  var frequencies = {};
  // initializes all keys to have a value = 0
  words.forEach(function(val,i){
    frequencies[val] = 0;
  });
  // counts up the values and updates frequencies
  words.forEach(function(val,i){
    frequencies[val] += 1;
  });
  return frequencies;
}

function filterByKeyword(wordsArray, keywordsArray){
  var filtered = {};
  for(var key in keywordsArray){
    console.log("in for loop");

    filtered[keywordsArray[key]] = wordsArray[keywordsArray[key]];
    if(wordsArray[keywordsArray[key]] === undefined){
      filtered[keywordsArray[key]] = 0;
    }
  }
  return filtered;
}

function chartGeneration(dataArray, combinedResults, keywords){
  console.log("dataArray", dataArray);
  console.log("combinedResults", combinedResults);
  console.log('keywords', keywords);
  var columnsForChart = [];
  var categoriesForChart = Object.keys(combinedResults[0]);
  // dataArray.forEach(function (gender, i) {
  //   var newColumn = [];
  //   newColumn.push(gender.key);
  //   for(var key in combinedResults[])
  //   columnsForChart.push(newColumn);
  // });


  // push an array to columnsForChart lik ['gender', values tabulated] for each gender
  // values tablulated can be gotten from combined results objects one at a time

  // for each word being analyzed
  //    add values for words to correct gender
  //    add gender string at front of array

  combinedResults.forEach(function (value, i) {
    var newColumn = [];
    newColumn.push(dataArray[i].key);
    console.log('value',value);
    for(var j=0; j<keywords.length; j++){
      newColumn.push(combinedResults[i][keywords[j]]);
    }
    columnsForChart.push(newColumn);
  });

  console.log(columnsForChart);

  var chart = c3.generate({
      data: {
          columns: columnsForChart,
          type: 'bar'
      },
      bar: {
          width: {
              ratio: 0.5 // this makes bar width 50% of length between ticks
          }
          // or
          //width: 100 // this makes bar width 100px
      },
      axis: {
          x: {
            type: 'category',
            categories: categoriesForChart
          }
      }
  });

  setTimeout(function () {
      chart.load();
  }, 1000);
}
