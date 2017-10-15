import {
  parseJson,
  populateWithPath,
  marginate,
  tagNodeAsCompleted
} from './util';

const splice = Array.prototype.splice;

export const appendNodesToViewableTree = (state, payload) => {
  const {
    load, id, margin,
    payloadIsParsed,
    insertionPoint: refPoint,
    isChildOf } = payload;

  if (load.length === 0) return state;

  let subtree,
    insertionPoint;

  if (!payloadIsParsed) {
    subtree = parseJson(JSON.stringify(...load))
      .map(node => marginate(node, margin, isChildOf, id));

    insertionPoint = state.findIndex(each => each.meta.id === id);
  } else {
    subtree = load;
    insertionPoint = refPoint;
  }
  // todo reopen previously opened objects or array

  const tree = [...state];
  splice.apply(tree, [insertionPoint + 1, 0, ...subtree]);

  const insertionNode = tree[insertionPoint];
  if (!insertionNode.meta.isExpanded) {
    tagNodeAsCompleted(insertionNode, subtree, insertionPoint);
  }
  return tree;
};


export function removeNodesFromViewableTree(state, refPoint) {
  const skippedNodesFromStart = state.slice(0, refPoint + 1);
  const skippedNodesFromEnd = state.slice(refPoint + 1).filter(
    node => !node.meta.isChildof.includes(state[refPoint].meta.id));

  const tree = [...skippedNodesFromStart, ...skippedNodesFromEnd];
  tree[refPoint].meta.isExpanded = false;
  return tree;
}
