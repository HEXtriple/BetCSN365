import { head, tail, is_null, pair } from './list';

/**
 * A homogeneous stack.
 * @template T type of all stack elements
 */
export type NonEmptyStack<T> = [T, Stack<T>];
export type Stack<T> = null | NonEmptyStack<T>;

/**
 * Constructs a stack without any elements.
 * @template T type of all stack elements
 * @returns Returns an empty stack.
 */
export function empty<T>(): Stack<T> {
    return null;
}

/**
 * Checks whether a stack is empty.
 * @template T type of all stack elements
 * @param stck stack to check for emptiness
 * @returns Returns true, if the stack stck has to elements, false otherwise.
 */
export function is_empty<T>(stck: Stack<T>): stck is null {
    return is_null(stck);
}

/**
 * Pushes an element onto a stack.
 * @template T type of all stack elements
 * @param e element to add
 * @param stck stack to add the element to
 * @returns Returns a new stack with element e on top of the elements of stck.
 */
export function push<T>(e: T, stck: Stack<T>): NonEmptyStack<T> {
    return pair(e, stck);
}

/**
 * Retrieves the top element of a stack.
 * @template T type of all stack elements
 * @param stck stack to get the top element of
 * @returns Returns the element of the stack stck that was last pushed.
 */
export function top<T>(stck: NonEmptyStack<T>): T {
    return head(stck);
}

/**
 * Removes the top element of a stack.
 * @template T type of all stack elements
 * @param stck stack to remove the top element of
 * @returns Returns a stack with all of the elements of stck except for the
 *     top element.
 */
export function pop<T>(stck: NonEmptyStack<T>): Stack<T> {
    return tail(stck);
}

/**
 * Pretty-prints the contents of a stack to standard output.
 * @template T type of all stack elements
 * @param stck stack to pretty-print
 */
export function display_stack<T>(stck: Stack<T>): void {
    function print(s: NonEmptyStack<T>): string {
        const tl = tail(s); // needs to be a variable for type-checking
        return is_empty(tl)
               ? head(s) + ""
               : head(s) + ", " + print(tl);
    }
    if (is_empty(stck)) {
        console.log("stack()");
    } else {
        console.log("stack(" + print(stck) + ")");
    }
}