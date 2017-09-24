"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var fluture = require("fluture");
function create(pipeline) {
    return fluture.Future(function (rej, res) {
        console.log('before fluture ');
        models_1.default.Pipeline.create(pipeline)
            .then(function (value) { return res(value); })
            .catch(function (e) { return rej(e); });
    });
}
exports.create = create;
function findAll() {
    return fluture.Future(function (rej, res) {
        models_1.default.Pipeline.findAll()
            .then(function (values) { return res(values); })
            .catch(function (e) { return rej(e); });
    });
}
exports.findAll = findAll;
