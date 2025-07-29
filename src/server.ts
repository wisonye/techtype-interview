import { DatabaseDriver } from "./db/sqlite_db"

// const query_path = `/alphapc`
const query_path = `/alphapc/processing`
// const query_path = `/alphapc/storage`
// const query_path = `/alphapc/notexists`
// const query_path = `alphapc`

const result = DatabaseDriver.query_node_by_path(query_path)

if ('path' in result) {
    console.log(`>>> node: ${JSON.stringify(result, null, 4)}`)
} else {
    console.log(`>>> error: ${JSON.stringify(result, null, 4)}`)
}

