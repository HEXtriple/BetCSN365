import {
  ChainingHashtable,
  ch_empty,
  ch_insert,
  ch_lookup,
  HashFunction,
  ch_delete,
} from "../lib/hashtables";
import { saveAccounts, loadAccounts } from "./accounts_write";
import * as PromptSync from "prompt-sync";

const prompt: PromptSync.Prompt = PromptSync();

export type account = {
  name: string;
  age: number;
  psswd: string;
  savings: number;
  profit: number;
  rank: number; //kan kollas från en max-heap med avseende på antalet hopp
};

export type session = [account, ChainingHashtable<account["name"], account>];

export function hash_id(username: string): number {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash += username.charCodeAt(i);
  }
  return hash;
}
const psswd_hash = (x: string) => x;

function login_input(statement: string, guest: string): string {
  console.log(statement);
  const response = prompt("> ", guest);
  return response!;
}
function create_acc(): account {
  let new_age;
  let new_name;
  let new_passwd;
  let hashed_psswd;

  const starting_amount = 300;
  const starting_rank = 0;

  console.log("Welcome to the account setup \n  --------------");

  while (true) {
    let new_age: number = Number(login_input("Please enter age", "18"));
    if (new_age < 18) {
      console.log("Must be over the age of 18");
      continue;
    } else {
      new_name = login_input("Enter name", "Guest");
      new_passwd = login_input("Enter passwd", "Guest");
      hashed_psswd = psswd_hash(new_passwd);
      break;
    }
  }
  return {
    name: new_name,
    age: new_age!,
    psswd: hashed_psswd,
    savings: starting_amount,
    rank: starting_rank,
    profit: starting_rank,
  };
}

//account login
function login_acc(
  accounts: ChainingHashtable<string, account>,
): account | null {
  let username = login_input("Enter username", "Guest");
  let password = login_input("Enter password", "Guest");
  let hashed_password = psswd_hash(password);
  let usr: account | undefined = ch_lookup(accounts, username);
  if (usr && usr.psswd === hashed_password) {
    console.log("Login successful");
    return usr;
  } else {
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
export function main_login_loop(
  hash_table: ChainingHashtable<string, account>,
): session {
  while (true) {
    let selection = login_input(
      "Create account or login? C: create, L: login",
      "",
    );
    if (selection.toLowerCase() === "c") {
      const user: account = create_acc();
      ch_insert(hash_table, user.name, user);
      return [user, hash_table];
    } else if (selection.toLowerCase() === "l" || "login") {
      const user = login_acc(hash_table);
      if (user) {
        console.log("Logged in as", user.name);
        return [user, hash_table];
      }
    } else {
      console.log("Invalid selection");
      continue;
    }
  }
}

export function update_user([user, hash_table]: session): void {
  const search = ch_lookup(hash_table, user.name);
  ch_delete(hash_table, user.name);
  ch_insert(hash_table, user.name, user);
  saveAccounts(hash_table);
  return;
}
