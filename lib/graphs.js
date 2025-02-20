"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.undirected = undirected;
exports.build_array = build_array;
exports.mg_new = mg_new;
exports.mg_from_edges = mg_from_edges;
exports.lg_new = lg_new;
exports.lg_from_edges = lg_from_edges;
exports.lg_transpose = lg_transpose;
exports.lg_bfs_visit_order = lg_bfs_visit_order;
exports.lg_dfs_visit_order = lg_dfs_visit_order;
exports.mg_dfs_visit_order = mg_dfs_visit_order;
var list_1 = require("./list");
var queue_array_1 = require("./queue_array");
// Helper functions
/**
 * Add all reverse edges to an edge list, and remove all self loops.
 * @param el an edge list
 * @returns el with all reverse edges present, and all self loops removed
 */
function undirected(el) {
    if ((0, list_1.is_null)(el)) {
        return el;
    }
    else if ((0, list_1.head)((0, list_1.head)(el)) === (0, list_1.tail)((0, list_1.head)(el))) {
        return undirected((0, list_1.tail)(el));
    }
    else {
        var source_1 = (0, list_1.head)((0, list_1.head)(el));
        var target_1 = (0, list_1.tail)((0, list_1.head)(el));
        return (0, list_1.pair)((0, list_1.pair)(target_1, source_1), undirected((0, list_1.filter)(function (edge) { return (0, list_1.head)(edge) !== target_1
            || (0, list_1.tail)(edge) !== source_1; }, (0, list_1.tail)(el))));
    }
}
// Build an array based on a function computing the item at each index
function build_array(size, content) {
    var result = Array(size);
    for (var i = 0; i < size; i = i + 1) {
        result[i] = content(i);
    }
    return result;
}
/**
 * Create a new matrix graph with no edges
 * @param size the number of nodes
 * @returns the new matrix graph, where each inner array entry is false.
 */
function mg_new(size) {
    return { size: size, adj: build_array(size, function (_) { return build_array(size, function (_) { return false; }); }) };
}
/**
 * Create a new matrix graph with a given set of edges
 * @param size the number of nodes
 * @param edges an edge list
 * @precondition all node ids in the edge list are < size.
 * @returns the new matrix graph, with the given edges.
 */
function mg_from_edges(size, edges) {
    var result = mg_new(size);
    (0, list_1.for_each)(function (p) { return result.adj[(0, list_1.head)(p)][(0, list_1.tail)(p)] = true; }, edges);
    return result;
}
/**
 * Create a new ListGraph with no edges
 * @param size the number of nodes in the list graph
 * @returns a new list graph with size edges.
 */
function lg_new(size) {
    return { size: size, adj: build_array(size, function (_) { return null; }) };
}
/**
 * Create a new ListGraph with a given set of edges
 * @param size the number of nodes in the list graph
 * @param edges an edge list
 * @precondition all node ids in the edge list are < size.
 * @returns the new ListGraph, with the given edges.
 */
function lg_from_edges(size, edges) {
    var result = lg_new(size);
    (0, list_1.for_each)(function (p) { return result.adj[(0, list_1.head)(p)] = (0, list_1.pair)((0, list_1.tail)(p), result.adj[(0, list_1.head)(p)]); }, edges);
    return result;
}
/**
 * Transpose a list graph
 * @param adj input list graph
 * @returns the transpose of adj
 */
function lg_transpose(_a) {
    var size = _a.size, adj = _a.adj;
    var result = lg_new(size);
    for (var i = 0; i < size; i = i + 1) {
        (0, list_1.for_each)(function (p) { return result.adj[p] = (0, list_1.pair)(i, result.adj[p]); }, adj[i]);
    }
    return result;
}
// Graph algorithms
/**
 * Node colours for traversal algorithms
 * @constant white an unvisited node
 * @constant grey a visited but not finished node
 * @constant black a finished node
 */
var white = 1;
var grey = 2;
var black = 3;
/**
 * Get the visit order of a breadth-first traversal of a ListGraph.
 * @param adj the list graph
 * @param initial the id of the starting node. Default 0.
 * @returns A queue with the visited nodes in visiting order.
 */
function lg_bfs_visit_order(_a, initial) {
    var adj = _a.adj, size = _a.size;
    if (initial === void 0) { initial = 0; }
    var result = (0, queue_array_1.empty)(); // nodes in the order they are being visited
    var pending = (0, queue_array_1.empty)(); // grey nodes to be processed
    var colour = build_array(size, function (_) { return white; });
    // visit a white node
    function bfs_visit(current) {
        colour[current] = grey;
        (0, queue_array_1.enqueue)(current, result);
        (0, queue_array_1.enqueue)(current, pending);
    }
    // paint initial node grey (all others are initialized to white)
    bfs_visit(initial);
    while (!(0, queue_array_1.is_empty)(pending)) {
        // dequeue the head node of the grey queue
        var current = (0, queue_array_1.head)(pending);
        (0, queue_array_1.dequeue)(pending);
        // Paint all white nodes adjacent to current node grey and enqueue them.
        var adjacent_white_nodes = (0, list_1.filter)(function (node) { return colour[node] === white; }, adj[current]);
        (0, list_1.for_each)(bfs_visit, adjacent_white_nodes);
        // paint current node black; the node is now done.
        colour[current] = black;
    }
    return result;
}
/**
 * Get the visit order of a depth-first traversal of a ListGraph.
 * @param adj the list graph
 * @param restart_order the order of nodes to restart the traversal in.
 *      Default: in numeric order 0, 1, 2, ...
 * @returns A queue with the visited nodes in visiting order.
 */
function lg_dfs_visit_order(_a, restart_order) {
    var adj = _a.adj, size = _a.size;
    if (restart_order === void 0) { restart_order = null; }
    var result = (0, queue_array_1.empty)();
    var colour = build_array(size, function (_) { return white; });
    if (restart_order === null) {
        // if no order is given, initialize with all nodes enumerated
        restart_order = (0, list_1.enum_list)(0, size - 1);
    }
    else { }
    // Visit a node.  Each node is processed at most once.
    function dfs_visit(current) {
        if (colour[current] === white) {
            colour[current] = grey;
            (0, queue_array_1.enqueue)(current, result);
            (0, list_1.for_each)(dfs_visit, adj[current]);
            colour[current] = black;
        }
        else { }
    }
    (0, list_1.for_each)(dfs_visit, restart_order);
    return result;
}
/**
 * Get the visit order of a depth-first traversal of a MatrixGraph.
 * @param adj the graph
 * @param restart_order the order of nodes to restart the traversal in.
 *      Default: in numeric order 0, 1, 2, ...
 * @returns A queue with the visited nodes in visiting order.
 */
function mg_dfs_visit_order(_a, restart_order) {
    var adj = _a.adj, size = _a.size;
    if (restart_order === void 0) { restart_order = null; }
    var result = (0, queue_array_1.empty)();
    var colour = build_array(size, function (_) { return white; });
    if (restart_order === null) {
        restart_order = (0, list_1.enum_list)(0, size - 1);
    }
    else { }
    // visit a node. Each node is processed at most once.
    function dfs_visit(current) {
        if (colour[current] === white) {
            colour[current] = grey;
            (0, queue_array_1.enqueue)(current, result);
            for (var sink = 0; sink < size; sink = sink + 1) {
                if (adj[current][sink]) {
                    dfs_visit(sink);
                }
                else { }
            }
            colour[current] = black;
        }
        else { }
    }
    (0, list_1.for_each)(dfs_visit, restart_order);
    return result;
}
