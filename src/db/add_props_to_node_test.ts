import { default as assert } from 'node:assert'
import { test } from 'node:test'

import { Database, DatabaseError } from './sqlite_db'
import { ErrorMessage } from './error_messages'

test(`add_props_to_node should fail with: 'path' is invalid.`, (_) => {
    let result = Database.add_props_to_node(undefined, [])
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, ErrorMessage.invalidNodePath)

    result = Database.add_props_to_node(null, [])
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, ErrorMessage.invalidNodePath)

    result = Database.add_props_to_node("a/b/c", [])
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, ErrorMessage.invalidNodePath)
})

test(`add_props_to_node should fail with: Properties are empty.`, (_) => {
    let result = Database.add_props_to_node(`/abc`, [])
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, ErrorMessage.emptyProperties)
})

test(`add_props_to_node should fail with: Node doesn't exists`, (_) => {
    let result = Database.add_props_to_node(
        `/abc`,
        [
            { key: 'version', value: 1.0 },
            { key: 'fans', value: 2 }
        ]
    )
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, ErrorMessage.nodeNonExists)
})

test(`add_props_to_node should work`, (_) => {
    let result = Database.add_props_to_node(
        `/alphapc`,
        [
            { key: 'version', value: 1.0 },
            { key: 'fans', value: 2 }
        ]
    )
    assert.equal(Object.keys(result).length, 0)

    result = Database.add_props_to_node(
        `/alphapc`,
        [
            { key: 'version', value: 2.0 },
            { key: 'fans', value: 4 }
        ]
    )
    assert.equal(Object.keys(result).length, 0)
})
