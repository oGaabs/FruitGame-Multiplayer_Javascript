export default function renderScreen(screen, game, requestAnimationFrame, currentPlayerId) {
    const context = screen.getContext('2d')
    context.fillStyle = '#101010'
    context.clearRect(0, 0, screen.width, screen.height)

    for (const playerId in game.state.players) {
        const player = game.state.players[playerId]
        context.fillStyle = 'white'
        context.fillRect(player.x, player.y, 1, 1)
    }

    for (const fruitId in game.state.fruits) {
        const player = game.state.fruits[fruitId]
        context.fillStyle = 'green'
        context.fillRect(player.x, player.y, 1, 1)
    }

    const currentPlayer = game.state.players[currentPlayerId]
    if (currentPlayer){
        context.fillStyle = 'red'//'#F0DB4F'
        context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)
    }

    requestAnimationFrame(() => {
        renderScreen(screen, game, requestAnimationFrame, currentPlayerId)
    })
}