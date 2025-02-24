import { main_login_loop, account, hash_id } from "./accounts";
import {ChainingHashtable, ch_empty} from '../lib/hashtables'

function retrieveData(): ChainingHashtable<string, account>{
    const check = false;
    switch(check){
        case false: 
            return ch_empty(12, hash_id);
    }
}

function init(){
    const empty_chain = retrieveData(); 
    main_login_loop(empty_chain);

}