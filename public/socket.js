import createKeyboardListener from "./keyboardListener.js"
import createGame from "./game.js"
import renderScreen from "./renderScreen.js"

const game = createGame()
const keyboardListener = createKeyboardListener()

const socket = io()

socket.on('connect', () => {
    const playerId =  socket.id // prompt("Nome de Usuário:") ??
    console.log(`Player connected on Client with id: ${playerId}`)

    const screen = document.getElementById('screen')
    renderScreen(screen, game, requestAnimationFrame, playerId)
})

socket.on('setup', (state) => {
    const playerId = socket.id
    game.setState(state)

    keyboardListener.registerPlayerId(playerId)
    keyboardListener.subscribe(game.movePlayer)
    keyboardListener.subscribe((command) => {
        socket.emit('move-player', command)
    })
})

socket.on('add-player', (command) => {
    game.addPlayer(command)
})

socket.on('remove-player', (command) => {
    game.removePlayer(command)
})

socket.on('move-player', (command) => {
    const playerId = socket.id
    if (playerId !== command.playerId)
        game.movePlayer(command)
})

socket.on('add-fruit', (command) => {
    console.log(`Receiving ${command.type} -> ${command.fruitId}`)
    game.addFruit(command)
})

socket.on('remove-fruit', (command) => {
    console.log(`Receiving ${command.type} -> ${command.fruitId}`)
    game.removeFruit(command)
})
