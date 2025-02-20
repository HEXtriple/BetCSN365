import { head, tail, list, Pair, List, append, is_null } from './list';

const black: boolean = false;
const red: boolean = true;

/**
 * A red-black tree.
 * A tree node has a color, numeric key, data of type T, left subtree, and
 * right subtree.
 * @template T type of data stored in the red-black tree
 */
export type RBTree<T> = RBLeaf | RBTreeNode<T>;
export type RBLeaf = null;
export type RBTreeNode<T> = [boolean, number, T, RBTree<T>, RBTree<T>];

/**
 * Check whether a tree node is red.
 * @template T type of data stored in the red-black tree
 * @param node node to check
 * @returns Returns true if the node is red, false otherwise.
 */
export function is_red<T>(node : RBTreeNode<T>): boolean {
    return node[0];
}

/**
 * Get the key from a tree node.
 * @template T type of data stored in the red-black tree
 * @param node node to get the key from
 * @returns Returns the key from node.
 */
export function key<T>(node : RBTreeNode<T>): number {
    return node[1];
}

/**
 * Get the value from a tree node.
 * @template T type of data stored in the red-black tree
 * @param node node to get the value from
 * @returns Returns the value from node.
 */
export function value<T>(node : RBTreeNode<T>): T {
	return node[2];
}

/**
 * Get the left branch from a non-empty tree.
 * @template T type of data stored in the red-black tree
 * @param node tree node to get the left branch from
 * @returns Returns the tree corresponding to the left branch of node.
 */
export function left_branch<T>(node: RBTreeNode<T>): RBTree<T> {
	return node[3];
}

/**
 * Get the right branch from a non-empty tree.
 * @template T type of data stored in the red-black tree
 * @param node tree node to get the left branch from
 * @returns Returns the tree corresponding to the right branch of node.
 */
export function right_branch<T>(node: RBTreeNode<T>): RBTree<T> {
	return node[4];
}

/**
 * Create an empty red-black tree.
 * @template T type of data stored in the red-black tree
 * @returns Returns an empty red-black tree.
 */
export function make_empty_tree<T>(): RBTree<T> {
	return null;
}

/**
 * Check whether a tree is empty.
 * @template T type of data stored in the red-black tree
 * @param tree tree to check
 * @returns Returns true if tree is empty, false otherwise.
 */
export function is_empty_tree<T>(tree: RBTree<T>): tree is null {
	return tree === null;
}

// creates a leaf node with a specified color
function make_leaf<T>(color: boolean, key: number, value: T): RBTreeNode<T> {
	return make_tree(color, key, value, make_empty_tree(), make_empty_tree());
}

// creates a tree node
function make_tree<T>(color: boolean, key: number, value: T,
     left: RBTree<T>, right: RBTree<T>): RBTreeNode<T> {
    return [color, key, value, left, right];
}

/**
 * Compares two trees for structural equality.
 * @precondition Assumes that the values in the tree can be compared with '==='
 * @template T type of data stored in the red-black trees
 * @param tree1 one of the trees to compare
 * @param tree2 the other tree to compare
 * @returns Returns true if the trees have the same shape and the keys and
 *     values match at corresponding nodes.
 */
export function deep_equals<T>(tree1: RBTree<T>, tree2: RBTree<T>): boolean {
    if (is_empty_tree(tree1) && is_empty_tree(tree2)) {
        return true;
    } else if (!is_empty_tree(tree1) && !is_empty_tree(tree2)) {
        if (key(tree1) === key(tree2) && value(tree1) === value(tree2)) {
            return deep_equals(left_branch(tree1), left_branch(tree2)) &&
            deep_equals(right_branch(tree1), right_branch(tree2));
        }
    }
    // all other cases, the trees are not the same
    return false;
}

/**
 * Looks up the value corresponding to a key.
 * @template T type of data stored in the red-black tree
 * @param tree tree to search
 * @param key key of the requested value
 * @returns Returns the value corresponding to the key k, or undefined if
 *      the key does not exists in tree.
 */
