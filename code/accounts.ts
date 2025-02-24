import {} from '../lib/hashtables'

type account = {
    name: string,
    age: number,
    psswd: string,
    savings: number,
    rank: number //kan kollas från en max-heap med avseende på antalet hopp
}

type hash = string

type session = [account, hash]

const hasth_table_hash = x => x = x;
const psswd_hash = x => x = x;

function login_input (statement:string): string | null | number {
    console.log(statement)
    return prompt("> ")
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
        age: new_age,
        psswd: hashed_psswd,
        savings: starting_amount,
        rank: starting_rank
    }
}
function login_acc (){

}

// function retrieve_update_ranks()

// export function ranked_heaps()

export function main_login_loop(): void{
    const user = create_acc();


}