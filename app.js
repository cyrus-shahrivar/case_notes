// console.log("connected to app.js");

$(document).ready(function(){
  $('#fileInput').on('change', function(e){
    readFile(e);
  });

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
    //
    console.log(textByGender);
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
    console.log(count);

    // COMMENT: To sort by keys for an object
    // SRC: http://stackoverflow.com/questions/9658690/is-there-a-way-to-sort-order-keys-in-javascript-objects
    // Object.keys(temp1)
    //   .sort()
    //   .forEach(function(v, i) {
    //       console.log(v, temp1[v]);
    //    });

    var keywords = $('#keywords').val().toLowerCase().split(', ');
    var result = filterByKeyword(count,keywords);
    console.log(result);
    $("#counts").append("<h4>" + gender.key + "</h4><p>" + JSON.stringify(count) + "/<p>");
    $("#counts").append("<p><em>Filtered</em>: " + JSON.stringify(result) + "</p>");
  });

  // next things
}

function countWords(dataString){
  var words = dataString.split(" ");
  var frequencies = {};
  words.forEach(function(val,i){
    frequencies[val] = 0;
  });
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
  }
  return filtered;
}