export function search<T>(tree: RBTree<T>, k: number): T | undefined {
    if (is_empty_tree(tree)) {
        return undefined;
    } else if (key(tree) === k) {
        return value(tree);
    } else {
        return key(tree) > k
                ? search(left_branch(tree), k)
                : search(right_branch(tree), k);
    }
}

/**
 * Insert a key-value pair into the tree.
 * @template T type of data stored in the red-black tree
 * @param tree tree to insert into
 * @param new_key key to be inserted
 * @param new_value value corresponding to the key
 * @returns Returns a new tree with the key-value pair inserted, or if the key already exists
 *          updates the value to new_value.
 */
export function insert<T>(tree: RBTree<T>, new_key: number, new_value: T): RBTreeNode<T> {
    // last step: recolor root note black
    return recolor(insert_helper(tree, new_key, new_value), black);
}

function insert_helper<T>(tree: RBTree<T>, new_key: number, new_value: T): RBTreeNode<T> {
    if (is_empty_tree(tree)) {
        return make_leaf(red, new_key, new_value);
    } else if (key(tree) === new_key) {  // key already exists
        return make_tree(is_red(tree), new_key, new_value, left_branch(tree), right_branch(tree));
    } else {
        const k = key(tree);
        const left = left_branch(tree);
        const right = right_branch(tree);

        return k > new_key
            ? balance_left(is_red(tree), k, value(tree), insert_helper(left, new_key, new_value), right)
            : balance_right(is_red(tree), k, value(tree), left, insert_helper(right, new_key, new_value));
    }
}

// case 1 and 2, when new node is inserted on the left side
function balance_left<T>(parent_color: boolean, parent_key: number, parent_value: T,
    left_tree: RBTreeNode<T>, right_tree: RBTree<T>): RBTreeNode<T> {
    // parent is the z node
    // if z is red we don't need to do anything
    if (parent_color === black && is_red(left_tree)) {

        const left_left_tree = left_branch(left_tree);
        const right_left_tree = right_branch(left_tree);
        const left_left_red = !is_empty_tree(left_left_tree) && is_red(left_left_tree);
        const right_left_red = !is_empty_tree(right_left_tree) && is_red(right_left_tree);

        //the uncle is red, only need to recolor
        if (!is_empty_tree(right_tree) && is_red(right_tree)&&
        (left_left_red || right_left_red)) {
            return make_tree(red, parent_key, parent_value,
                recolor(left_tree, black),
                recolor(right_tree, black));

        } else if (left_left_red) {
            // case 1
            const y = left_tree;
            const x = left_left_tree;
            const a = left_branch(x);
            const b = right_branch(x);
            const c = right_branch(y);
            const d = right_tree;

            return make_tree(black, key(y), value(y),
                make_tree(red, key(x), value(x), a, b),  // we could use recolor here
                make_tree(red, parent_key, parent_value, c, d));

        } else if (right_left_red) {
            // case 2
            const x = left_tree;
            const y = right_left_tree;
            const a = left_branch(x);
            const b = left_branch(y);
            const c = right_branch(y);
            const d = right_tree;

            return make_tree(black, key(y), value(y),
                make_tree(red, key(x), value(x), a, b),
                make_tree(red, parent_key, parent_value, c, d));
        }
    }
    // nothing to do
    return make_tree(parent_color, parent_key, parent_value, left_tree, right_tree);
}

