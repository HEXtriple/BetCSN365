"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash_id = void 0;
exports.ch_empty = ch_empty;
exports.ch_lookup = ch_lookup;
exports.ch_insert = ch_insert;
exports.ch_delete = ch_delete;
exports.ch_keys = ch_keys;
exports.ph_empty = ph_empty;
exports.ph_lookup = ph_lookup;
exports.ph_insert = ph_insert;
exports.ph_delete = ph_delete;
exports.ph_keys = ph_keys;
var list_1 = require("./list");
/**
 * The identity function as an auxiliary hash function
 * Do not use except for learning about hash tables
 * @param key the key
 * @returns key
 */
var hash_id = function (key) { return key; };
exports.hash_id = hash_id;
/**
 * Create an empty chaining hash table
 * @template K the type of keys
 * @template V the type of values
 * @param size the number of chains (should be close to max expected size)
 * @param hash the auxiliary hash function
 * @precondition the type of values does not contain undefined
 * @returns an empty hash table
 */
function ch_empty(size, hash) {
    var arr = new Array(size);
    for (var i = 0; i < size; i++) {
        arr[i] = null;
    }
    return { arr: arr, hash: hash };
}
/**
 * Scan an association list for the given key.
 * @template K the type of keys
 * @template V the type of values
 * @param xs the list to scan
 * @param key the key to scan for
 * @returns the associated value, or undefined if it does not exist.
 */
function scan(xs, key) {
    return (0, list_1.is_null)(xs)
        ? undefined
        : key === (0, list_1.head)((0, list_1.head)(xs))
            ? (0, list_1.tail)((0, list_1.head)(xs))
            : scan((0, list_1.tail)(xs), key);
}
// Compute a remainder that has the same sign as the modulus.
function mod(nmb, modulus) {
    return (nmb % modulus + modulus) % modulus;
}
/**
 * Search a hash table for the given key.
 * @template K the type of keys
 * @template V the type of values
 * @param table the hash table to scan
 * @param key the key to scan for
 * @returns the associated value, or undefined if it does not exist.
 */
function ch_lookup(_a, key) {
    var arr = _a.arr, hash = _a.hash;
    return scan(arr[mod(hash(key), arr.length)], key);
}
/**
 * Insert a key-value pair into a chaining hash table.
 * Overwrites the existing value associated with the key, if any.
 * @template K the type of keys
 * @template V the type of values
 * @param table the hash table
 * @param key the key to insert at
 * @param value the value to insert
 * @returns true iff the key already existed
 */
function ch_insert(_a, key, value) {
    var arr = _a.arr, hash = _a.hash;
    var index = mod(hash(key), arr.length);
    if (scan(arr[index], key) === undefined) {
        arr[index] = (0, list_1.pair)((0, list_1.pair)(key, value), arr[index]);
        return false;
    }
    else {
        arr[index] = (0, list_1.map)(function (kv) { return key === (0, list_1.head)(kv) ? (0, list_1.pair)(key, value) : kv; }, arr[index]);
        return true;
    }
}
/**
 * Delete a key-value pair from a chaining hash table.
 * @template K the type of keys
 * @template V the type of values
 * @param table the hash table
 * @param key the key to delete
 * @returns true iff the key existed
 */
function ch_delete(_a, key) {
    var arr = _a.arr, hash = _a.hash;
    var index = mod(hash(key), arr.length);
    if (scan(arr[index], key) === undefined) {
        return false;
    }
    else {
        arr[index] = (0, list_1.filter)(function (kv) { return (0, list_1.head)(kv) !== key; }, arr[index]);
        return true;
    }
}
/**
 * Get all keys in a chaining hash table.
 * @template K the type of keys
 * @template V the type of values
 * @param table the hash table
 * @returns all keys in the table
 */
