"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
var ejs = require("ejs");
function render(content, data) {
    return ejs.render(content, data);
}
exports.render = render;
