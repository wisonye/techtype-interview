import { default as assert } from 'node:assert'
import { test } from 'node:test'

import { Database, DatabaseError } from './sqlite_db'
import { Node } from './schema'
import { ErrorMessage } from './error_messages'

test(`create_node_with_parent_path should fail with: 'name' is invalid.`, (_) => {
    let result = Database.create_node_with_parent_path(undefined)
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, ErrorMessage.invalidNodeName)

    result = Database.create_node_with_parent_path(null)
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, ErrorMessage.invalidNodeName)

    result = Database.create_node_with_parent_path("/abc")
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, ErrorMessage.invalidNodeName)

    result = Database.create_node_with_parent_path("a/b/c")
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, ErrorMessage.invalidNodeName)
})

test(`create_node_with_parent_path should fail with: 'parent_path' is invalid.`, (_) => {
    let result = Database.create_node_with_parent_path('abc', 'abc')
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, ErrorMessage.invalidParentNodePath)

    result = Database.create_node_with_parent_path('abc', 'a/b/c')
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, ErrorMessage.invalidParentNodePath)
})

test(`create_node_with_parent_path should fail with: Parent node doesn't exists.`, (_) => {
    let result = Database.create_node_with_parent_path('abc', '/notexists')
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, ErrorMessage.parentNodeDoesntExists)
})

test(`create_node_with_parent_path should fail with: Node exists.`, (_) => {
    let result = Database.create_node_with_parent_path('alphapc')
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, ErrorMessage.nodeExists)

    result = Database.create_node_with_parent_path('storage', '/alphapc')
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, ErrorMessage.nodeExists)

    result = Database.create_node_with_parent_path('processing', '/alphapc')
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, ErrorMessage.nodeExists)

    result = Database.create_node_with_parent_path('SSD', '/alphapc/storage')
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, ErrorMessage.nodeExists)
})


test(`create_node_with_parent_path should work`, (_) => {
    //
    // Make sure to reset db, otherwise, this test won't work!!!
    //
    Database.reset_db()

    let result = Database.create_node_with_parent_path('Laptop')
    assert.equal('id' in result, true)
    assert.equal((result as Node).name, `Laptop`)
    assert.equal((result as Node).path, `/laptop`)
    const parent_id = (result as Node).id

    result = Database.create_node_with_parent_path('GPU', '/laptop')
    assert.equal('id' in result, true)
    assert.equal((result as Node).name, `GPU`)
    assert.equal((result as Node).path, `/laptop/gpu`)
    assert.equal((result as Node).parent_id, parent_id)


})
