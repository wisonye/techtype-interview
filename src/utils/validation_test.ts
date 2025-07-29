import { default as assert } from 'node:assert'
import { test } from 'node:test'

import { Validation } from './validation'

test(`is_valid_path should work`, (_) => {
    assert.equal(Validation.is_valid_path(false, `/a`), true)
    assert.equal(Validation.is_valid_path(false, `/abc123`), true)
    assert.equal(Validation.is_valid_path(false, `/a/b/c`), true)
    assert.equal(Validation.is_valid_path(true, undefined), true)
})

test(`is_valid_path should fail`, (_) => {
    assert.equal(Validation.is_valid_path(false, undefined), false)
    assert.equal(Validation.is_valid_path(false, null), false)
    assert.equal(Validation.is_valid_path(false, `abc123`), false)
    assert.equal(Validation.is_valid_path(false, `a/b/c`), false)
})


test(`is_valid_name should work`, (_) => {
    assert.equal(Validation.is_valid_name(`a`), true)
    assert.equal(Validation.is_valid_name(`abc`), true)
    assert.equal(Validation.is_valid_name(`abc123`), true)
})

test(`is_valid_name should fail`, (_) => {
    assert.equal(Validation.is_valid_name(`/`), false)
    assert.equal(Validation.is_valid_name(`/abc123`), false)
    assert.equal(Validation.is_valid_name(`/a/b/c`), false)
    assert.equal(Validation.is_valid_name(`a/b/c`), false)
    assert.equal(Validation.is_valid_name(undefined), false)
    assert.equal(Validation.is_valid_name(null), false)
})
