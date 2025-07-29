import { DatabaseDriver } from "./db/sqlite_db"

// const query_path = `/alphapc`
// const query_path = `/alphapc/processing`
const query_path = `/alphapc/storage`
// const query_path = `/alphapc/notexists`
// const query_path = `alphapc`


// const create_result = DatabaseDriver.create_node_with_parent_path(undefined)
// const create_result = DatabaseDriver.create_node_with_parent_path('alphapc')
// const create_result = DatabaseDriver.create_node_with_parent_path('storage', '/alphapc')
// const create_result = DatabaseDriver.create_node_with_parent_path('SsD', '/alphapc/storage')
// const create_result = DatabaseDriver.create_node_with_parent_path('Laptop')
const create_result = DatabaseDriver.create_node_with_parent_path('GPU', '/laptop')

if ('path' in create_result) {
    console.log(`>>> new node: ${JSON.stringify(create_result, null, 4)}`)
} else {
    console.log(`>>> error: ${JSON.stringify(create_result, null, 4)}`)
}


// const result = DatabaseDriver.query_node_by_path(query_path)
//
// if ('path' in result) {
//     console.log(`>>> node: ${JSON.stringify(result, null, 4)}`)
// } else {
//     console.log(`>>> error: ${JSON.stringify(result, null, 4)}`)
// }
//
