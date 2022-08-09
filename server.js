import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import { Server } from 'socket.io'

const app = express()
const webServer = http.createServer(app)
const sockets = new Server(webServer)

app.use(express.static('public'))

const game = createGame()
game.start()

game.subscribe((command) => {
    //console.log(`> Emitting command: ${command.type}`)
    sockets.emit(command.type, command)
})

sockets.on('connection', (socket) => {
    const playerId = socket.id
    console.log(`Player connected: ${playerId}`)

    game.addPlayer({ playerId })

    socket.emit('setup', game.state)

    socket.on('disconnect', () => {
        game.removePlayer({ playerId })
        console.log(`Player disconnected: ${playerId}`)
    })

    socket.on('move-player', (command) => {
        command.playerId = playerId
        command.type = 'move-player'

        game.movePlayer(command)
        console.log(`> Emitting command: ${command.type}`)
    })
})

const PORT = process.env.PORT || 3000;

webServer.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`)
})