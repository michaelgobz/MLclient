var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow;
var win = null;
app.on('ready', function () {
    createWindow();
});
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    if (win === null) {
        createWindow();
    }
});
function createWindow() {
    win = new BrowserWindow({ width: 800, height: 600 });
    win.loadURL("file://" + __dirname + "/index.html");
    win.on('closed', function () {
        win = null;
    });
    //win.webContents.openDevTools();
}
//# sourceMappingURL=main.js.map