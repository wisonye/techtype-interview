//
// Simple logger
//
export const debug_log = (function_name: string, msg: string, extraData?: any) => {
    if (!process.env.ENABLE_DEBUG_LOG || process.env.ENABLE_DEBUG_LOG.toUpperCase() !== "TRUE") return;

    const prefixToPrint = `>>> [ ${function_name} ] - `

    if (extraData) {
        console.log(`${prefixToPrint} ${msg}`, JSON.stringify(extraData, null, 4)) // tslint:disable-line no-console
    } else {
        console.log(`${prefixToPrint} ${msg}`) // tslint:disable-line no-console
    }
}
