import { Router, Request, Response } from 'express'
import { Database, DatabaseError } from '../db/sqlite_db'
import { debug_log } from '../utils/logger'

const router = Router()

//
// Format node as tree-like structure
//
const format_node = (node: any): any => {
    const result: any = {}

    // console.log(`>>> node.props: ${JSON.stringify(node.props, null, 4)}`)
    if (node.props && Object.keys(node.props).length > 0) {
        for (let p of node.props) {
            // console.log(`>>> node.prop: ${JSON.stringify(p, null, 4)}`)
            result[`${p.key}`] = p.value
        }
    }

    if (node.children && node.children.length > 0) {
        for (const child of node.children) {
            result[child.name] = format_node(child)
        }
    }

    return result
}

//
// GET /api/node - Get node subtree
//
const GET_ROUTE_PATH = `/api/node`
router.get('/', (req: Request, res: Response) => {
    try {
        //
        // Param checks
        //
        const { path } = req.query
        if (!path) return res.status(400).json({ error: `'path' is required.` })

        //
        // Query
        //
        const result = Database.query_node_by_path(path as string)

        let resp_json = 'path' in result ? 
            { success: true, data: { [result.name]: format_node(result) } } :
            { success: false, error: (result as DatabaseError).error_message }

        debug_log(GET_ROUTE_PATH, `resp_json: ${JSON.stringify(resp_json, null, 4)}`)

        res.status(200).json(resp_json)
    }
    catch (error) {
        debug_log(GET_ROUTE_PATH, `error: ${JSON.stringify(error, null, 4)}`)

        res.status(500).json({
            error: 'Internal server error while querying nodes'
        })
    }
})

//
// POST /api/node - Create a new node
//
const POST_ROUTE_PATH = `/api/node`
router.post('/', (req: Request, res: Response) => {
    try {
        const { name, parent_path } = req.body
        if (!name) {
            return res.status(400).json({
                error: `'name' is required.`
            })
        }

        //
        // Create node
        //
        const result = Database.create_node_with_parent_path(name, parent_path)
        let resp_json = ('path' in result) ? 
            { success: true, data: result } :
            { success: false, error: (result as DatabaseError).error_message }

        debug_log(POST_ROUTE_PATH, `resp_json: ${JSON.stringify(resp_json, null, 4)}`)

        res.status(200).json(resp_json)
    }
    catch (error) {
        debug_log(POST_ROUTE_PATH, `error: ${JSON.stringify(error, null, 4)}`)

        res.status(500).json({
            error: 'Internal server error while creating node'
        })
    }
})


//
// PATCH /api/node - Create a new node
//
const PATCH_ROUTE_PATH = `/api/node`
router.patch('/', (req: Request, res: Response) => {
    try {
        const { path, props } = req.body
        if (!path || !props) {
            return res.status(400).json({
                error: `'path' and 'props' are required.`
            })
        }

        //
        // Add props to ndoe
        //
        const result = Database.add_props_to_node(path, props)
        let resp_json = ('error_message' in result) ? 
            { success: false, error: (result as DatabaseError).error_message } :
            { success: true }

        debug_log(PATCH_ROUTE_PATH, `resp_json: ${JSON.stringify(resp_json, null, 4)}`)

        res.status(200).json(resp_json)
    }
    catch (error) {
        debug_log(PATCH_ROUTE_PATH, `error: ${JSON.stringify(error, null, 4)}`)

        res.status(500).json({
            error: 'Internal server error while creating node'
        })
    }
})

//
//
//
export default router
