module.exports = { tableData:(function (){
    var stockTableData = {};
    var tableDiv = document.getElementById("render-table");
    var table = document.createElement("table");
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');
    var tableHeaderRow = document.createElement('tr');
    var setIntervalFlag = false;
    var counter = 0;
    function drawTableUI(){
      tableDiv.appendChild(table);
    }
    function drawTableBody() {
      table.appendChild(thead);
      table.appendChild(tbody);
    }
    function drawTableHeader(){
      var headingTitle = ['Name','Best Bid','Best Ask','Open Bid','Open Ask','Last Changed Ask', 'Last Change Bid','Spark Link Data'];
      for(var headerCounter = 0; headerCounter < headingTitle.length; headerCounter++) {
        var tableHeading = document.createElement('th');
        tableHeading.appendChild(document.createTextNode(headingTitle[headerCounter]));
        tableHeaderRow.appendChild(tableHeading);
      }
      thead.appendChild(tableHeaderRow);
    }
    function drawTableBodyData(data, rowId){
      var objkeys = Object.keys(data);
      var dataRows = document.createElement('tr');
      for(var i = 0; i < objkeys.length; i++){
        var tableBodyValueElement = document.createElement('td');
        if(objkeys[i] !== 'sparklineData'){
          tableBodyValueElement.id = rowId+i;
          tableBodyValueElement.appendChild(document.createTextNode(data[objkeys[i]]));
          dataRows.appendChild(tableBodyValueElement);
        }else{
          var createSparklineDiv = document.createElement('div');
          createSparklineDiv.id= rowId+i;
          tableBodyValueElement.appendChild(createSparklineDiv);
          dataRows.appendChild(tableBodyValueElement);
        }
      }
      tbody.appendChild(dataRows);
    }
    function updateTableDataRealTime(data){
      var mainObjKeys = Object.keys(data);
      for(var tableDataCounter = 0; tableDataCounter < mainObjKeys.length; tableDataCounter++){
      var divKeys = Object.keys(data[mainObjKeys[tableDataCounter]]);
      for(var i = 0; i < divKeys.length; i++){
        if(document.getElementById("r"+tableDataCounter+i)){
          if(divKeys[i] !== 'sparklineData'){
            document.getElementById("r"+tableDataCounter+i).innerText = data[mainObjKeys[tableDataCounter]][divKeys[i]];
          }else{
            Sparkline.draw(document.getElementById("r"+tableDataCounter+i), data[mainObjKeys[tableDataCounter]][divKeys[i]]);   
          }
        }
      }
    }
    }
    function storeStockDataFromStomp(data){
      if(stockTableData[data.name]){
        stockTableData[data.name] = {
          "name": data.name,
          "bestBid": parseFloat(data.bestBid).toFixed(2),
          "bestAsk": parseFloat(data.bestAsk).toFixed(2),
          "openBid": parseFloat(data.openBid).toFixed(2),
          "openAsk": parseFloat(data.openAsk).toFixed(2),
          "lastChangeAsk": parseFloat(data.lastChangeAsk).toFixed(2),
          "lastChangeBid": parseFloat(data.lastChangeBid).toFixed(2),
          "sparklineData": stockTableData[data.name]["sparklineData"] || []
        };
        stockTableData[data.name]["sparklineData"].push(data.bestBid + data.bestAsk / 2);
        updateTableDataRealTime(sortTableByLastBidChange(stockTableData));
      }else{
      stockTableData[data.name] = stockTableData[data.name] || {};
      stockTableData[data.name] = {
        "name": data.name,
        "bestBid": parseFloat(data.bestBid).toFixed(2),
        "bestAsk": parseFloat(data.bestAsk).toFixed(2),
        "openBid": parseFloat(data.openBid).toFixed(2),
        "openAsk": parseFloat(data.openAsk).toFixed(2),
        "lastChangeAsk": parseFloat(data.lastChangeAsk).toFixed(2),
        "lastChangeBid": parseFloat(data.lastChangeBid).toFixed(2),
        "sparklineData": stockTableData[data.name]["sparklineData"] || []
      };
      stockTableData[data.name]["sparklineData"].push(data.bestBid + data.bestAsk / 2);
      sortTableByLastBidChange(stockTableData);
      drawTableBodyData(stockTableData[data.name],"r"+counter++);  
      }    
    }
    function cleanSparkLineDataAfter30000Sec(data){
        var keys = Object.keys(data);
        for(var i = 0; i < keys.length; i++){
            data[keys[i]]['sparklineData'] = [];
        }
    }
    function sortTableByLastBidChange(data) {
      var dummyArray = []; 
      var keys = Object.keys(data);
      for(var sortCounter = 0; sortCounter < keys.length; sortCounter++){
        dummyArray.push(data[keys[sortCounter]]);
      }
      dummyArray.sort(function(a,b) {
        return b.lastChangeBid - a.lastChangeBid;
      })
      data = {};
      for(var sortCounter = 0; sortCounter < dummyArray.length; sortCounter++){
        data[dummyArray[sortCounter].name] = data[sortCounter.name] || dummyArray[sortCounter];
      }
      return data;
    }
    return {
      stockTableData: stockTableData,  
      storeStockDataFromStomp: storeStockDataFromStomp,
      drawTableUI: drawTableUI,
      drawTableBody: drawTableBody,
      drawTableHeader: drawTableHeader,
      drawTableBodyData: drawTableBodyData,
      sortTableByLastBidChange: sortTableByLastBidChange,
      cleanSparkLineDataAfter30000Sec: cleanSparkLineDataAfter30000Sec
    }
  })()
}