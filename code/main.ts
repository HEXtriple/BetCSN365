import { main_login_loop, account, hash_id, session } from "./accounts";
import { ChainingHashtable, ch_empty } from "../lib/hashtables";
import { saveAccounts, loadAccounts } from "./accounts_write";
import { main } from "./games";

import * as PromptSync from "prompt-sync";
const prompt: PromptSync.Prompt = PromptSync();

function retrieveData(): ChainingHashtable<string, account> {
  // Try to load existing accounts first
  const loaded = loadAccounts();
  if (loaded) {
    return loaded;
  }
  // If no accounts exist, return empty hashtable
  return ch_empty(12, hash_id);
}

function init(): void {
  const accounts = retrieveData();
  const [user, updated_accounts]: session = main_login_loop(accounts);

  // Save accounts after modifications
  saveAccounts(updated_accounts);

  console.log("What game would you like to play?");
  console.log("Available games: \n1. Slots");

  const game_select = prompt("Enter game: ");

  console.log(`Starting ${game_select}...`);

  if (game_select?.toLowerCase() === "slots" || game_select === "1") {
    main([user, updated_accounts]);
  }
}

init();
