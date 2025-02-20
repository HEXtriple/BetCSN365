// NOTE: these heaps are MIN-heaps, meaning that the smallest element is on top.

import { type Pair, pair } from '../lib/list';


/**
 * A persistent tree min-heap
 * @template Key the type of keys
 * @template Data the type of data
 */
export type TreeHeap<Key, Data> = null | NonEmptyTreeHeap<Key, Data>;

/**
 * A node in the persistent tree min-heap
 * @template Key The type of keys
 * @template Data the type of data
 * @param key the key of the item stored in the node
 * @param data the value of the item stored in the node
 * @param left_child the left child of the node
 * @param right_child the right child of the node
 * @invariant the key of the node is less than or equal to the keys of its children.
 */
export type NonEmptyTreeHeap<Key, Data> = {
    readonly key: Key,
    readonly data: Data,
    readonly left_child: TreeHeap<Key, Data>,
    readonly right_child: TreeHeap<Key, Data>
};



/**
 * The empty tree heap
 * Convenience function, with given key and data types.
 * @template Key The type of keys
 * @template Data the type of data
 * @returns The empty tree heap (null)
 */
export function th_empty<Key, Data>(): TreeHeap<Key, Data> {
    return null;
}


/**
 * Is this the empty tree heap?
 * @template Key The type of keys
 * @template Data the type of data
 * @returns true iff th is null
 */
export function th_is_empty<Key, Data>(th: TreeHeap<Key, Data>): th is null {
    return th === null;
}


/**
 * Generate a tree heap with a single item (a shrub).
 * Convenience function
 * @template Key The type of keys
 * @template Data the type of data
 * @param key the key of the item
 * @param data the data of the item
 * @returns a tree heap with a single item
 */
export function th_shrub<Key, Data>(key: Key, data: Data): NonEmptyTreeHeap<Key, Data> {
    return { key, data, left_child : th_empty(), right_child: th_empty() };

}


/**
 * Insert an item into a heap
 * Duplicate keys are allowed.
 * @template Key The type of keys
 * @template Data the type of data
 * @param th the tree heap
 * @param key the key of the item
 * @param data the data of the item
 * @returns a tree heap where the item has been added.
 */
export function th_insert<Key, Data>(th: TreeHeap<Key, Data>,
    new_key: Key, new_data: Data): NonEmptyTreeHeap<Key, Data> {
        return  th_is_empty(th)
                ? th_shrub(new_key, new_data)
            : new_key < th.key
                ? { key: new_key, data: new_data, left_child: th, right_child: null }
            : th_is_empty(th.left_child)
                ? { key: th.key, data:th.data,
                    left_child: th_shrub(new_key, new_data),
                    right_child: th.right_child }
            : th_is_empty(th.right_child)
                ? { key: th.key, data:th.data,
                    left_child: th.left_child,
                    right_child: th_shrub(new_key, new_data) }
            : th.left_child.key < th.right_child.key
                ? { key: th.key, data: th.data,
                    left_child: th.left_child,
                    right_child: th_insert(th.right_child, new_key, new_data) }
            : { key: th.key, data: th.data,
                left_child: th_insert(th.left_child, new_key, new_data),
                right_child: th.right_child };
}


/**
 * Read the item on top of the heap
 * Note that this is a min-heap, so the key is the smallest one in the heap
 * @template Key The type of keys
 * @template Data the type of data
 * @param th the tree heap
 * @returns a pair of the key and the data
 */
export function th_top<Key, Data>({key, data}: NonEmptyTreeHeap<Key, Data>): Pair<Key, Data> {
    return pair(key, data);
}


/**
 * Remove the item on top of the heap
 * @template Key The type of keys
 * @template Data the type of data
 * @param th the tree heap
 * @returns a new heap where the item is removed.
 */
export function th_remove<Key, Data>({left_child, right_child}: NonEmptyTreeHeap<Key, Data>): TreeHeap<Key, Data> {
    return  th_is_empty(left_child)
                ? right_child
            : th_is_empty(right_child)
                ? left_child
            : left_child.key < right_child.key
                ? { key: left_child.key,
                    data: left_child.data,
                    left_child: th_remove(left_child),
                    right_child }
            : { key: right_child.key,
                data: right_child.data,
                left_child,
                right_child: th_remove(right_child) };
}



