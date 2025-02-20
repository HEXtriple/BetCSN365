import { head as list_head, tail, is_null, list, append } from './list';

/**
 * A homogeneous queue.
 * @template T type of all queue elements
 */
export type NonEmptyQueue<T> = [T, Queue<T>];
export type Queue<T> = null | NonEmptyQueue<T>;

/**
 * Constructs a queue without any elements.
 * @template T type of all queue elements
 * @returns Returns an empty queue.
 */
export function empty<T>(): Queue<T> {
    return null;
}

/**
 * Checks whether a queue is empty.
 * @template T type of all queue elements
 * @param q queue to check for emptiness
 * @returns Returns true, if the queue q has elements, false otherwise.
 */
export function is_empty<T>(q: Queue<T>): q is null {
    return is_null(q);
}

/**
 * Adds an element to the queue.
 * @template T type of all queue elements
 * @param e element to add
 * @param q queue to add the element to
 * @returns Returns a new queue with the element e at the end of the queue q.
 */
export function enqueue<T>(e: T, q: Queue<T>): NonEmptyQueue<T> {
    return <NonEmptyQueue<T>>append(q, list(e));
}

/**
 * Retrieves the first element of the queue.
 * @template T type of all queue elements
 * @param q queue to get the first element of
 * @returns Returns the element of the queue that was enqueued first.
 */
export function head<T>(q: NonEmptyQueue<T>): T {
    return list_head(q);
}

/**
 * Removes the first element of a queue.
 * @template T type of all queue elements
 * @param q queue to remove the element of
 * @returns Returns a queue with all of the elements of q except
 *          for the element that was enqueued first.
 */
export function dequeue<T>(q: NonEmptyQueue<T>): Queue<T> {
    return tail(q);
}

/**
 * Pretty-prints the contents of a queue to standard output.
 * @template T type of all queue elements
 * @param q queue to pretty-print
 */
export function display_queue<T>(q: Queue<T>): void {
    function print(s: NonEmptyQueue<T>): string {
        const tl = tail(s);
        return is_empty(tl)
               ? head(s) + ""
               : head(s) + ", " + print(tl);
    }
    if (q === null) {
        console.log("queue()");
    } else {
        console.log("queue(" + print(q) + ")");
    }
}