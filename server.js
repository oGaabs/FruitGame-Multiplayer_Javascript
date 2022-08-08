import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app)
const sockets = new Server(server)

app.use(express.static('public'))

const game = createGame()
game.start()

game.subscribe((command) => {
    console.log(`> Emitting command: ${command.type}`)
    sockets.emit(command.type, command)
})


game.addFruit({ fruitId: 'fruit1', fruitX: 3, fruitY: 3 })
game.addFruit({ fruitId: 'fruit2', fruitX: 3, fruitY: 5 })
game.movePlayer({ playerId: 'player1', keyPressed: 'ArrowRight' })

console.log(game.state)

sockets.on('connection', (socket) => {
    const playerId = socket.id
    console.log(`Player connected: ${playerId}`)

    game.addPlayer({ playerId })

    socket.emit('setup', game.state )

    socket.on('disconnect', () => {
        game.removePlayer({ playerId })
        console.log(`Player disconnected: ${playerId}`)
    })

    socket.on('move-player', (command) => {
        command.playerId = playerId
        command.type = 'move-player'

        game.movePlayer(command)
    })
})

server.listen(3000, () => {
    console.log('Server is running on port 3000')
})