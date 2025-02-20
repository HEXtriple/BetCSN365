"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.empty = empty;
exports.is_empty = is_empty;
exports.push = push;
exports.top = top;
exports.pop = pop;
exports.display_stack = display_stack;
var list_1 = require("./list");
/**
 * Constructs a stack without any elements.
 * @template T type of all stack elements
 * @returns Returns an empty stack.
 */
function empty() {
    return null;
}
/**
 * Checks whether a stack is empty.
 * @template T type of all stack elements
 * @param stck stack to check for emptiness
 * @returns Returns true, if the stack stck has to elements, false otherwise.
 */
function is_empty(stck) {
    return (0, list_1.is_null)(stck);
}
/**
 * Pushes an element onto a stack.
 * @template T type of all stack elements
 * @param e element to add
 * @param stck stack to add the element to
 * @returns Returns a new stack with element e on top of the elements of stck.
 */
function push(e, stck) {
    return (0, list_1.pair)(e, stck);
}
/**
 * Retrieves the top element of a stack.
 * @template T type of all stack elements
 * @param stck stack to get the top element of
 * @returns Returns the element of the stack stck that was last pushed.
 */
function top(stck) {
    return (0, list_1.head)(stck);
}
/**
 * Removes the top element of a stack.
 * @template T type of all stack elements
 * @param stck stack to remove the top element of
 * @returns Returns a stack with all of the elements of stck except for the
 *     top element.
 */
function pop(stck) {
    return (0, list_1.tail)(stck);
}
/**
 * Pretty-prints the contents of a stack to standard output.
 * @template T type of all stack elements
 * @param stck stack to pretty-print
 */
function display_stack(stck) {
    function print(s) {
        var tl = (0, list_1.tail)(s); // needs to be a variable for type-checking
        return is_empty(tl)
            ? (0, list_1.head)(s) + ""
            : (0, list_1.head)(s) + ", " + print(tl);
    }
    if (is_empty(stck)) {
        console.log("stack()");
    }
    else {
        console.log("stack(" + print(stck) + ")");
    }
}
