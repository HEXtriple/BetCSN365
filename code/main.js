"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var accounts_1 = require("./accounts");
var hashtables_1 = require("../lib/hashtables");
var accounts_write_1 = require("./accounts_write");
var games_1 = require("./games");
var PromptSync = require("prompt-sync");
var prompt = PromptSync();
function retrieveData() {
    // Try to load existing accounts first
    var loaded = (0, accounts_write_1.loadAccounts)();
    if (loaded) {
        return loaded;
    }
    // If no accounts exist, return empty hashtable
    return (0, hashtables_1.ch_empty)(12, accounts_1.hash_id);
}
function init() {
    var accounts = retrieveData();
    var _a = (0, accounts_1.main_login_loop)(accounts), user = _a[0], updated_accounts = _a[1];
    // Save accounts after modifications
    (0, accounts_write_1.saveAccounts)(updated_accounts);
    console.log("What game would you like to play?");
    console.log("Available games: \n1. Slots");
    var game_select = prompt("Enter game name: ");
    console.log("Starting ".concat(game_select, "..."));
    if ((game_select === null || game_select === void 0 ? void 0 : game_select.toLowerCase()) === "slots" || game_select === "1") {
        (0, games_1.main)([user, updated_accounts]);
    }
}
init();
