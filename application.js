"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var http_1 = require('@angular/http');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
require('rxjs/add/operator/map');
var GridSize = 8;
function forEachIndex(count, callback) {
    for (var idx = 0; idx < count; idx += 1) {
        callback(idx);
    }
}
function mapByIndex(count, callback) {
    var items = new Array(count);
    forEachIndex(count, function (idx) {
        items[idx] = callback(idx);
    });
    return items;
}
var PixelGrid = (function () {
    function PixelGrid(http) {
        var _this = this;
        this.http = http;
        this.isMouseButtonDown = false;
        this.gridSize = GridSize;
        this.result = null;
        this.requestError = null;
        this.rows = new Array(GridSize);
        this.cols = new Array(GridSize);
        forEachIndex(GridSize, function (idx) {
            _this.rows[idx] = idx;
            _this.cols[idx] = idx;
        });
        this.clearGrid();
    }
    PixelGrid.prototype.onMouseDown = function () {
        this.isMouseButtonDown = true;
    };
    PixelGrid.prototype.onMouseUp = function () {
        this.isMouseButtonDown = false;
    };
    PixelGrid.prototype.selectPixel = function (row, col, select) {
        if (select === void 0) { select = false; }
        if (this.isMouseButtonDown || select) {
            this.grid[row * GridSize + col] = true;
        }
    };
    PixelGrid.prototype.clearGrid = function () {
        var _this = this;
        this.grid = new Array(GridSize * GridSize);
        forEachIndex(GridSize * GridSize, function (idx) {
            _this.grid[idx] = false;
        });
        this.result = null;
        this.requestError = null;
    };
    PixelGrid.prototype.submitGrid = function () {
        var _this = this;
        var columnNames = mapByIndex(GridSize * GridSize + 1, function (idx) {
            var paramIdx = "0" + (idx + 1);
            return "p" + paramIdx.substr(paramIdx.length - 2);
        });
        columnNames[GridSize * GridSize] = "digit";
        var values = mapByIndex(GridSize * GridSize + 1, function (idx) {
            return _this.grid[idx] ? 16 : 0;
        });
        values[GridSize * GridSize] = 0;
        var request = {
            inputs: {
                input1: {
                    columnNames: columnNames,
                    values: [values]
                }
            },
            globalParameters: {}
        };
        console.log('-----Request------');
        console.log(JSON.stringify(request, null, 2));
        this.postRequest(request);
    };
    PixelGrid.prototype.postRequest = function (request) {
        var _this = this;
        var url = 'https://ussouthcentral.services.azureml.net/workspaces/b02f57e6c1ae4146b31c7555455e466b/services/a5477f0dd0884f7cbf84cab974650222/execute?api-version=2.0&details=true';
        var apiKey = 'pv+5e8YQQ0Qk0ArRZbUiHfLZNDbwIdbyixTWxBxAz2dQan3s+LybHvVu/cSl95FF069/UzSco678NQUqZm3+2A==';
        var body = JSON.stringify(request);
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + apiKey
        });
        var options = new http_1.RequestOptions({
            headers: headers
        });
        this.result = null;
        this.requestError = null;
        this.http
            .post(url, body, options)
            .map(function (res) { return res.json(); })
            .subscribe({
            next: function (value) {
                console.log('-----Response------');
                console.log(JSON.stringify(value, null, 2));
                var valuesList = value.Results.output1.value.Values[0];
                _this.result = valuesList[valuesList.length - 1];
            },
            error: function (error) {
                _this.requestError = error.json() || error;
            }
        });
    };
    __decorate([
        core_1.HostListener('document:mousedown', []), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PixelGrid.prototype, "onMouseDown", null);
    __decorate([
        core_1.HostListener('document:mouseup', []), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PixelGrid.prototype, "onMouseUp", null);
    PixelGrid = __decorate([
        core_1.Component({
            selector: 'pixel-grid',
            template: "\n        <div class=\"pixel-grid\">\n            <div *ngFor=\"let row of rows\">\n                <div *ngFor=\"let col of cols\"\n                     [ngClass]=\"{ selected: grid[row*gridSize+col] }\"\n                     (mousedown)=\"selectPixel(row, col, true)\"\n                     (mouseover)=\"selectPixel(row, col)\">\n                </div>\n            </div>\n        </div>\n        <div>\n            <button (click)=\"submitGrid()\">Submit</button>\n            <button (click)=\"clearGrid()\">Clear</button>\n        </div>\n        <div *ngIf=\"result\">\n            Azure ML says you entered a {{result}}\n        </div>\n        <div *ngIf=\"requestError\"><pre>{{requestError | json}}</pre></div>\n    "
        }), 
        __metadata('design:paramtypes', [http_1.Http])
    ], PixelGrid);
    return PixelGrid;
}());
var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            template: "\n        <h2>Draw a digit from 0 to 9</h2>\n        <pixel-grid></pixel-grid>\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, http_1.HttpModule],
            declarations: [AppComponent, PixelGrid],
            bootstrap: [AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
var platform = platform_browser_dynamic_1.platformBrowserDynamic();
platform.bootstrapModule(AppModule);
//# sourceMappingURL=application.js.map