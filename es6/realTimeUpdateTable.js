/**
 * RealTimeUpdate table library helps us to create table.
 * Every time its auto update the table based on data.
 * Sorting happens with every data call
 * Spark line also shows the fluctuation of data changes in best bid and best ask 
 * @param {object} stockTableData
 * @param {object} tableDiv
 * @param {Object} table
 * @param {Object} thead
 * @param {Object} tbody
 * @param {Object} tableHeaderRow
 * @param {number} counter
 */

module.exports = (function () {
    let stockTableData = {};
    let tableDiv = document.getElementById("render-table") || undefined;
    let table = document.createElement("table") || undefined;
    let thead = document.createElement('thead') || undefined;
    let tbody = document.createElement('tbody') || undefined;
    let tableHeaderRow = document.createElement('tr') || undefined;
    let counter = 0;
    /**
     * drawTableUI helps to create the table tag and insert that tag into DOM
     */
    const drawTableUI = () => {
        tableDiv.appendChild(table);
    }
    /**
     * drawTableHeader helps to create header of table and append that header object into dom
     * @param {Array} headerTitle 
     */
    const drawTableHeader = (headerTitle = []) => {
        headerTitle && headerTitle.map((titles) => {
            let tableHeading = document.createElement('th');
            tableHeading.appendChild(document.createTextNode(titles));
            tableHeaderRow.appendChild(tableHeading);
        })
        thead.appendChild(tableHeaderRow);
    }
    /**
     * drawTableBody helps to create table body and header then inserts the final object into dom
     * @param {Array} headerTitle 
     */
    const drawTableBody = (headerTitle = []) => {
        if (tableDiv && table) {
            drawTableUI();
            drawTableHeader(headerTitle);
            table.appendChild(thead);
            table.appendChild(tbody);
        }
    }
    /**
     * drawTableBodyData helps to create the TR and TD structure with data
     * @param {Object} data 
     * @param {String} rowId 
     */
    const drawTableBodyData = (data, rowId) => {
        const objkeys = Object.keys(data);
        const dataRows = document.createElement('tr');
        for (let i = 0; i < objkeys.length; i++) {
            const tableBodyValueElement = document.createElement('td');
            if (objkeys[i] !== 'sparklineData') {
                tableBodyValueElement.id = rowId + i;
                tableBodyValueElement.appendChild(document.createTextNode(data[objkeys[i]]));
            } else {
                const createSparklineDiv = document.createElement('div');
                createSparklineDiv.id = rowId + i;
                tableBodyValueElement.appendChild(createSparklineDiv);
            }
            dataRows.appendChild(tableBodyValueElement);
        }
        tbody.appendChild(dataRows);
    }
    /**
     * updatetableDataRealTime helps to update the table data after getting the data
     * @param {Object} data 
     */
    const updateTableDataRealTime = (data) => {
        const mainObjKeys = Object.keys(data);
        mainObjKeys && mainObjKeys.map((parentValue, parentIndex) => {
            let divKeys = Object.keys(data[parentValue]);
            divKeys && divKeys.map((childObjValue, childIndex) => {
                if (document.getElementById("r" + parentIndex + childIndex)) {
                    if (childObjValue !== 'sparklineData') {
                        document.getElementById("r" + parentIndex + childIndex).innerText = data[parentValue][childObjValue];
                    } else {
                        Sparkline.draw(document.getElementById("r" + parentIndex + childIndex), data[parentValue][childObjValue]);
                    }
                }
            })
        })
    }
    /**
     * setTableObjectData helps to update the main object and return that object 
     * @param {Object} data 
     */
    const setTableObjectData = (data) => {
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
        return stockTableData[data.name];
    }
    /**
     * storeStockDataFromStomp is getting the data from stomp and storing the data into main object
     * Represent that data into table structure
     * Sort the data after getting new updated values
     * @param {Object} data 
     */
    const storeStockDataFromStomp = (data) => {
        if (stockTableData[data.name]) {
            stockTableData[data.name] = setTableObjectData(data);
            updateTableDataRealTime(sortTableByLastBidChange(stockTableData));
        } else {
            stockTableData[data.name] = stockTableData[data.name] || {};
            stockTableData[data.name] = setTableObjectData(data);
            sortTableByLastBidChange(stockTableData);
            drawTableBodyData(stockTableData[data.name], "r" + counter++);
        }
    }
    /**
     * cleanSparkLineDataAfter30000Sec cleaning the spark line data after 30 sec.
     * @param {Object} data 
     */
    const cleanSparkLineDataAfter30Sec = (data) => {
        let keys = Object.keys(data);
        keys && keys.map((value) => {
            data[value]['sparklineData'] = [];
        })
    }
    /**
     * sortTableByLastBidChange helps to sort the data of table according to new data values 
     * @param {Object} data 
     */
    const sortTableByLastBidChange = (data) => {
        let dummyArray = [];
        let keys = Object.keys(data);
        keys && keys.map((value) => {
            dummyArray.push(data[value]);
        })
        dummyArray.sort(function (a, b) {
            return b.lastChangeBid - a.lastChangeBid;
        })
        data = {};
        dummyArray && dummyArray.map((sortedValues, index) => {
            data[sortedValues.name] = data[sortedValues.name] || dummyArray[index];
        })
        return data;
    }
    return {
        stockTableData: stockTableData,
        storeStockDataFromStomp: storeStockDataFromStomp,
        drawTableBody: drawTableBody,
        cleanSparkLineDataAfter30Sec: cleanSparkLineDataAfter30Sec
    }
})();