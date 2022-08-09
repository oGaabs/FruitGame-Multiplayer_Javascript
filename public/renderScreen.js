export function setupScreen(canvas, game) {
    const { width, height }  = game.state.screen
    canvas.width = width
    canvas.height = height
}

export default function renderScreen(screen, scoreTable, game, requestAnimationFrame, currentPlayerId) {
    const context = screen.getContext('2d')
    context.fillStyle = '#101010'
    context.clearRect(0, 0, screen.width, screen.height)

    for (const playerId in game.state.players) {
        const player = game.state.players[playerId]
        context.fillStyle = '#F0DB4F'//'white'
        context.fillRect(player.x, player.y, 1, 1)
    }

    for (const fruitId in game.state.fruits) {
        const fruit = game.state.fruits[fruitId]
        context.fillStyle = '#d01050';
        context.fillRect(fruit.x, fruit.y, 1, 1)
    }

    const currentPlayer = game.state.players[currentPlayerId]
    if (currentPlayer){
        context.fillStyle = '#80e040';
        context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)
    }

    updateScoreTable(scoreTable, game, currentPlayerId)

    requestAnimationFrame(() => {
        renderScreen(screen, scoreTable, game, requestAnimationFrame, currentPlayerId)
    })
}

function updateScoreTable(scoreTable, game, currentPlayerId) {
    const maxResults = 10;
    let scoreTableInnerHTML = `
        <tr class="header">
            <td>Top 10 Jogadores</td>
            <td>Pontos</td>
        </tr>
        `

    const scoreArray = []
    for (const i in game.state.players) {
        const player = game.state.players[i]
        scoreArray.push({
            playerId: player.id,
            score: player.score
        })
    }
    console.log(scoreArray)

    const scoreArraySorted = scoreArray.sort((first, second) => {
        if (first.score < second.score) {
            return 1
        }
        if (first.score > second.score) {
            return -1
        }
        return 0
    })

    console.log(scoreArraySorted)

    const currentPlayer = game.state.players[currentPlayerId]
    const scoreSliced = scoreArraySorted.slice(0, maxResults);
    scoreSliced.forEach((player) => {
        scoreTableInnerHTML += `
            <tr class="${ currentPlayer.id === player.playerId ? 'current-player' : ''}">
                <td class="socket-id">${player.playerId}</td>
                <td class="score-value">${player.score}</td>
            </tr>
            `
    })

    let playerNotInTop10 = true;

    for (const score of scoreSliced) {
        if (currentPlayer.id === score.playerId) {
            playerNotInTop10 = false;
            break;
        }
        playerNotInTop10 = true;
    }

    if (playerNotInTop10) {
        scoreTableInnerHTML += `
            <tr class="current-player bottom">
                <td class="socket-id">${currentPlayerId}</td>
                <td class="score-value">${currentPlayer?.score}</td>
            </tr>
            `
    }
    scoreTableInnerHTML += `
        <tr class="footer">
            <td>Total de jogadores</td>
            <td align="right">${Object.keys(game.state.players).length}</td>
        </tr>
        `
    scoreTable.innerHTML = scoreTableInnerHTML
}