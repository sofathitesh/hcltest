const { storeStockDataFromStomp, drawTableBody, cleanSparkLineData } = require('../es6/realTimeUpdateTable');
let Sparkline = require('../site/sparkline');

describe("testing of real time update table library", () => {
    document.body.innerHTML = `
        <body><div id='render-table'></div></body>
    `;

    jest.mock('../es6/realTimeUpdateTable', () => ({
        __esModule: true,
        drawTableBody: jest.fn(),
        storeStockDataFromStomp: jest.fn(),
        cleanSparkLineData: jest.fn()
    }));
    Sparkline.draw = jest.fn().mockReturnValue({});
    const tableDiv = document.getElementById("render-table");
    const mockData = {
        name: "usdjpy",
        bestBid: 103.21114145765866,
        bestAsk: 107.1599320873262,
        openBid: 106.52439195673573,
        openAsk: 110.48560804326426,
        lastChangeAsk: -3.325675955938067,
        lastChangeBid: -3.3132504990770713
    }
    test('test dom creation', () => {
        const headerTitle = ['Name', 'Best Bid', 'Best Ask', 'Open Bid', 'Open Ask', 'Last Changed Ask', 'Last Change Bid', 'Spark Link Data'];
        expect(drawTableBody(headerTitle, tableDiv)).toBe(undefined);
    })
    test('test for functions those creat the table body', () => {
        expect(storeStockDataFromStomp(mockData)).toBe(undefined);
        expect(storeStockDataFromStomp(mockData)).toBe(undefined);
        mockData.name = 'rrr';
        mockData.lastChangeBid = 3;
        expect(storeStockDataFromStomp(mockData)).toBe(undefined);
    })
    test('test for spark line object clean', () => {
        const mockDataForSparkLine = { "usdjpy": [{ "sparklineData": [] }] };
        expect(cleanSparkLineData(mockDataForSparkLine)).toBe(undefined);
    })

});