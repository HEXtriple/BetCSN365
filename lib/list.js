"use strict";
// Provides a typed implementation of lists as seen in Source Academy
Object.defineProperty(exports, "__esModule", { value: true });
exports.pair = pair;
exports.head = head;
exports.tail = tail;
exports.is_null = is_null;
exports.list = list;
exports.to_string = to_string;
exports.length = length;
exports.map = map;
exports.build_list = build_list;
exports.for_each = for_each;
exports.reverse = reverse;
exports.append = append;
exports.member = member;
exports.remove = remove;
exports.remove_all = remove_all;
exports.filter = filter;
exports.all = all;
exports.enum_list = enum_list;
exports.list_ref = list_ref;
exports.accumulate = accumulate;
exports.fold_left = fold_left;
exports.flatten = flatten;
/**
 * Construct a pair.
 * @template H the type of the head
 * @template T the type of the tail
 * @param hd head (first component)
 * @param tl tail (second component)
 * @returns Returns a pair whose head is hd and whose tail is y.
 */
function pair(hd, tl) {
    return [hd, tl];
}
/**
 * Retrieve the head element from a pair.
 * @param p input pair
 * @returns Returns the head (first component) of pair p.
 */
function head(p) {
    return p[0];
}
/**
 * Retrieve the tail element from a pair.
 * @param p input pair
 * @returns Returns the tail (second component) of pair p.
 */
function tail(p) {
    return p[1];
}
/**
 * Check whether a value is null.
 * @param v value to check
 * @returns Returns true if v is equal to null (using ===).
 */
function is_null(v) {
    return v === null;
}
/**
 * Create a list from an array.
 * @template S the element type of the new list
 * @param elements An array of values
 * @returns Returns a new list whose values are the same as in the elements array
 *     (in the same order).
 */
function list() {
    var elements = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        elements[_i] = arguments[_i];
    }
    var lst = null;
    for (var i = elements.length - 1; i >= 0; i = i - 1) {
        lst = pair(elements[i], lst);
    }
    return lst;
}
/**
 * The empty list of a given type.
 * Convenience function.
 * @template T the element type
 * @returns the empty list of type T
 */
function empty_list() {
    return null;
}
/**
 * Give a string representation of a list.
 * @template T the element type of the list
 * @param xs the list
 * @returns A string representation of xs.
 */
function to_string(xs) {
    function print(s) {
        var tl = tail(s);
        return is_null(tl)
            ? head(s) + ""
            : head(s) + ", " + print(tl);
    }
    if (xs === null) {
        return "list()";
    }
    else {
        return "list(" + print(xs) + ")";
    }
}
/**
 * Tally the length of a list.
 * Tail recursive.
 * @template T
 * @param xs a list
 * @returns The length of xs.
 */
function length(xs) {
    function $length(xs, acc) {
        return is_null(xs) ? acc : $length(tail(xs), acc + 1);
    }
    return $length(xs, 0);
}
/**
 * Map a function over all entries in a list, creating a new list with the results.
 * Tail recursive.
 * @template T the element type of the argument list
 * @template U the return type of the function
 * @param f the function to map
 * @param xs the argument list
 * @returns The result of mapping f over xs.
 */
function map(f, xs) {
    function $map(f, xs, acc) {
        return is_null(xs)
            ? reverse(acc)
            : $map(f, tail(xs), pair(f(head(xs)), acc));
    }
    return $map(f, xs, null);
}
/**
 * Build a list using a function from list indices to entries.
 * Tail recursive.
 * @template T the type of elements in the list to build
 * @param fun Calling fun(i) yields the element at index i (starting at 0)
 * @param n the length of the new list
 * @returns the new list
 */
function build_list(fun, n) {
    function $build_list(i, fun, already_built) {
        return i < 0
            ? already_built
            : $build_list(i - 1, fun, pair(fun(i), already_built));
    }
    return $build_list(n - 1, fun, null);
}
/**
 * Call a function on each element in a list.
 * Iterative.
 * @template T the element type of the list
 * @template U the return type of the function (ignored)
 * @param fun the function to call on each element
 * @param xs the list
 */
function for_each(fun, xs) {
    while (!is_null(xs)) {
        fun(head(xs));
        xs = tail(xs);
    }
}
/**
 * Reverse a list.
 * Tail recursive.
 * @template T the element type of the list
 * @param xs the list to reverse
 * @returns A new list containing the entries of xs in reverse order.
 */
function reverse(xs) {
    function $reverse(original, reversed) {
        return is_null(original)
            ? reversed
            : $reverse(tail(original), pair(head(original), reversed));
    }
    return $reverse(xs, null);
}
/**
 * Concatenate two lists.
 * Tail recursive.
 * @template T the element type of the lists
 * @param xs first list
 * @param ys second list
 * @returns Returns a list that results from appending the list ys to the end
 *     of list xs.
 */
function append(xs, ys) {
    function $append(xs, ys, cont) {
        return is_null(xs)
            ? cont(ys)
            : $append(tail(xs), ys, function (zs) { return cont(pair(head(xs), zs)); });
    }
    return $append(xs, ys, function (xs) { return xs; });
}
/**
 * Search for an element in a list.
 * Tail recursive.
 * @template T the element type of the list
 * @param elem the element to search for
 * @param xs the list to search in
 * @returns The first postfix sublist that has elem as its first element,
 *     or null if elem does not exist in xs.
 */
