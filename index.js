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
drawTableWithRealTimeUpdate.drawTableBody(tableHeaderTitles, renderTableDivision);

/**
 * connectCallback helps to connect with stomp server and helps to get the data
 */

function connectCallback() {
  client.subscribe('/fx/prices', function (response) {
    const data = JSON.parse(response.body);
    drawTableWithRealTimeUpdate.storeStockDataFromStomp(data);
  })
  setInterval(function () {
    drawTableWithRealTimeUpdate.cleanSparkLineData(drawTableWithRealTimeUpdate.stockTableData);
  }, 30000);

}

/**
 * connect is init the connection with stomp server
 */
client.connect({}, connectCallback, function (error) {
  util.log(error.headers.message);
})


