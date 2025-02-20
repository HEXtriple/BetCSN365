

/**
 * A homogeneous priority queue.
 * The first entry points to the index of the queue's head element,
 * the second entry points to the next empty index of the queue, and
 * the last entry holds the values (contents) of the queue.
 * Each value in the queue has a numeric priority, a larger number meaning
 * a higher priority.
 * @invariant Pairs in the array are ordered by priority, highest first.
 * @template T type of all queue elements
 */
export type Prio_Queue<T> = [number, number, Array<[number, T]>];

/**
 * Constructs a priority queue without any elements.
 * @template T type of all queue elements
 * @returns Returns an empty queue.
 */
export function empty<T>(): Prio_Queue<T> {
    return [0, 0, []];
}

/**
 * Checks whether a priority queue is empty.
 * @template T type of all queue elements
 * @param q queue to check for emptiness
 * @returns Returns true, if q has elements, false otherwise.
 */
export function is_empty<T>(q: Prio_Queue<T>): boolean {
    return q[0] === q[1];
}

/**
 * Adds an element to a priority queue.
 * @template T type of all queue elements
 * @param prio priority of the new element (larger means higher priority)
 * @param e element to add
 * @param q queue to add element to
 * @modifies q such that e is added with priority prio
 */
export function enqueue<T>(prio: number, e: T, q: Prio_Queue<T>): void {
    const tail_index = q[1];
    q[2][tail_index] = [prio, e];
    if (!is_empty(q)) {
        // we have at least one element
        const head_index = q[0];
        const elems = q[2];
        elems[tail_index] = [prio, e];
        // swap elements until we find the right spot
        for (let i = tail_index; i > head_index; i = i - 1) {
            if (elems[i - 1][0] >= elems[i][0]) {
                break;
            } else { //swap
                swap(elems, i, i - 1);
            }
        }
    } else {}
    q[1] = tail_index + 1;  // update tail index
}

function swap<T>(A: Array<T>, i: number, j: number): void {
    const tmp = A[i];
    A[i] = A[j];
    A[j] = tmp;
}

/**
 * Retrieves the element with the highest priority from the queue.
 * If two elements have the same priority the one that was
 * enqueued first is returned.
 * @precondition Assumes q to be non-empty
 * @template T type of all queue elements
 * @param q queue to get the highest-priority element of
 * @returns Returns the element of the queue that has the highest priority.
 */
export function head<T>(q: Prio_Queue<T>): T {
    const head_index = q[0];
    return q[2][head_index][1];
}

/**
 * Removes the element with highest priority from a queue.
 * If two elements have the same priority the one that was
 * enqueued first is dequeued first.
 * @precondition Assumes q to be non-empty
 * @template T type of all queue elements
 * @param q queue to remove the element from
 * @modifies q such that the element with the highest priority is removed
 */
export function dequeue<T>(q: Prio_Queue<T>): void {
    const head_index = q[0];
    q[0] = head_index + 1;
}

/**
 * Pretty-prints the contents of a queue to standard output.
 * @template T type of all queue elements
 * @param q queue to pretty-print
 */
export function display_queue<T>(q: Prio_Queue<T>): void {
    console.log(q[2].slice(q[0], q[1]));
}