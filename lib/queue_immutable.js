"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.empty = empty;
exports.is_empty = is_empty;
exports.enqueue = enqueue;
exports.head = head;
exports.dequeue = dequeue;
exports.display_queue = display_queue;
var list_1 = require("./list");
/**
 * Constructs a queue without any elements.
 * @template T type of all queue elements
 * @returns Returns an empty queue.
 */
function empty() {
    return null;
}
/**
 * Checks whether a queue is empty.
 * @template T type of all queue elements
 * @param q queue to check for emptiness
 * @returns Returns true, if the queue q has elements, false otherwise.
 */
function is_empty(q) {
    return (0, list_1.is_null)(q);
}
/**
 * Adds an element to the queue.
 * @template T type of all queue elements
 * @param e element to add
 * @param q queue to add the element to
 * @returns Returns a new queue with the element e at the end of the queue q.
 */
function enqueue(e, q) {
    return (0, list_1.append)(q, (0, list_1.list)(e));
}
/**
 * Retrieves the first element of the queue.
 * @template T type of all queue elements
 * @param q queue to get the first element of
 * @returns Returns the element of the queue that was enqueued first.
 */
function head(q) {
    return (0, list_1.head)(q);
}
/**
 * Removes the first element of a queue.
 * @template T type of all queue elements
 * @param q queue to remove the element of
 * @returns Returns a queue with all of the elements of q except
 *          for the element that was enqueued first.
 */
function dequeue(q) {
    return (0, list_1.tail)(q);
}
/**
 * Pretty-prints the contents of a queue to standard output.
 * @template T type of all queue elements
 * @param q queue to pretty-print
 */
function display_queue(q) {
    function print(s) {
        var tl = (0, list_1.tail)(s);
        return is_empty(tl)
            ? head(s) + ""
            : head(s) + ", " + print(tl);
    }
    if (q === null) {
        console.log("queue()");
    }
    else {
        console.log("queue(" + print(q) + ")");
    }
}
