import express from 'express'
import nodesRouter from './services/nodes'

const app = express()

//
// Middleware
//
app.use(express.json())

//
// Logger middleware
//
app.use((req, _, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
    next()
})

//
// Service routes
//
app.use('/api/nodes', nodesRouter)

//
// 404 handler
//
app.use('*name', (req, res) => {
    res.status(404).json({
        error: 'API endpoint not found',
        path: req.originalUrl,
        method: req.method
    })
})

//
// Start server
//
const HOST = process.env.HOST || '0.0.0.0'
const PORT = parseInt(process.env.PORT || '8000', 10)
const server = app.listen(PORT, HOST, () => {
    console.log(`Techtype interview server running at http://${HOST}:${PORT}`)
    console.log(`Nodes API: http://${HOST}:${PORT}/api/nodes`)
})

//
// Graceful shutdown
//
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...')
    server.close(() => {
        console.log('Process terminated')
        process.exit(0)
    })
})

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...')
    server.close(() => {
        console.log('Process terminated')
        process.exit(0)
    })
})
