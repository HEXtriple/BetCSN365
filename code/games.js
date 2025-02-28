"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
var accounts_1 = require("./accounts");
var PromptSync = require("prompt-sync");
var prompt = PromptSync();
var MAX_LINES = 3;
var MAX_BET = 100;
var MIN_BET = 1;
var ROWS = 3;
var COLS = 3;
var symbolCount = {
    A: 2,
    B: 4,
    C: 6,
    D: 8,
};
var symbolValue = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
};
function getSlotMachineSpin(rows, cols, symbols) {
    var allSymbols = [];
    // Populate the allSymbols array based on the frequency in symbols.
    for (var symbol in symbols) {
        for (var i = 0; i < symbols[symbol]; i++) {
            allSymbols.push(symbol);
        }
    }
    var columns = [];
    for (var i = 0; i < cols; i++) {
        var column = [];
        // Copy the available symbols for this column.
        var currentSymbols = __spreadArray([], allSymbols, true);
        for (var j = 0; j < rows; j++) {
            var randomIndex = Math.floor(Math.random() * currentSymbols.length);
            var value = currentSymbols[randomIndex];
            // Remove the selected symbol so it isn't reused in this column.
            currentSymbols.splice(randomIndex, 1);
            column.push(value);
        }
        columns.push(column);
    }
    return columns;
}
function printSlotMachine(columns) {
    // Print row by row
    for (var row = 0; row < columns[0].length; row++) {
        var rowStr = "";
        for (var i = 0; i < columns.length; i++) {
            rowStr += columns[i][row];
            if (i !== columns.length - 1) {
                rowStr += " | ";
            }
        }
        console.log(rowStr);
    }
}
function checkWinnings(columns, lines, bet, values) {
    var winnings = 0;
    var winningLines = [];
    for (var line = 0; line < lines; line++) {
        var symbol = columns[0][line];
        var won = true;
        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
            var column = columns_1[_i];
            if (column[line] !== symbol) {
                won = false;
                break;
            }
        }
        if (won) {
            winnings += values[symbol] * bet;
            winningLines.push(line + 1);
        }
    }
    return { winnings: winnings, winningLines: winningLines };
}
function deposit() {
    while (true) {
        var amountStr = prompt("What would you like to deposit? €");
        var amount = parseInt(amountStr);
        if (!isNaN(amount)) {
            if (amount > 0) {
                return amount;
            }
            else {
                console.log("Amount must be greater than 0");
            }
        }
        else {
            console.log("Please enter a number");
        }
    }
}
function getNumberOfLines() {
    while (true) {
        var linesStr = prompt("Enter the number of lines to bet on (1-".concat(MAX_LINES, "): "));
        var lines = parseInt(linesStr);
        if (!isNaN(lines)) {
            if (lines >= 1 && lines <= MAX_LINES) {
                return lines;
            }
            else {
                console.log("Enter a valid number of lines.");
            }
        }
        else {
            console.log("Please enter a number");
        }
    }
}
function getBet() {
    while (true) {
        var amountStr = prompt("What would you like to bet on each line? €");
        var amount = parseInt(amountStr);
        if (!isNaN(amount)) {
            if (amount >= MIN_BET && amount <= MAX_BET) {
                return amount;
            }
            else {
                console.log("Amount must be between \u20AC".concat(MIN_BET, " - \u20AC").concat(MAX_BET, "."));
            }
        }
        else {
            console.log("Please enter a number");
        }
    }
}
function main(user_session) {
    var balance = user_session[0].savings;
    while (true) {
        console.log("Your current balance is \u20AC".concat(balance));
        var lines = getNumberOfLines();
        var bet = void 0;
        var totalBet = void 0;
        while (true) {
            bet = getBet();
            totalBet = bet * lines;
            if (totalBet > balance) {
                console.log("You do not have enough to bet that amount, your current balance is \u20AC".concat(balance));
            }
            else {
                break;
            }
        }
        console.log("You are betting \u20AC".concat(bet, " on ").concat(lines, " lines. Total bet is equal to: \u20AC").concat(totalBet));
        var slots = getSlotMachineSpin(ROWS, COLS, symbolCount);
        printSlotMachine(slots);
        var _a = checkWinnings(slots, lines, bet, symbolValue), winnings = _a.winnings, winningLines = _a.winningLines;
        console.log("You won \u20AC".concat(winnings));
        if (winningLines.length > 0) {
            console.log("You won on lines: ".concat(winningLines.join(", ")));
        }
        balance += winnings - totalBet;
        user_session[0].savings = balance;
        if (balance <= 0) {
            console.log("You have run out of money!");
            break;
        }
        var playAgain = prompt("Do you want to play again? (y/n): ");
        if (playAgain.toLowerCase() !== "y") {
            break;
        }
    }
    console.log("You left the game with \u20AC".concat(balance));
    (0, accounts_1.update_user)(user_session);
}
