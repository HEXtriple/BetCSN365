"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main_login_loop = main_login_loop;
var hashtables_1 = require("../lib/hashtables");
var PromptSync = require("prompt-sync");
var prompt = PromptSync();
function hash_id(username) {
    var hash = 0;
    for (var i = 0; i < username.length; i++) {
        hash += username.charCodeAt(i);
    }
    return hash;
}
var psswd_hash = function (x) { return x; };
function login_input(statement) {
    console.log(statement);
    var response = prompt("> ", "17");
    return response;
}
function create_acc() {
    var new_age;
    var new_name;
    var new_passwd;
    var hashed_psswd;
    var starting_amount = 300;
    var starting_rank = 0;
    console.log("Welcome to the account setup \n  --------------");
    while (true) {
        var new_age_1 = Number(login_input("Please enter age"));
        if (new_age_1 < 18) {
            console.log("Must be over the age of 18");
            continue;
        }
        else {
            new_name = login_input("Enter name");
            new_passwd = login_input("Enter passwd");
            hashed_psswd = psswd_hash(new_passwd);
            break;
        }
    }
    return {
        name: new_name,
        age: new_age,
        psswd: hashed_psswd,
        savings: starting_amount,
        rank: starting_rank
    };
}
function login_acc() {
    hashtables_1.ch_lookup;
}
// function retrieve_update_ranks()
// export function ranked_heaps()
function main_login_loop(hash_table) {
    var user = create_acc();
    (0, hashtables_1.ch_insert)(hash_table, user.name, user);
    console.log((0, hashtables_1.ch_lookup)(hash_table, user.name));
    console.log("Done");
}
var empty_chain = (0, hashtables_1.ch_empty)(12, hash_id);
main_login_loop(empty_chain);
// const fs = require('fs');
// var myVariable = "Hello, world!";
// fs.writeFile('myVariable.txt', myVariable, (err) => {
//     if (err) throw err;
//     console.log('File is created successfully.');
// });
