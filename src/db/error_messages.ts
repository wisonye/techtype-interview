//
// Error constants
//
export const ErrorMessage = {
    emptyProperties: `Properties are empty.`,
    invalidNodeName: `The node name is invalid; it must not contain any "/" and must have at least one character.`,
    invalidNodePath: `The node path is invalid; it must start with "/" and be longer than one character.`,
    invalidParentNodePath: `The parent node path is invalid; it must start with "/" and be longer than one character.`,
    nodeExists: `Node already exists.`,
    nodeNonExists: `Node doesn't exists.`,
    parentNodeDoesntExists: `Parent node doesn't exists.`,
    failedToCreateNode: `Failed to create node`,
    failedToAddProps: `Failed to add properties to node`,
    queryNodeNotFound: `Query node not found.`
}
