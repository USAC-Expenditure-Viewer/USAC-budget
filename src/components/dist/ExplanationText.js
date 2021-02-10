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
var react_1 = require("react");
var Info_1 = require("@material-ui/icons/Info");
var core_1 = require("@material-ui/core");
var ExplanationText = /** @class */ (function (_super) {
    __extends(ExplanationText, _super);
    function ExplanationText(props) {
        var _this = _super.call(this, props) || this;
        _this.render = function () {
            if (_this.props.hidden) {
                return null;
            }
            else {
                switch (_this.props.category) {
                    case 'date':
                        return (react_1["default"].createElement(react_1["default"].Fragment, null,
                            react_1["default"].createElement("h1", { style: { marginBottom: 0 } }, "Date"),
                            react_1["default"].createElement("span", null,
                                react_1["default"].createElement(core_1.Typography, { color: "textSecondary", style: { fontSize: 16, float: 'left' } }, "When money leaves the Association."),
                                react_1["default"].createElement(Info_1["default"], { style: { float: 'left' }, onMouseEnter: function () { return _this.setState({ longDescription: true }); }, onMouseLeave: function () { return _this.setState({ longDescription: false }); } })),
                            _this.state.longDescription ?
                                react_1["default"].createElement(core_1.Typography, { color: "textSecondary", style: { fontSize: 16 } }, "Not when it was budgeted or spent. For example, a spender (a.k.a *Department*) may choose to be reimbursed afterward, or receive a cash-advance beforehand.")
                                : null));
                    case 'fund':
                        return (react_1["default"].createElement(react_1["default"].Fragment, null,
                            react_1["default"].createElement("h1", { style: { marginBottom: 0 } }, "Fund"),
                            react_1["default"].createElement(core_1.Typography, { color: "textSecondary", style: { fontSize: 16, float: 'left' } }, "Where money comes from."),
                            react_1["default"].createElement(Info_1["default"], { style: { float: 'left' }, onMouseEnter: function () { return _this.setState({ longDescription: true }); }, onMouseLeave: function () { return _this.setState({ longDescription: false }); } }),
                            _this.state.longDescription ?
                                react_1["default"].createElement(core_1.Typography, { color: "textSecondary", style: { fontSize: 16 } }, "Most but not all funds are from student fees.")
                                : null));
                    case 'division':
                        return (react_1["default"].createElement(react_1["default"].Fragment, null,
                            react_1["default"].createElement("h1", { style: { marginBottom: 0 } }, "Division"),
                            react_1["default"].createElement(core_1.Typography, { color: "textSecondary", style: { fontSize: 16 } }, "Who controls the money.")));
                    case 'department':
                        return (react_1["default"].createElement(react_1["default"].Fragment, null,
                            react_1["default"].createElement("h1", { style: { marginBottom: 0 } }, "Department"),
                            react_1["default"].createElement(core_1.Typography, { color: "textSecondary", style: { fontSize: 16 } }, "Who spends the money.")));
                    case 'gl':
                        return (react_1["default"].createElement(react_1["default"].Fragment, null,
                            react_1["default"].createElement("h1", { style: { marginBottom: 0 } }, "General Ledger"),
                            react_1["default"].createElement(core_1.Typography, { color: "textSecondary", style: { fontSize: 16 } }, "Rules for how each dollar can be spent.")));
                    case 'event':
                        return (react_1["default"].createElement(react_1["default"].Fragment, null,
                            react_1["default"].createElement("h1", { style: { marginBottom: 0 } }, "Event"),
                            react_1["default"].createElement(core_1.Typography, { color: "textSecondary", style: { fontSize: 16 } }, "What the occasion was.")));
                    case 'keyword':
                        return (react_1["default"].createElement(react_1["default"].Fragment, null,
                            react_1["default"].createElement("h1", { style: { marginBottom: 0 } }, "Description"),
                            react_1["default"].createElement(core_1.Typography, { color: "textSecondary", style: { fontSize: 16, float: 'left' } }, "Where money gets spent, according to the spender (a.k.a. *Department*). Larger font means more money."),
                            react_1["default"].createElement(Info_1["default"], { style: { float: 'left' }, onMouseEnter: function () { return _this.setState({ longDescription: true }); }, onMouseLeave: function () { return _this.setState({ longDescription: false }); } }),
                            _this.state.longDescription ?
                                react_1["default"].createElement(core_1.Typography, { color: "textSecondary", style: { fontSize: 16 } }, "If you wanted to narrow the results to \u201CBruin Bash\u201D, click the word \u201CBruin\u201D and then \u201CBash\u201D. You will see only the transactions with both words in the *Description*. The choice of these words is at the spenders discretion, subject to approval/abbreviation by the accountant. For example, the spender might write \u201C \u2026 student wellness commission \u2026\u201D, and the accountant may abbreviate it as \u201C \u2026 swc \u2026\u201D The graphic performs intelligent de-abbreviation for your convenience.")
                                : null));
                    case 'amount':
                        return (react_1["default"].createElement(react_1["default"].Fragment, null,
                            react_1["default"].createElement("h1", { style: { marginBottom: 0 } }, "Amount"),
                            react_1["default"].createElement(core_1.Typography, { color: "textSecondary", style: { fontSize: 16, float: 'left' } }, "How much money is in each transaction."),
                            react_1["default"].createElement(Info_1["default"], { style: { float: 'left' }, onMouseEnter: function () { return _this.setState({ longDescription: true }); }, onMouseLeave: function () { return _this.setState({ longDescription: false }); } }),
                            _this.state.longDescription ?
                                react_1["default"].createElement(core_1.Typography, { color: "textSecondary", style: { fontSize: 16 } }, "Multiple purchases may be grouped under one transaction. Negative values are refunds to the Association.")
                                : null));
                    case 'table':
                        return (react_1["default"].createElement(core_1.Typography, { color: "textSecondary", style: { fontSize: 16 } },
                            "Above is the raw transaction table of the Undergraduate Student Association. Click on a column to visualize it.",
                            react_1["default"].createElement("br", null),
                            "Low on time? Most important is the descriptions column. Everything else is administrative."));
                    case 'footer':
                        return (react_1["default"].createElement(core_1.Typography, { color: "textSecondary", style: { fontSize: 16 } },
                            "We had to de-abbreviate them, but sometimes did that incorrectly, so please comment at the bottom of the page if you see that.",
                            react_1["default"].createElement("br", null),
                            "These abbreviations had to be autocorrected so they can be categorized in the visual. If autocorrect groups transactions incorrectly, please comment at the bottom of the page."));
                    default:
                        return react_1["default"].createElement("div", null);
                }
            }
        };
        _this.state = {
            longDescription: false
        };
        return _this;
    }
    return ExplanationText;
}(react_1["default"].Component));
exports["default"] = ExplanationText;
