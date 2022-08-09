import createGame from "./game.js"
import createKeyboardListener from "./keyboardListener.js"
import renderScreen, { setupScreen } from "./renderScreen.js"

const game = createGame()
const keyboardListener = createKeyboardListener()

const socket = io()

socket.on('connect', () => {
    const playerId =  socket.id // prompt("Nome de Usuário:") ??
    console.log(`Player connected on Client with id: ${playerId}`)

    const screen = document.getElementById('screen')
    const scoreTable = document.getElementById('score')

    setupScreen(screen, game)
    renderScreen(screen, scoreTable, game, requestAnimationFrame, playerId)
})

socket.on('disconnect', () => {
    keyboardListener.unsubscribeAll();
    console.log('> Disconnected');
    if (confirm("Você foi desconectado.\nPressione OK para tentar reconectar."))
        location.reload();
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
    game.addFruit(command)
})

socket.on('remove-fruit', (command) => {
    game.removeFruit(command)
})