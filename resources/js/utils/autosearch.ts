import { useMemo, useState } from "react";

class NodeTree {
    value: string | null;
    left: NodeTree | null;
    right: NodeTree | null;
    constructor(value: string) {
        this.value = value; // The value of the node (a string in this case)
        this.left = null;   // The left child node
        this.right = null;  // The right child node
    }
}

// BinarySearchTree class to manage the tree structure
class BinarySearchTree {
    root: NodeTree | null;
    constructor() {
        this.root = null; // The root of the tree, initially null
    }

    // Method to insert a new value into the tree
    insert(value: string) {
        const newNode = new NodeTree(value);
        // If the tree is empty, the new node becomes the root
        if (this.root === null) {
            this.root = newNode;
        } else {
            // Otherwise, find the correct position in the tree
            this.insertNode(this.root, newNode);
        }
    }

    // Helper method to recursively find the correct spot for the new node
    insertNode(node: NodeTree, newNode: NodeTree) {
        // If the new value is less than the current node's value, go left
        if (newNode?.value < node?.value) {
            // If there's no left child, insert the new node here
            if (node.left === null) {
                node.left = newNode;
            } else {
                // Otherwise, continue searching down the left subtree
                this.insertNode(node.left, newNode);
            }
        } else {
            // If the new value is greater than or equal, go right
            // If there's no right child, insert the new node here
            if (node.right === null) {
                node.right = newNode;
            } else {
                // Otherwise, continue searching down the right subtree
                this.insertNode(node.right, newNode);
            }
        }
    }

    /**
   * Searches the tree for all values that start with a given prefix,
   * using an iterative approach with a stack.
   * @param {string} prefix The prefix to search for.
   * @returns {string[]} An array of matching strings.
   */
    search(prefix: string): string[] {
        const results: string[] = [];
        if (this.root === null) {
            return results;
        }

        // A stack to keep track of nodes to visit
        const stack: NodeTree[] = [this.root];

        while (stack.length > 0) {
            // Using ! tells TypeScript that we know stack.pop() will not be undefined here
            const node = stack.pop()!;

            // If the current node's value starts with the prefix, add it to results
            if (node?.value.toLowerCase().startsWith(prefix.toLowerCase())) {
                results.push(node?.value);
            }

            // Decide which child nodes to add to the stack for future processing
            if (prefix.toLowerCase() < node?.value.toLowerCase() && node.left !== null) {
                stack.push(node.left);
            }

            if (prefix.toLowerCase() < node?.value.toLowerCase().slice(0, prefix.length) + String.fromCharCode(255) && node.right !== null) {
                stack.push(node.right);
            }
        }
        return results;
    }
}

/**
 * Converts an array of strings into a Binary Search Tree.
 * @param {string[]} arr The array of strings to convert.
 * @returns {BinarySearchTree} The resulting binary search tree.
 */
const arrayToBST = (arr: Array<string>) => {
    const tree = new BinarySearchTree();
    // Iterate over the array and insert each element into the tree
    arr.forEach(value => tree.insert(value));
    return tree;
};

function customArrayToBST<T>(arr: Array<T>, key?: string) {
    if (!key) {
        return arrayToBST(arr)
    } else {
        const tree = new BinarySearchTree();
        arr.forEach((item) => {
            tree.insert(item[key])
        })
        return tree
    }
}

export function useSearch(list: Array<string>, key?: string) {
    const [searchResult, setSearchResult] = useState<Array<string>>([])
    const t = useMemo(() => {
        const a = customArrayToBST(list, key)
        return a
    }, [list])

    function search(str: string) {
         setSearchResult(t.search(str))
    }

    function resetSearch() {
        setSearchResult([])
    }

    return {
        items: t,
        search,
        resetSearch,
        searchResult
    }
}