function member(elem, xs) {
    return is_null(xs)
        ? null
        : elem === head(xs)
            ? xs
            : member(elem, tail(xs));
}
/**
 * Remove one occurrence of an element from a list.
 * @template T the element type of the list
 * @param elem the element to remove
 * @param xs the list to remove elem from
 * @returns A version of xs where the first occurrence of elem (if any) has
 *      been removed.
 */
function remove(elem, xs) {
    function $remove(v, xs, acc) {
        // Ensure that typechecking of append and reverse are done independently
        var app = append;
        var rev = reverse;
        return is_null(xs)
            ? app(rev(acc), xs)
            : v === head(xs)
                ? app(rev(acc), tail(xs))
                : $remove(v, tail(xs), pair(head(xs), acc));
    }
    return $remove(elem, xs, null);
}
/**
 * Remove all occurrences of an element from a list.
 * @template T the element type of the list
 * @param elem the element to remove
 * @param xs the list to remove elem from
 * @returns A version of xs where all occurrences of elem (if any) have been
 *      removed.
 */
function remove_all(v, xs) {
    function $remove_all(v, xs, acc) {
        // Ensure that typechecking of append and reverse are done independently
        var app = append;
        var rev = reverse;
        return is_null(xs)
            ? app(rev(acc), xs)
            : v === head(xs)
                ? $remove_all(v, tail(xs), acc)
                : $remove_all(v, tail(xs), pair(head(xs), acc));
    }
    return $remove_all(v, xs, null);
}
/**
 * Keep the elements satisfying a given predicate.
 * Tail recursive.
 * @template T the element type of the list
 * @param pred the predicate
 * @param xs the list
 * @returns The sublist of xs containing exactly those elements for which
 *      pred is true.
 */
function filter(pred, xs) {
    function $filter(pred, xs, acc) {
        return is_null(xs)
            ? reverse(acc)
            : pred(head(xs))
                ? $filter(pred, tail(xs), pair(head(xs), acc))
                : $filter(pred, tail(xs), acc);
    }
    return $filter(pred, xs, null);
}
/**
 * Check if a predicate holds for all elements of a list.
 * @template T the element type of the list
 * @param pred the predicate
 * @param xs the list
 * @returns True iff pred returns true for all elements in xs.
 */
function all(pred, xs) {
    return is_null(xs) ? true : pred(head(xs)) && all(pred, tail(xs));
}
/**
 * Create a list containing successive numbers.
 * Tail recursive.
 * @param start the first and smallest number in the list
 * @param end the last number in the list
 * @returns A list containing the numbers from start to end, inclusive, in order.
 */
function enum_list(start, end) {
    function $enum_list(start, end, acc) {
        // Ensure that typechecking of reverse are done independently
        var rev = reverse;
        return start > end
            ? rev(acc)
            : $enum_list(start + 1, end, pair(start, acc));
    }
    return $enum_list(start, end, null);
}
/**
 * Get the element at a given index of a list.
 * Tail recursive. Indices start at 0.
 * @template T the element type of the list
 * @param xs the list to index into
 * @param i the index
 * @returns The element at index i,
 *     or undefined if i is greater than or equal to the length of the list.
 */
function list_ref(xs, i) {
    return is_null(xs)
        ? undefined
        : i === 0
            ? head(xs)
            : list_ref(tail(xs), i - 1);
}
/**
 * Combines all elements of a list using a binary operation,
 * in right-to-left order.
 * Tail recursive.
 * accumulate(op, zero, list(1, 2, 3)) results in op(1, op(2, op(3, zero)))
 * @template T the element type of the list
 * @template U the type of the result of the binary operation
 * @param op the binary operation
 * @param initial the initial value
 * @param xs the list
 * @returns The result of combining the elements of xs using op,
 *      from right to left starting with initial.
 */
function accumulate(op, initial, xs) {
    function $accumulate(op, initial, xs, cont) {
        return is_null(xs)
            ? cont(initial)
            : $accumulate(op, initial, tail(xs), function (x) { return cont(op(head(xs), x)); });
    }
    return $accumulate(op, initial, xs, function (x) { return x; });
}
/**
 * Combines all elements of a list using a binary operation,
 * in left-to-right order.
 * Tail recursive.
 * fold_left(op, zero, list(1, 2, 3)) results in op(op(op(zero, 1), 2), 3)
 * @template T the element type of the list
 * @template U the type of the result of the binary operation
 * @param op the binary operation
 * @param initial the initial value
 * @param xs the list
 * @returns The result of combining the elements of xs using op,
 *      from left to right starting with initial.
 */
function fold_left(f, initial, xs) {
    return is_null(xs)
        ? initial
        : fold_left(f, f(initial, head(xs)), tail(xs));
}
/**
 * Flatten a list of lists into a single list, in order.
 * @template T the element type of the lists
 * @param xss the list of lists
 * @returns The result of concatenating all the lists, in order.
 */
function flatten(xss) {
    return accumulate(append, empty_list(), xss);
}
