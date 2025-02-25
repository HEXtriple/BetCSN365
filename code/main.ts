import { main_login_loop, account, hash_id } from "./accounts";
import { ChainingHashtable, ch_empty } from "../lib/hashtables";
import { saveAccounts, loadAccounts } from "./accounts_write";

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
  const [user, updated_accounts] = main_login_loop(accounts);

  // Save accounts after modifications
  saveAccounts(updated_accounts);
}

init();
