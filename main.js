const { app, BrowserWindow } = require('electron');
const path = require('path');

let ipcMain = require('electron').ipcMain;
let mainWindow = null;
//判断命令行脚本的第二参数是否含--debug
const debug = /--debug/.test(process.argv[2]);
function makeSingleInstance () {
    if (process.mas) return;
    app.requestSingleInstanceLock();
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })
}
function createWindow () {
    const windowOptions = {
        width: 400,
        height: 300,
        frame:false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }

        // webPreferences: {
        //     nodeIntegration: false,
        //     preload: __dirname + '/preload.js'
        // }
    };
    mainWindow = new BrowserWindow(windowOptions);
    mainWindow.loadURL("http://localhost:3002/");
    // mainWindow.loadURL(path.join('file://', __dirname, '/build/index.html'));
    //接收渲染进程的信息

    //接收最小化命令
    ipcMain.on('window-min', function() {
        mainWindow.minimize();
    })
//接收最大化命令
    ipcMain.on('window-max', function() {
        if (mainWindow.isMaximized()) {
            mainWindow.restore();
        } else {
            mainWindow.maximize();
        }
    })
//接收关闭命令
    ipcMain.on('window-close', function() {
        mainWindow.close();
    })

    const ipc = require('electron').ipcMain;
    ipc.on('min', function () {
        mainWindow.minimize();
    });
    ipc.on('max', function () {
        mainWindow.maximize();
    });
    ipc.on("login",function () {
        mainWindow.maximize();
    });
    //如果是--debug 打开开发者工具，窗口最大化，
    if (debug) {
        mainWindow.webContents.openDevTools();
        require('devtron').install();
    }

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}
makeSingleInstance();
//app主进程的事件和方法
app.on('ready', () => {
    // 主进程一ready就调用createWindow()函数来打开您的窗口
    createWindow();
});

// 当事件 window-all-closed 所有端口都关闭时，主进程关闭app.quit()
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

// 如果没有窗口就打开一个窗口，浏览器窗口嘛
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
module.exports = mainWindow;