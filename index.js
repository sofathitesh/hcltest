/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html');
require('./site/style.css');
const util = require('util')
const drawTableWithRealTimeUpdate = require('./es6/realTimeUpdateTable');
global.DEBUG = false;

const url = "ws://localhost:8011/stomp";
const client = Stomp.client(url);
client.debug = function (msg) {
  if (global.DEBUG) {
    util.info(msg)
  }
}
const renderTableDivision = document.getElementById("render-table");
const tableHeaderTitles = ['Name', 'Best Bid', 'Best Ask', 'Open Bid', 'Open Ask', 'Last Changed Ask', 'Last Change Bid', 'Spark Link Data'];
try {
  drawTableWithRealTimeUpdate.drawTableBody(tableHeaderTitles, renderTableDivision);
} catch (error) {
  util.log(error);
}
/**
 * connectCallback helps to connect with stomp server and helps to get the data
 */

function connectCallback() {
  client.subscribe('/fx/prices', function (response) {
    const data = JSON.parse(response.body);
    try {
      drawTableWithRealTimeUpdate.storeStockDataFromStomp(data);
    } catch (error) {
      util.log(error);
    }
  })
  try {
    setInterval(function () {
      drawTableWithRealTimeUpdate.cleanSparkLineData(drawTableWithRealTimeUpdate.stockTableData);
    }, 30000);
  } catch (error) {
    util.log(error);
  }
}

/**
 * connect is init the connection with stomp server
 */
client.connect({}, connectCallback, function (error) {
  util.log(error.headers.message);
})