function ch_keys(tab) {
    return (0, list_1.map)(list_1.head, (0, list_1.flatten)((0, list_1.build_list)(function (i) { return tab.arr[i]; }, tab.arr.length)));
}
/**
 * Create an empty probing hash table
 * @template K the type of keys
 * @template V the type of values
 * @param size the maximum number of elements to accomodate
 * @param hash_function the hash function
 * @precondition the key type K contains neither null nor undefined
 * @returns an empty hash table
 */
function ph_empty(size, hash_function) {
    return {
        keys: new Array(size),
        values: new Array(size),
        hash: hash_function,
        entries: 0
    };
}
// helper function implementing probing from a given probe index
function probe(keys, key, hash, skip_null) {
    for (var i = 0; i < keys.length; i = i + 1) {
        var idx = (hash + i) % keys.length;
        if (keys[idx] === key)
            return idx;
        if (keys[idx] === undefined)
            return idx;
        if (!skip_null && keys[idx] === null)
            return idx;
    }
    return undefined;
}
/**
 * Search a hash table for the given key.
 * @template K the type of keys
 * @template V the type of values
 * @param ht the hash table to scan
 * @param key the key to scan for
 * @returns the associated value, or undefined if it does not exist.
 */
function ph_lookup(ht, key) {
    var start_idx = ht.hash(key);
    var idx = probe(ht.keys, key, start_idx, true /* skip null*/);
    return idx === undefined ? undefined : ht.values[idx];
}
/**
 * Insert a key-value pair into a probing hash table.
 * Overwrites the existing value associated with the key, if any.
 * @template K the type of keys
 * @template V the type of values
 * @param ht the hash table
 * @param key the key to insert at
 * @param value the value to insert
 * @returns true iff the insertion succeeded (the hash table was not full)
 */
function ph_insert(ht, key, value) {
    var start_idx = ht.hash(key);
    var idx = probe(ht.keys, key, start_idx, false /* don't skip null*/);
    if (idx === undefined) {
        return false; // Hash table full
    }
    else {
        if (ht.keys[idx] === null) { // Probing stopped at a null slot
            // Probe again from null slot to ensure key is not in ht
            var key_idx = probe(ht.keys, key, idx, true /* skip null */);
            if (key_idx !== undefined) {
                idx = key_idx;
            }
        }
        if (ht.keys[idx] !== key) {
            // Inserting a new entry but entries equal capacity
            if (ht.entries === ht.keys.length) {
                return false;
            }
            else {
                ht.entries += 1;
            }
        }
        ht.keys[idx] = key;
        ht.values[idx] = value;
        return true;
    }
}
/**
 * Delete a key-value pair from a probing hash table.
 * @template K the type of keys
 * @template V the type of values
 * @param ht the hash table
 * @param key the key to delete
 * @returns the value of the key, if the key existed, undefined otherwise
 */
function ph_delete(ht, key) {
    var start_idx = ht.hash(key);
    var idx = probe(ht.keys, key, start_idx, true /* skip null */);
    if (idx === undefined || ht.keys[idx] === undefined) {
        return undefined; // No such key
    }
    else {
        ht.entries -= 1;
        var value = ht.values[idx];
        ht.keys[idx] = null;
        ht.values[idx] = undefined;
        return value;
    }
}
/**
 * Filters out nulls and undefined values from a list, and from its element type
 * @template T the element type of the resulting list
 * @param xs a list with nulls and undefined values
 * @returns the input list without nulls and undefined values
 */
function filterNulls(xs) {
    if ((0, list_1.is_null)(xs)) {
        return null;
    }
    else {
        var x = (0, list_1.head)(xs);
        if (x === undefined || x === null) {
            return filterNulls((0, list_1.tail)(xs));
        }
        else {
            return (0, list_1.pair)(x, filterNulls((0, list_1.tail)(xs)));
        }
    }
}
/**
 * Extract all the keys of a probing hash table
 * @template K
 * @template V
 * @param {ProbingHashtable<K,V>} tab
 * @returns all the keys of the table
 */
function ph_keys(tab) {
    return filterNulls((0, list_1.build_list)(function (i) { return tab.keys[i]; }, tab.keys.length));
}
