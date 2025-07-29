//
// This module functions like an SQLite database driver, encapsulating all database layer operations.
//

import { DatabaseSync, SQLOutputValue, StatementResultingChanges } from 'node:sqlite'
import { Node, Property } from './schema'
import { Validation } from '../utils/validation'
import { debug_log } from '../utils/logger'

//
//
//
export interface DatabaseError {
    error_message: string
}

//
//
//
const open_database = (): DatabaseSync => {
    const DB_FILE = process.env.DB_FILE || './db/demo.db'
    debug_log(`open_database`, `DB_FILE: ${DB_FILE}`)

    const db = new DatabaseSync(DB_FILE)

    //
    // Enable cascade deletion.
    //
    db.exec(`PRAGMA foreign_keys = ON;`)
    
    return db
}

//
// Reset DB by running `db/reset-db.sql`, only for unit test!!!
//
const reset_db = () => {
    const db = open_database()
    try {
        //
        // By default, `db/demo.db` has the following records in `nodes`:
        //
        // sqlite> .read db/reset-db.sql
        // ┌────┬────────────┬───────────┬──────────────────────────────┐
        // │ id │    name    │ parent_id │             path             │
        // ├────┼────────────┼───────────┼──────────────────────────────┤
        // │ 1  │ AlphaPC    │           │ /alphapc                     │
        // │ 2  │ Processing │ 1         │ /alphapc/processing          │
        // │ 3  │ CPU        │ 2         │ /alphapc/processing/cpu      │
        // │ 4  │ Graphics   │ 2         │ /alphapc/processing/graphics │
        // │ 5  │ Storage    │ 1         │ /alphapc/storage             │
        // │ 6  │ SSD        │ 5         │ /alphapc/storage/ssd         │
        // │ 7  │ HDD        │ 5         │ /alphapc/storage/hdd         │
        // └────┴────────────┴───────────┴──────────────────────────────┘
        //
        db.exec('DELETE FROM nodes WHERE id > 7;')
    } catch (error) {
        debug_log(`reset-db`, `error: ${JSON.stringify(error, null, 4)}`)
    } finally {
        debug_log(`reset-db`, `database closed.`)
        db.close()
    }
}

//
// Return the children by the given parent node id
//
const get_node_with_pros_and_children = (db: DatabaseSync, node: Node): Node => {
    try {
        //
        // Query node's properties
        //
        // let sql = db.prepare('SELECT * FROM properties WHERE node_id = ?;')
        let sql = db.prepare('SELECT key, value FROM properties WHERE node_id = ?;')
        const props = sql.all(node.id)
        debug_log(`get_node_with_pros_and_children`, `props: ${JSON.stringify(props, null, 4)}`)

        //
        // Query node's children
        //
        // sql = db.prepare(`SELECT * FROM nodes WHERE parent_id = ? ORDER BY name;`)
        sql = db.prepare(`SELECT id, name FROM nodes WHERE parent_id = ?;`)
        const child_nodes = sql.all(node.id!)
        const children = child_nodes.map(child => get_node_with_pros_and_children(db, child as any))

        return {
            ...node,
            props: props !== undefined ? 
                props.map((p): Property => {
                    return {
                        // node_id: p.node_id as number,
                        node_id: undefined,
                        key: p.key as string,
                        value: p.value as number
                    }
                }) : undefined ,
            children: children.length > 0 ? children : undefined
        }

    } catch (error) {
        debug_log(`get_node_with_pros_and_children`, `error: ${JSON.stringify(error, null, 4)}`)
        return node
    }
}


//
// Return the node and its children by the given path
//
const query_node_by_path = (path: string): Node | DatabaseError => {
    debug_log(`query_node_by_path`, `path: ${path}`)

    if (!Validation.is_valid_path(false, path)) return { error_message: `'path' is invalid.` }

    const db = open_database()
    try {
        //
        // Query node
        //
        let sql = db.prepare('SELECT id, name, path FROM nodes WHERE path = ?;')
        // const node: Record<string, SQLOutputValue> = sql.get(path)
        const node = sql.get(path.trim().toLowerCase())
        debug_log(`query_node_by_path`, `node: ${JSON.stringify(node, null, 4)}`)

        if (node === undefined) return { error_message: `NotFound`}

        let result_node: Node = {
            id: node.id as number,
            name: node.name as string,
            path: node.path as string
        }

        return get_node_with_pros_and_children(db, result_node)
    } catch (error) {
        debug_log(`query_node_by_path`, `error: ${JSON.stringify(error, null, 4)}`)
        return { error_message: `NotFound`}
    } finally {
        debug_log(`query_node_by_path`, `database closed.`)
        db.close()
    }
}

