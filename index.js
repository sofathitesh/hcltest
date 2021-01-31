/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html')
// Apply the styles in style.css to the page.
require('./site/style.css')
var tableData = require('./realtimeUpdate').tableData;
// if you want to use es6, you can do something like
//require('./es6/myEs6code')
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library
global.DEBUG = false

const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url)
client.debug = function(msg) {
  if (global.DEBUG) {
    console.info(msg)
  }
}

tableData.drawTableUI();
tableData.drawTableHeader();
tableData.drawTableBody();
const exampleSparkline = document.getElementById('example-sparkline')
function connectCallback() {
  document.getElementById('stomp-status').innerHTML = "It has now successfully connected to a stomp server serving price updates for some foreign exchange currency pairs."
  client.subscribe('/fx/prices', function(response) {
    var data = JSON.parse(response.body);
    tableData.storeStockDataFromStomp(data);
  })
  setInterval(function(){
    tableData.cleanSparkLineDataAfter30000Sec(tableData.stockTableData);
  },30000);

}

client.connect({}, connectCallback, function(error) {
  alert(error.headers.message)
})

