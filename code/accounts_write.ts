import { existsSync, readFileSync, writeFileSync } from "fs";
import { account, hash_id } from "./accounts";
type accRecord = Record<string, account>;
// Hashtable för att lagra flera accounts (med unika ID:n som nycklar)
import {
  ChainingHashtable,
  ch_empty,
  ch_insert,
  ch_keys,
  ch_lookup,
} from "../lib/hashtables";
import { List, head, is_null, tail } from "../lib/list";

/**
 * Converts a ChainingHashtable to a plain object for storage
 */
function hashtableToObject(
  hashtable: ChainingHashtable<string, account>,
): accRecord {
  const accounts: accRecord = {};
  let keys: List<string> = ch_keys(hashtable);

  // Iterate through the keys list
  while (!is_null(keys)) {
    const key = head(keys);
    const value = ch_lookup(hashtable, key);
    if (value !== undefined) {
      accounts[key] = value;
    }
    keys = tail(keys);
  }

  return accounts;
}

/**
 * Saves accounts from a ChainingHashtable to a file
 */
export function saveAccounts(
  accounts: ChainingHashtable<string, account>,
  filename: string = "accounts.json",
): void {
  try {
    const accountsObject = hashtableToObject(accounts);
    const accountsData = JSON.stringify(accountsObject, null, 2);
    writeFileSync(filename, accountsData, "utf8");
    console.log(`Accounts successfully saved to: ${filename}`);
  } catch (error) {
    console.error("Error saving accounts:", error);
  }
}

/**
 * Loads accounts from a file into a ChainingHashtable
 */
export function loadAccounts(
  filename: string = "accounts.json",
): ChainingHashtable<string, account> | null {
  try {
    if (!existsSync(filename)) {
      console.log("No saved accounts file found.");
      return null;
    }

    const fileData = readFileSync(filename, "utf8");
    const accountsObject: Record<string, account> = JSON.parse(fileData);

    // Create a new ChainingHashtable and populate it
    const hashtable: ChainingHashtable<string, account> = ch_empty(12, hash_id);

    for (let key in accountsObject) {
      ch_insert(hashtable, key, accountsObject[key]);
    }

    return hashtable;
  } catch (error) {
    console.error("Error loading accounts:", error);
    return null;
  }
}
