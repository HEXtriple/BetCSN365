import {ChainingHashtable, ch_empty, ch_insert, ch_lookup, HashFunction} from '../lib/hashtables'
import * as PromptSync from "prompt-sync";

const prompt: PromptSync.Prompt = PromptSync();


export type account = {
    name: string,
    age: number,
    psswd: string,
    savings: number,
    rank: number //kan kollas från en max-heap med avseende på antalet hopp
}

type hash = string

type session = [account, hash]

export function hash_id (username:string): number {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash += username.charCodeAt(i);
    }
    return hash;
  }
  const psswd_hash = (x: string) => x;

function login_input (statement: string): string {
    console.log(statement)
    const response = prompt("> ", "17")
    return response!
}
function create_acc (): account{
    let new_age;
    let new_name;
    let new_passwd
    let hashed_psswd;

    const starting_amount = 300;
    const starting_rank = 0;

    console.log("Welcome to the account setup \n  --------------");

    
    while (true){
        let new_age:number = Number(login_input("Please enter age"));
        if (new_age < 18){
            console.log("Must be over the age of 18");
            continue;
        } else {
            new_name = login_input("Enter name")
            new_passwd = login_input("Enter passwd")
            hashed_psswd = psswd_hash(new_passwd)
            break;
            
        }
        
    }
    return {
        name: new_name,
        age: new_age!,
        psswd: hashed_psswd,
        savings: starting_amount,
        rank: starting_rank
    }
}
function login_acc (){
    ch_lookup
}

// function retrieve_update_ranks()

// export function ranked_heaps()

export function main_login_loop(hash_table: ChainingHashtable<string,account>): void{
    const user:account = create_acc();
    ch_insert(hash_table, user.name, user);
    console.log(ch_lookup(hash_table, user.name));
}




// const fs = require('fs');

// var myVariable = "Hello, world!";
// fs.writeFile('myVariable.txt', myVariable, (err) => {
//     if (err) throw err;
//     console.log('File is created successfully.');
// });