/**
 * A min-heap in an array
 * @template Key the type of keys
 * @param arr the array holding the keys
 * @param size the number of items in the heap
 * @invariant all array items with index < size are defined (we say that they are present)
 * @invariant the item at index i is less than those at index 2*i+1 and 2*i+2, if present.
 */
export type ArrayHeap<Key> = {
    arr: Array<Key>,
    size: number
};


/**
 * Create an empty array heap
 * @template Key The type of keys
 * @returns A new empty array heap
 */
export function ah_empty<Key>(): ArrayHeap<Key> {
    return { arr: [], size: 0};
}

/**
 * Is this an empty array heap?
 * @template Key The type of keys
 * @param ah the array heap
 * @returns true iff ah is empty
 */
export function ah_is_empty<Key>(ah: ArrayHeap<Key>): boolean {
    return ah.size === 0;
}

// the left child of the item with the given index
function left_child(i: number): number {
    return i * 2 + 1;
}

// the right child of the item with the given index
function right_child(i: number): number {
    return i * 2 + 2;
}

// the parent of the item with the given index
// @precondition i is not 0
function parent_of(i: number): number {
    return i % 2 === 0 ? i / 2 - 1 : (i - 1) / 2;
}

/**
 * Insert an item into a heap
 * Duplicate keys are allowed.
 * @template Key The type of keys
 * @param ah the array heap
 * @param key the key of the item
 */
export function ah_insert<Key>(ah: ArrayHeap<Key>, key: Key): void {
    function bubbleUp(i: number): void {
        if (ah.arr[parent_of(i)] > ah.arr[i]) {
            [ah.arr[i], ah.arr[parent_of(i)]] = [ah.arr[parent_of(i)], ah.arr[i]]
            bubbleUp(parent_of(i));
        } else {}  // The heap property is restored
    }
    ah.arr[ah.size] = key;
    ah.size = ah.size + 1;
    bubbleUp(ah.size - 1);
}

/**
 * Read the item on top of the heap
 * Note that this is a min-heap, so the key is the smallest one in the heap
 * @template Key The type of keys
 * @template Data the type of data
 * @param ah the array heap
 * @returns a pair of the key and the data
 */
export function ah_top<Key>(ah: ArrayHeap<Key>): Key {
    return ah.arr[0];
}

/**
 * Remove the item on top of the heap
 * @template Key The type of keys
 * @template Data the type of data
 * @param ah the array heap
 * @returns true iff there was an item to remove (the heap was not empty).
 */
export function ah_remove<Key>(ah: ArrayHeap<Key>): boolean {
    function bubbleDown(i: number): void {
        if (right_child(i) < ah.size && ah.arr[right_child(i)] < ah.arr[i]) {
            // We know that i < left_child(i) < right_child(i) < ah.size
            if (ah.arr[left_child(i)] < ah.arr[i]) {
                if(ah.arr[left_child(i)] < ah.arr[right_child(i)]) {
                    [ah.arr[i], ah.arr[left_child(i)]] = [ah.arr[left_child(i)], ah.arr[i]];
                    bubbleDown(left_child(i));
                } else {
                    [ah.arr[i], ah.arr[right_child(i)]] = [ah.arr[right_child(i)], ah.arr[i]];
                    bubbleDown(right_child(i));
                }
            } else {
                [ah.arr[i], ah.arr[right_child(i)]] = [ah.arr[right_child(i)], ah.arr[i]];
                bubbleDown(right_child(i));
            }
        } else if (left_child(i) < ah.size && ah.arr[left_child(i)] < ah.arr[i]) {
            [ah.arr[i], ah.arr[left_child(i)]] = [ah.arr[left_child(i)], ah.arr[i]];
            bubbleDown(left_child(i));
        } else {} // The heap property is restored
    }
    if (ah.size === 0) {
        return false;
    } else {
        const key = ah.arr[0];
        ah.size   = ah.size - 1;
        ah.arr[0] = ah.arr[ah.size];
        bubbleDown(0);
        return true;
    }
}