//
// Create node by the given parent path
//
const create_node_with_parent_path = (name: string, parent_path?: string): Node | DatabaseError => {
    if (!Validation.is_valid_name(name)) return { error_message: `'name' is invalid.` }
    if (!Validation.is_valid_path(true, parent_path)) return { error_message: `'parent_path' is invalid.` }

    const db = open_database()
    const fixed_name = name.trim()
    const fixed_parent_path = parent_path === undefined ? undefined : parent_path.trim().toLowerCase()
    debug_log(`create_node_with_parent_path`, `fixed_name: ${fixed_name}, fixed_parent_path: ${fixed_parent_path}`)

    try {

        //
        // Query parent node
        //
        let parent_node: Record<string, SQLOutputValue> = undefined
        if (fixed_parent_path !== undefined) {
            let sql = db.prepare('SELECT id FROM nodes WHERE path = ?;')
            parent_node = sql.get(fixed_parent_path)
            debug_log(`create_node_with_parent_path`, `parent_node: ${JSON.stringify(parent_node, null, 4)}`)

            if (parent_node === undefined) return { error_message: `Parent node doesn't exists.`}
        }

        //
        // New node's path shouldn't exists
        //
        const node_path = fixed_parent_path === undefined ?
            `/${fixed_name}`.toLowerCase() :
            `${fixed_parent_path}/${fixed_name}`.toLowerCase()
        debug_log(`create_node_with_parent_path`, `node_path: ${JSON.stringify(node_path, null, 4)}`)

        let sql = db.prepare('SELECT id FROM nodes WHERE path = ?;')
        const exists_node = sql.get(node_path)
        debug_log(`create_node_with_parent_path`, `exists_node: ${JSON.stringify(exists_node, null, 4)}`)

        if (exists_node !== undefined) return  { error_message: `Node exists.`}

        //
        // Create the node
        //
        let result: StatementResultingChanges
        if (parent_path === undefined ) {
            sql = db.prepare('INSERT INTO nodes(name, path) VALUES(?, ?);')
            result = sql.run(fixed_name, node_path)
        } else {
            sql = db.prepare('INSERT INTO nodes(name, parent_id, path) VALUES(?, ?, ?);')
            result = sql.run(fixed_name, parent_node.id, node_path)
        }
        debug_log(`create_node_with_parent_path`, `result: ${JSON.stringify(result, null, 4)}`)

        const new_node: Node = {
            id: result.lastInsertRowid as number,
            name: fixed_name,
            path: node_path,
        }

        if (fixed_parent_path !== undefined && parent_node !== undefined) {
            new_node.parent_id = parent_node.id as number
        }

        return new_node
    } catch (error) {
        debug_log(`create_node_with_parent_path`, `error: ${JSON.stringify(error, null, 4)}`)
        return { error_message: `Failed to create node.`}
    } finally {
        db.close()
        debug_log(`create_node_with_parent_path`, `database closed.`)
    }
}

//
// Add properties to the exists node
//
const add_props_to_node = (
    path: string,
    props: Array<{ key: string, value: number }>
): {} | DatabaseError => {
    debug_log(`add_props_to_node`, `props: ${JSON.stringify(props, null, 4)}`)

    if (!Validation.is_valid_path(false, path)) return { error_message: `'path' is invalid.` }
    if (props.length == 0) return { error_message: `'props' is empty.` }

    const fixed_path = path.trim().toLowerCase()
    debug_log(`add_props_to_node`, `fixed_path: ${fixed_path}`)

    const db = open_database()
    try {
        //
        // Query node
        //
        let sql = db.prepare('SELECT id, name, path FROM nodes WHERE path = ?;')
        const node = sql.get(fixed_path)
        debug_log(`add_props_to_node`, `node: ${JSON.stringify(node, null, 4)}`)

        if (node === undefined) return { error_message: `Node doesn't exists.`}

        //
        // Insert or update
        //
        for (let index in props) {
            // debug_log(`add_props_to_node`, `prop: ${JSON.stringify(props[index], null, 4)}`)
            sql = db.prepare(`
                INSERT INTO properties(node_id, key, value) VALUES(?, ?, ?)
                ON CONFLICT(node_id, key) DO UPDATE SET value = ?;
            `)
            const insert_or_update_result = sql.run(
                node.id,
                props[index].key,
                props[index].value,
                props[index].value
            )
            debug_log(
                `add_props_to_node`,
                `insert_or_update_result: ${JSON.stringify(insert_or_update_result, null, 4)}`
            )
        }

        return {}
    } catch (error) {
        debug_log(`add_props_to_node`, `error: ${JSON.stringify(error, null, 4)}`)
        return { error_message: `Failed to add property to node`}
    } finally {
        debug_log(`add_props_to_node`, `database closed.`)
        db.close()
    }
}

//
//
//
export const DatabaseDriver = {
    add_props_to_node,
    create_node_with_parent_path,
    query_node_by_path,
    reset_db
}
