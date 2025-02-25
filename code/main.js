"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var accounts_1 = require("./accounts");
var hashtables_1 = require("../lib/hashtables");
function retrieveData() {
    var check = false;
    switch (check) {
        case false:
            return (0, hashtables_1.ch_empty)(12, accounts_1.hash_id);
    }
}
function init() {
    var empty_chain = retrieveData();
    var session = (0, accounts_1.main_login_loop)(empty_chain);
}
init();