// case 3 or 4, when new node is inserted on the left side
function balance_right<T>(parent_color: boolean, parent_key: number, parent_value: T,
    left_tree: RBTree<T>, right_tree: RBTreeNode<T>): RBTreeNode<T> {
    // parent is the x node
    // if x is red we don't need to do anything
    if (parent_color === black && is_red(right_tree)) {

        const left_right_tree = left_branch(right_tree);
        const right_right_tree = right_branch(right_tree);
        const left_right_red = !is_empty_tree(left_right_tree) && is_red(left_right_tree);
        const right_right_red = !is_empty_tree(right_right_tree) && is_red(right_right_tree);

        // the uncle is red, only need to recolor
        if (!is_empty_tree(left_tree) && is_red(left_tree) &&
            (left_right_red || right_right_red)) {
            return make_tree(red, parent_key, parent_value,
                recolor(left_tree, black),
                recolor(right_tree, black));

        } else if (left_right_red) {
            // case 3
            const y = left_right_tree;
            const z = right_tree;
            const a = left_tree;
            const b = left_branch(y);
            const c = right_branch(y);
            const d = right_right_tree;

            return make_tree(black, key(y), value(y),
                make_tree(red, parent_key, parent_value, a, b),
                make_tree(red, key(z), value(z), c, d));
        } else if (right_right_red) {
            // case 4
            const y = right_tree;
            const z = right_right_tree;
            const a = left_tree;
            const b = left_right_tree;
            const c = left_branch(z);
            const d = right_branch(z);

            return make_tree(black, key(y), value(y),
                make_tree(red, parent_key, parent_value, a, b),
                make_tree(red, key(z), value(z), c, d));
        }
    }
    // nothing to do
    return make_tree(parent_color, parent_key, parent_value, left_tree, right_tree);
}

function recolor<T>(tree: RBTreeNode<T>, new_color: boolean): RBTreeNode<T> {
    return make_tree(new_color, key(tree), value(tree), left_branch(tree), right_branch(tree));
}

/**
 * Construct a red-black tree from a list of data.
 * @template T type of data stored in the red-black tree
 * @param elements list of key-value pairs
 * @returns Returns a red-black tree with all data inserted; if there are duplicate
 *          keys, the last corresponding value will be added.
 */
export function build_tree<T>(elements: List<Pair<number, T>>): RBTree<T> {
	function build(tree: RBTree<T>, elements: List<Pair<number, T>>): RBTree<T> {
        return is_null(elements)
               ? tree
               : build(insert(tree, head(elements)[0], head(elements)[1]), tail(elements));
	}
	return build(make_empty_tree(), elements);
}

/**
 * Returns the in-sorted values of a tree.
 * @template T type of data stored in the red-black tree
 * @param tree tree to get values of
 * @returns Returns a list of values from the tree following an in-order traversal.
 */
export function get_all_keys<T>(tree: RBTree<T>): List<number> {
    return is_empty_tree(tree)
        ? list()
        : append(append(get_all_keys(left_branch(tree)), list(key(tree))),
                    get_all_keys(right_branch(tree)));
}

/**
 * Returns the in-sorted values of a tree.
 * @template T type of data stored in the red-black tree
 * @param tree tree to get values of
 * @returns Returns a list of values from the tree following an in-order traversal.
 */
export function get_all_values<T>(tree: RBTree<T>): List<T> {
    return is_empty_tree(tree)
        ? list()
        : append(append(get_all_values(left_branch(tree)), list(value(tree))),
                    get_all_values(right_branch(tree)));
}


/**
 * Convenience function to print a tree in a textual format to the console.
 * Red nodes are marked with asterisk (*node*).
 * @template T type of data stored in the red-black tree
 * @param tree tree to print
 */
export function display_tree<T>(tree: RBTree<T>): void {
    display_tree_helper(tree, "", true);
}

function display_tree_helper<T>(tree: RBTree<T>, path: string, leftmost: boolean): void {
    if (tree === null) {
        return; // don't print the nulls
    } else {
        // print tree label, with indentation pre-fixed
        if (is_red(tree)) {
            console.log(path + "├─ *" + key(tree) + ": " + value(tree) + "*");
        } else {
            console.log(path + "├─ " + key(tree) + ": " + value(tree) + "");
        }

        // print right node first, then left
        if (leftmost) {
            display_tree_helper(right_branch(tree), "   " + path, false);
            display_tree_helper(left_branch(tree), "   " + path, leftmost);
        } else {
            display_tree_helper(right_branch(tree), path + "|  ", false);
            display_tree_helper(left_branch(tree), path + "|  ", leftmost);
        }
    }
}