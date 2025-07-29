//
// This module functions like an SQLite database driver, encapsulating all database layer operations.
//

import { DatabaseSync } from 'node:sqlite'
import { Node, Property } from './schema'
import { is_valid_Path } from '../utils/validation'
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

    if (!is_valid_Path(path)) return { error_message: `'path' is invalid.` }

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
        db.close()

        return { error_message: `NotFound`}
    }
}

//
//
//
export const DatabaseDriver = {
    query_node_by_path
}
