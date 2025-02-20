"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.empty = empty;
exports.is_empty = is_empty;
exports.enqueue = enqueue;
exports.head = head;
exports.dequeue = dequeue;
exports.display_queue = display_queue;
/**
 * Constructs a queue without any elements.
 * @template T type of all queue elements
 * @returns Returns an empty queue.
 */
function empty() {
    return [0, 0, []];
}
/**
 * Checks whether a queue is empty.
 * @template T type of all queue elements
 * @param q queue to check for emptiness
 * @returns Returns true, if the queue q has elements, false otherwise.
 */
function is_empty(q) {
    return q[0] === q[1];
}
/**
 * Adds an element to the queue.
 * @template T type of all queue elements
 * @param e element to add
 * @param q queue to modify
 * @modifies q by adding element e to the end
 */
function enqueue(e, q) {
    var tail_index = q[1];
    q[2][tail_index] = e;
    q[1] = tail_index + 1; // update tail index
}
/**
 * Retrieves the first element of the queue.
 * @precondition Assumes q to be non-empty
 * @template T type of all queue elements
 * @param q queue to get the first element of
 * @returns Returns the element of the queue that was enqueued first.
 */
function head(q) {
    var head_index = q[0];
    return q[2][head_index];
}
/**
 * Removes the first element of a queue.
 * @precondition Assumes q to be non-empty
 * @template T type of all queue elements
 * @param q queue to remove the element from
 * @modifies q such that the element that was enqueued first is removed
 */
function dequeue(q) {
    var head_index = q[0];
    q[0] = head_index + 1;
}
/**
 * Pretty-prints the contents of a queue to standard output.
 * @template T type of all queue elements
 * @param q queue to pretty-print
 */
function display_queue(q) {
    console.log(q[2].slice(q[0], q[1]));
}
