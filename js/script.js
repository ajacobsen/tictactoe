
const CellFactory = (index, value) => {
    let el = document.createElement('div');
    el.classList.add('cell');
    if ([1,4,7].includes(index)) el.classList.add('border-sides');
    if ([3,4,5].includes(index)) el.classList.add('border-topbottom');
    el.setAttribute('data-index', index);
    el.addEventListener('click', game.handleClick);
    return el;
}

const gameBoard =  (() => {
    let cells = [];

    initialize = () => {
        cells = [
            '', '', '', 
            '', '', '', 
            '', '', ''
        ]
    }

    getCells = () => {
        return cells;
    }

    markCell = (index, mark) => {
        cells[index] = mark;
    };

    getEmptyCells = () => {
        return cells.filter((cell) => cell === '');
    }

    isEmpty = (index) => {
        return cells[index] === '';
    };

    didWin = (mark) => {
        let str = mark+mark+mark
        if ([cells[0], cells[1], cells[2]].join('') === str) return [0,1,2];
        if ([cells[3], cells[4], cells[5]].join('') === str) return [3,4,5];
        if ([cells[6], cells[7], cells[8]].join('') === str) return [6,7,8];
        if ([cells[0], cells[3], cells[6]].join('') === str) return [0,3,6];
        if ([cells[1], cells[4], cells[7]].join('') === str) return [1,4,7];
        if ([cells[2], cells[5], cells[8]].join('') === str) return [2,5,8];
        if ([cells[0], cells[4], cells[8]].join('') === str) return [0,4,8];
        if ([cells[2], cells[4], cells[6]].join('') === str) return [2,4,6];
        return [];
    };

    isTie = () => {
        return getEmptyCells().length === 0;
    }

    return {initialize, markCell, isEmpty, didWin, isTie, getCells};
})();

const displayController = (() => {
    let boardEl = document.querySelector('.gameboard');
    let cellElements = [];

    initialize = () => {
        cellElements = [];
        createCells();
        render();
    };

    createCells = () => {
        for (let i = 0; i < 9; i++) {
            cellElements.push(CellFactory(i, ''));
        }
    };

    markCell = (index, mark) => {
        let el = document.createElement('div');
        el.classList.add('mark');
        el.textContent = mark;
        cellElements[index].appendChild(el);
    };

    highlightWinner = (indices) => {
        cellElements.forEach(cellEl => {
            if (indices.includes(parseInt(cellEl.dataset.index))) {
                cellEl.style.color = 'red';
            } else {
                cellEl.style.color = '#0008';
            }
        });
    }
    
    render = () => {
        boardEl.replaceChildren(...cellElements);
    };

    updateScore = () => {
        document.querySelector('.p1.score').textContent = game.players[0].getScore();
        document.querySelector('.ties.score').textContent = game.ties;
        document.querySelector('.p2.score').textContent = game.players[1].getScore();
    };

    return {initialize, render, markCell, updateScore, highlightWinner};
})();

const PlayerFactory = (name, mark, isCpu) => {
    let score = 0;
    const incrementScore = () => {
        score++;
    };

    const getScore = () => {
        return score;
    };

    return {name, mark, isCpu, getScore, incrementScore};
};

