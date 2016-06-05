console.log("connected to app.js");

$(document).ready(function(){
  $('#fileInput').on('change', function(e){
    readFile(e);
  });
  $('#button').on('click', function(e){
    //console.log($('#data').text());
    var fileData = d3.csv.parse($('#data').text());
    console.log(fileData);
    // this sorts the data by gender
    // https://github.com/d3/d3/wiki/Arrays#nest
    var textByGender = d3.nest()
      .key(function(d) { return d.Gender; })
      .entries(fileData);
    console.log(textByGender);
  });
});


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
