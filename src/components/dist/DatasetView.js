"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.isOfTypeTabs = void 0;
var React = require("react");
var reactstrap_1 = require("reactstrap");
require("../App.css");
var WordCloud_1 = require("./WordCloud");
var RecordTable_1 = require("./RecordTable");
var KeywordCrumb_1 = require("./KeywordCrumb");
var DataLoader_1 = require("../models/DataLoader");
var CategoryPie_1 = require("./CategoryPie");
var core_1 = require("@material-ui/core");
var AmountSlider_1 = require("./AmountSlider");
var QueryBuilder_1 = require("../models/QueryBuilder");
var DateSlider_1 = require("./DateSlider");
var ExplanationText_1 = require("./ExplanationText");
var ContactSupport_1 = require("@material-ui/icons/ContactSupport");
var Email_1 = require("@material-ui/icons/Email");
function isOfTypeTabs(input) {
    return DataLoader_1.isOfTypeCategory(input) || ['table', 'keyword', "amount", "date"].includes(input);
}
exports.isOfTypeTabs = isOfTypeTabs;
var DatasetView = /** @class */ (function (_super) {
    __extends(DatasetView, _super);
    function DatasetView(props) {
        var _this = _super.call(this, props) || this;
        _this.value = 'keyword';
        _this.openTable = function () {
            _this.setState({ graphic: false });
        };
        _this.value = 'keyword';
        // this.parseQuery(QueryBuilder.getInstance().getQuery())
        _this.state = {
            value: _this.value,
            graphic: true
        };
        QueryBuilder_1["default"].getInstance().addGenerator(_this.generateQuery.bind(_this), 1);
        return _this;
    }
    DatasetView.prototype.componentDidMount = function () {
        var _this = this;
        this.props.loader.addChangeCallback(function () { return _this.forceUpdate(); });
    };
    DatasetView.prototype.parseQuery = function (query) {
        if (query[0] === '?')
            query = query.slice(1);
        var res = query.split('&').filter(function (e) { return e.startsWith('tab='); });
        if (res.length === 0)
            return 'table';
        var s = res[0].substr(4);
        if (isOfTypeTabs(s)) {
            return s;
        }
        else
            return 'table';
    };
    DatasetView.prototype.generateQuery = function () {
        return 'tab=' + this.value;
    };
    DatasetView.prototype.onTabChange = function (value) {
        this.value = isOfTypeTabs(value) ? value : 'table';
        this.setState({ value: this.value });
        QueryBuilder_1["default"].getInstance().update();
    };
    DatasetView.prototype.copyURL = function () {
        var selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = window.location.href;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        alert('Link Copied to Clipboard! (filters saved)');
    };
    DatasetView.prototype.render = function () {
        var _this = this;
        var loader = this.props.loader;
        return (React.createElement(React.Fragment, null,
            React.createElement("br", null),
            React.createElement("br", null),
            React.createElement("div", { style: { marginLeft: 30, marginRight: 30 } },
                React.createElement(KeywordCrumb_1["default"], { dataloader: loader })),
            React.createElement("br", null),
            React.createElement("br", null),
            React.createElement(reactstrap_1.Container, { style: { width: '80%', marginLeft: '10%', marginRight: '10%' } },
                React.createElement(reactstrap_1.Row, null,
                    React.createElement(reactstrap_1.Col, null,
                        React.createElement(RecordTable_1["default"], { dataloader: loader, onChange: this.onTabChange.bind(this), style: { backgroundColor: "lightblue" }, minimized: this.state.graphic, openTable: this.openTable }))),
                React.createElement(reactstrap_1.Row, null,
                    React.createElement(reactstrap_1.Col, null,
                        React.createElement(ExplanationText_1["default"], { hidden: !this.state.graphic, category: this.state.value }))),
                React.createElement("br", null),
                React.createElement(reactstrap_1.Row, null,
                    React.createElement(reactstrap_1.Col, null,
                        React.createElement("br", null),
                        React.createElement(WordCloud_1["default"], { hidden: this.state.value !== 'keyword' || !this.state.graphic, dataloader: loader }),
                        React.createElement(CategoryPie_1["default"], { hidden: !DataLoader_1.isOfTypeCategory(this.state.value) || !this.state.graphic, category: DataLoader_1.isOfTypeCategory(this.state.value) ? this.state.value : "fund", dataloader: loader }),
                        React.createElement(AmountSlider_1["default"], { hidden: this.state.value !== "amount" || !this.state.graphic, dataloader: loader }),
                        React.createElement(DateSlider_1["default"], { hidden: this.state.value !== 'date' || !this.state.graphic, dataloader: loader }))),
                React.createElement("br", null),
                React.createElement(reactstrap_1.Row, null,
                    React.createElement(reactstrap_1.Col, null,
                        React.createElement(core_1.Button, { style: { backgroundColor: "lightgray", fontWeight: 'bold', marginLeft: '45%', marginRight: '45%', width: '10%' }, onClick: function () { return _this.setState({ graphic: !_this.state.graphic }); } }, this.state.graphic ? React.createElement(React.Fragment, null, "View Table") : React.createElement(React.Fragment, null, "View Graphic"))))),
            React.createElement("br", null),
            React.createElement(reactstrap_1.Container, null,
                React.createElement(reactstrap_1.Row, null,
                    React.createElement(reactstrap_1.Col, null,
                        React.createElement("div", { style: { color: 'black', float: 'left' } },
                            React.createElement("a", { href: "mailto:vtran@asucla.ucla.edu", style: { padding: 20, color: 'black' } },
                                React.createElement(Email_1["default"], null),
                                " Professional Accountant"),
                            React.createElement("a", { href: "mailto:usacouncil@asucla.ucla.edu", style: { padding: 20, color: 'black' } },
                                React.createElement(Email_1["default"], null),
                                " USAC Council"),
                            React.createElement(core_1.Button, { style: { color: 'black', textDecoration: 'underline' }, onClick: this.copyURL, "aria-label": "share" }, "Copy link"),
                            React.createElement("a", { href: 'https://www.youtube.com/watch?v=1Bm70HP0zmM', target: "_blank" },
                                React.createElement(core_1.Button, { "aria-label": "share" },
                                    React.createElement(ContactSupport_1["default"], null),
                                    "Video"))))))));
    };
    return DatasetView;
}(React.Component));
exports["default"] = DatasetView;
