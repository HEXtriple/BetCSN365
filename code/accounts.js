"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash_id = hash_id;
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
function login_input(statement, guest) {
    console.log(statement);
    var response = prompt("> ", guest);
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
        var new_age_1 = Number(login_input("Please enter age", "18"));
        if (new_age_1 < 18) {
            console.log("Must be over the age of 18");
            continue;
        }
        else {
            new_name = login_input("Enter name", "Guest");
            new_passwd = login_input("Enter passwd", "Guest");
            hashed_psswd = psswd_hash(new_passwd);
            break;
        }
    }
    return {
        name: new_name,
        age: new_age,
        psswd: hashed_psswd,
        savings: starting_amount,
        rank: starting_rank,
        profit: starting_rank,
    };
}
//account login
function login_acc(accounts) {
    var username = login_input("Enter username", "Guest");
    var password = login_input("Enter password", "Guest");
    var hashed_password = psswd_hash(password);
    var usr = (0, hashtables_1.ch_lookup)(accounts, username);
    if (usr && usr.psswd === hashed_password) {
        console.log("Login successful");
        return usr;
    }
    else {
        console.log("Invalid username or password");
        return null;
    }
}
// function retrieve_update_ranks()
// export function ranked_heaps()
/**
 * Function spec
 * @param hash_table
 * @returns session, the user information and which hashtable that gets used
 */
function main_login_loop(hash_table) {
    while (true) {
        var selection = login_input("Create account or login? C: create, L: login", "");
        if (selection.toLowerCase() === "c") {
            var user = create_acc();
            (0, hashtables_1.ch_insert)(hash_table, user.name, user);
            return [user, hash_table];
        }
        else if (selection.toLowerCase() === "l" || "login") {
            var user = login_acc(hash_table);
            if (user) {
                console.log("Logged in as", user.name);
                return [user, hash_table];
            }
        }
        else {
            console.log("Invalid selection");
            continue;
        }
    }
}
