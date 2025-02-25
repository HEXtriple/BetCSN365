"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAccounts = saveAccounts;
exports.loadAccounts = loadAccounts;
var fs_1 = require("fs");
var accounts_1 = require("./accounts");
// Hashtable för att lagra flera accounts (med unika ID:n som nycklar)
var hashtables_1 = require("../lib/hashtables");
var list_1 = require("../lib/list");
/**
 * Converts a ChainingHashtable to a plain object for storage
 */
function hashtableToObject(hashtable) {
    var accounts = {};
    var keys = (0, hashtables_1.ch_keys)(hashtable);
    // Iterate through the keys list
    while (!(0, list_1.is_null)(keys)) {
        var key = (0, list_1.head)(keys);
        var value = (0, hashtables_1.ch_lookup)(hashtable, key);
        if (value !== undefined) {
            accounts[key] = value;
        }
        keys = (0, list_1.tail)(keys);
    }
    return accounts;
}
/**
 * Saves accounts from a ChainingHashtable to a file
 */
function saveAccounts(accounts, filename) {
    if (filename === void 0) { filename = "accounts.json"; }
    try {
        var accountsObject = hashtableToObject(accounts);
        var accountsData = JSON.stringify(accountsObject, null, 2);
        (0, fs_1.writeFileSync)(filename, accountsData, "utf8");
        console.log("Accounts successfully saved to: ".concat(filename));
    }
    catch (error) {
        console.error("Error saving accounts:", error);
    }
}
/**
 * Loads accounts from a file into a ChainingHashtable
 */
function loadAccounts(filename) {
    if (filename === void 0) { filename = "accounts.json"; }
    try {
        if (!(0, fs_1.existsSync)(filename)) {
            console.log("No saved accounts file found.");
            return null;
        }
        var fileData = (0, fs_1.readFileSync)(filename, "utf8");
        var accountsObject = JSON.parse(fileData);
        // Create a new ChainingHashtable and populate it
        var hashtable = (0, hashtables_1.ch_empty)(12, accounts_1.hash_id);
        for (var key in accountsObject) {
            (0, hashtables_1.ch_insert)(hashtable, key, accountsObject[key]);
        }
        return hashtable;
    }
    catch (error) {
        console.error("Error loading accounts:", error);
        return null;
    }
}