const AI = (() => {
    let player = 'O';
    let opponent = 'X';
    evaluate = (board) => {
        let playerStr = 'OOO';
        let opponentStr = 'XXX';
        if ([board[0], board[1], board[2]].join('') === playerStr) return 10;
        if ([board[0], board[1], board[2]].join('') === opponentStr) return -10;

        if ([board[3], board[4], board[5]].join('') === playerStr) return 10;
        if ([board[3], board[4], board[5]].join('') === opponentStr) return -10;

        if ([board[6], board[7], board[8]].join('') === playerStr) return 10;
        if ([board[6], board[7], board[8]].join('') === opponentStr) return -10;

        if ([board[0], board[3], board[6]].join('') === playerStr) return 10;
        if ([board[0], board[3], board[6]].join('') === opponentStr) return -10;

        if ([board[1], board[4], board[7]].join('') === playerStr) return 10;
        if ([board[1], board[4], board[7]].join('') === opponentStr) return -10;
        
        if ([board[2], board[5], board[8]].join('') === playerStr) return 10;
        if ([board[2], board[5], board[8]].join('') === opponentStr) return -10;

        if ([board[0], board[4], board[8]].join('') === playerStr) return 10;
        if ([board[0], board[4], board[8]].join('') === opponentStr) return -10;

        if ([board[2], board[4], board[6]].join('') === playerStr) return 10;
        if ([board[2], board[4], board[6]].join('') === opponentStr) return -10;

        return 0;
    }
    
    minimax = (board, depth, isMax) => {
        let score = evaluate(board);
        if (score === 10) return score;
        if (score === -10) return score;
        if (board.filter((cell) => cell === '').length === 0) return 0;

        if (isMax) {
            let best = -1000;

            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = player;
                    best = Math.max(best, minimax(board, depth+1, !isMax));
                    board[i] = '';
                }
            }
            return best;
        } else {
            let best = 1000;

            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = opponent;
                    best = Math.min(best, minimax(board, depth+1, !isMax));
                    board[i] = '';
                }
            }
            return best;
        }
    }
    
    findBestMove = (board) => {
        let bestValue = -1000;
        let bestMove = -1;
        console.log(board);
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = player;
                let moveValue = minimax(board, 0, false);
                board[i] = '';
                
                console.log(`best: ${bestValue}`);
                console.log(`move: ${moveValue}`);
                if (moveValue > bestValue) {
                    bestValue = moveValue;
                    bestMove = i;
                }
            }
        }
        console.log(`bestMove: ${bestMove}`);
        return bestMove;
    };
    return {findBestMove}
})();

const GameStates = {
    INIT: 0,
    PRE_ROUND: 1,
    PLAYER_MOVE: 2,
    CPU_MOVE: 3,
    POST_MOVE: 4,
    END: 5
}

const game = {
    players: [],
    currentPlayer: 0,
    ties: 0,
    round: -1,
    state: GameStates.INIT,

    handleClick: function () {
        if (game.state === GameStates.END) {
            game.state = GameStates.PRE_ROUND;
            game.run();
            return;
        }
        if (game.state !== GameStates.PLAYER_MOVE) return;
        if (!gameBoard.isEmpty(this.dataset.index)) return;
        game.makeMove(this.dataset.index, game.players[game.currentPlayer].mark);
    },
    
    makeMove: function (index, mark) {
        gameBoard.markCell(index, mark);
        displayController.markCell(index, mark);
        game.state = GameStates.POST_MOVE;
        game.run();
    },

    checkWinOrTie: function () {
        return (gameBoard.didWin(game.players[game.currentPlayer].mark).length > 0 || gameBoard.isTie());
    },
    
    run: function () {
        switch (game.state) {
            case GameStates.INIT:
                game.players = [PlayerFactory('Bob', 'X', false), PlayerFactory('Bobby', 'O', true)];
                game.state = GameStates.PLAYER_MOVE;

            case GameStates.PRE_ROUND:
                gameBoard.initialize();
                displayController.initialize();
                game.round++;
                game.currentPlayer = game.round % 2
                game.state = game.players[game.currentPlayer].isCpu ? GameStates.CPU_MOVE : GameStates.PLAYER_MOVE;
                game.run();
                break;

            case GameStates.CPU_MOVE:
                if (Math.random() < 1) {
                    let move = AI.findBestMove([...gameBoard.getCells()]);
                    game.makeMove(move, game.players[game.currentPlayer].mark);
                } else {
                    while (true) {
                        let index = Math.floor(Math.random() * 9);
                        if (gameBoard.isEmpty(index)) {
                            game.makeMove(index, game.players[game.currentPlayer].mark);
                            break;
                        }
                    }
                }
                break;

            case GameStates.POST_MOVE:
                if (game.checkWinOrTie()) {
                    game.state = GameStates.END;
                    game.run();
                } else {
                    game.currentPlayer = game.currentPlayer == 1 ? 0 : 1;
                    if (game.players[this.currentPlayer].isCpu) {
                        game.state = GameStates.CPU_MOVE;
                        game.run();
                    } else {
                        game.state = GameStates.PLAYER_MOVE;
                    }
                }
                break;

            case GameStates.END:
                winCells = gameBoard.didWin(game.players[game.currentPlayer].mark);
                if (winCells.length > 0) {
                    game.players[game.currentPlayer].incrementScore();
                    displayController.highlightWinner(winCells);
                } else {
                    game.ties++;
                    displayController.highlightWinner([]);
                }
                displayController.updateScore();
                break;

            default:
                break;
        }
    }
}

game.run();