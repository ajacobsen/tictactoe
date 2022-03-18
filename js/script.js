
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

    const initialize = () => {
        cells = [
            '', '', '', 
            '', '', '', 
            '', '', ''
        ]
    }

    const getCells = () => {
        return cells;
    }

    const markCell = (index, mark) => {
        cells[index] = mark;
    };

    const getEmptyCells = () => {
        return cells.filter((cell) => cell === '');
    }

    const isEmpty = (index) => {
        return cells[index] === '';
    };

    const didWin = (mark) => {
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

    const isTie = () => {
        return getEmptyCells().length === 0;
    }

    return {initialize, markCell, isEmpty, didWin, isTie, getCells};
})();

const displayController = (() => {
    let boardEl = document.querySelector('.gameboard');
    let cellElements = [];

    const initialize = () => {
        cellElements = [];
        createCells();
        render();
    };

    const createCells = () => {
        for (let i = 0; i < 9; i++) {
            cellElements.push(CellFactory(i, ''));
        }
    };

    const markCell = (index, mark) => {
        let el = document.createElement('div');
        el.classList.add('mark');
        el.textContent = mark;
        cellElements[index].appendChild(el);
    };

    const highlightWinner = (indices) => {
        cellElements.forEach(cellEl => {
            if (indices.includes(parseInt(cellEl.dataset.index))) {
                cellEl.style.color = 'red';
            } else {
                cellEl.style.color = '#0008';
            }
        });
    }
    
    const render = () => {
        boardEl.replaceChildren(...cellElements);
    };

    const updateScore = () => {
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

const game = (() => {
    let players = [];
    let currentPlayer = 0;
    let ties = 0;
    let round = -1;
    let state = GameStates.INIT;

    function handleClick() {
        if (state === GameStates.END) {
            state = GameStates.PRE_ROUND;
            run();
            return;
        }
        if (state !== GameStates.PLAYER_MOVE) return;
        if (!gameBoard.isEmpty(this.dataset.index)) return;
        makeMove(this.dataset.index, players[currentPlayer].mark);
    }
    
    function makeMove(index, mark) {
        gameBoard.markCell(index, mark);
        displayController.markCell(index, mark);
        state = GameStates.POST_MOVE;
        run();
    }

    function checkWinOrTie() {
        return (gameBoard.didWin(players[currentPlayer].mark).length > 0 || gameBoard.isTie());
    }
    
    function run() {
        switch (state) {
            case GameStates.INIT:
                players = [PlayerFactory('Bob', 'X', false), PlayerFactory('Bobby', 'O', true)];
                state = GameStates.PLAYER_MOVE;

            case GameStates.PRE_ROUND:
                gameBoard.initialize();
                displayController.initialize();
                round++;
                currentPlayer = round % 2
                state = players[currentPlayer].isCpu ? GameStates.CPU_MOVE : GameStates.PLAYER_MOVE;
                run();
                break;

            case GameStates.CPU_MOVE:
                if (Math.random() < 1) {
                    let move = AI.findBestMove([...gameBoard.getCells()]);
                    makeMove(move, players[currentPlayer].mark);
                } else {
                    while (true) {
                        let index = Math.floor(Math.random() * 9);
                        if (gameBoard.isEmpty(index)) {
                            makeMove(index, players[currentPlayer].mark);
                            break;
                        }
                    }
                }
                break;

            case GameStates.POST_MOVE:
                if (checkWinOrTie()) {
                    state = GameStates.END;
                    run();
                } else {
                    currentPlayer = currentPlayer == 1 ? 0 : 1;
                    if (players[currentPlayer].isCpu) {
                        state = GameStates.CPU_MOVE;
                        run();
                    } else {
                        state = GameStates.PLAYER_MOVE;
                    }
                }
                break;

            case GameStates.END:
                winCells = gameBoard.didWin(players[currentPlayer].mark);
                if (winCells.length > 0) {
                    players[currentPlayer].incrementScore();
                    displayController.highlightWinner(winCells);
                } else {
                    ties++;
                    displayController.highlightWinner([]);
                }
                displayController.updateScore();
                break;

            default:
                break;
        }
    }
    
    return {run, handleClick};
})();

game.run();