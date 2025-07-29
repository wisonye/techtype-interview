import { default as assert } from 'node:assert'
import { test } from 'node:test'

import { DatabaseDriver, DatabaseError } from './sqlite_db'
import { Node } from './schema'

test(`query_node_by_path should fail with: 'path' is invalid.`, (_) => {
    const query_path = `alphapc`
    let result = DatabaseDriver.query_node_by_path(query_path)
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, `'path' is invalid.`)

    result = DatabaseDriver.query_node_by_path(null)
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, `'path' is invalid.`)

    result = DatabaseDriver.query_node_by_path(undefined)
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, `'path' is invalid.`)
})

test(`query_node_by_path should fail with: NotFound`, (_) => {
    const query_path = `/alphapc/notexists`
    const result = DatabaseDriver.query_node_by_path(query_path)
    assert.equal('error_message' in result, true)
    assert.equal((result as DatabaseError).error_message, `NotFound`)
})

test(`query_node_by_path should work with path: /alphapc/storage`, (_) => {
    const query_path = `/alphapc/storage`
    const result = DatabaseDriver.query_node_by_path(query_path)
    assert.equal('id' in result, true)

    const node = result as Node
    assert.equal(node.name, 'Storage')
    assert.equal(node.props.length == 0, true)
    assert.equal(node.children.length == 2, true)

    assert.equal(node.children[0].name, 'SSD')
    assert.equal(node.children[0].props.length == 2, true)
    assert.equal(node.children[0].props[0].key, 'Capacity')
    assert.equal(node.children[0].props[0].value, 1024)
    assert.equal(node.children[0].props[1].key, 'WriteSpeed')
    assert.equal(node.children[0].props[1].value, 250)

    assert.equal(node.children[1].name, 'HDD')
    assert.equal(node.children[1].props.length == 2, true)
    assert.equal(node.children[1].props[0].key, 'Capacity')
    assert.equal(node.children[1].props[0].value, 5120)
    assert.equal(node.children[1].props[1].key, 'WriteSpeed')
    assert.equal(node.children[1].props[1].value, 1.724752)
})


test(`query_node_by_path should work with path: /alphapc/processing`, (_) => {
    const query_path = `/alphapc/processing`
    const result = DatabaseDriver.query_node_by_path(query_path)
    assert.equal('id' in result, true)

    const node = result as Node
    assert.equal(node.name, 'Processing')
    assert.equal(node.props.length == 1, true)

    assert.equal(node.props[0].key, 'RAM')
    assert.equal(node.props[0].value, 3200)

    assert.equal(node.children.length == 2, true)

    assert.equal(node.children[0].name, 'CPU')
    assert.equal(node.children[0].props.length == 2, true)
    assert.equal(node.children[0].props[0].key, 'Cores')
    assert.equal(node.children[0].props[0].value, 4)
    assert.equal(node.children[0].props[1].key, 'Power')
    assert.equal(node.children[0].props[1].value, 2.41)

    assert.equal(node.children[1].name, 'Graphics')
    assert.equal(node.children[1].props.length == 2, true)
    assert.equal(node.children[1].props[0].key, 'Ports')
    assert.equal(node.children[1].props[0].value, 8)
    assert.equal(node.children[1].props[1].key, 'RAM')
    assert.equal(node.children[1].props[1].value, 4000)
})
