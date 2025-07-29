import { default as assert } from 'node:assert'
import { test } from 'node:test'

import { DatabaseDriver, DatabaseError } from './sqlite_db'

test(`add_props_to_node should fail with: 'path' is invalid.`, (_) => {
    let result = DatabaseDriver.add_props_to_node(undefined, [])
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, `'path' is invalid.`)

    result = DatabaseDriver.add_props_to_node(null, [])
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, `'path' is invalid.`)

    result = DatabaseDriver.add_props_to_node("a/b/c", [])
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, `'path' is invalid.`)
})

test(`add_props_to_node should fail with: 'props' is empty.`, (_) => {
    let result = DatabaseDriver.add_props_to_node(`/abc`, [])
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, `'props' is empty.`)
})

test(`add_props_to_node should work`, (_) => {
    let result = DatabaseDriver.add_props_to_node(
        `/alphapc`,
        [
            { key: 'version', value: 1.0 },
            { key: 'fans', value: 2 }
        ]
    )
    assert.equal(Object.keys(result).length, 0)

    result = DatabaseDriver.add_props_to_node(
        `/alphapc`,
        [
            { key: 'version', value: 2.0 },
            { key: 'fans', value: 4 }
        ]
    )
    assert.equal(Object.keys(result).length, 0)
})
