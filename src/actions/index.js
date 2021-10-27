export const increment = () => {
    return {
        type: 'INCREMENT'
    }
};


export const decrement = () => {
    return {
        type: 'DECREMENT'
    }
};

export const ready = () => {
    return {
        type: 'READY'
    }
};

export const notReady = () => {
    return {
        type: 'NOTREADY'
    }
};

export const swap = (b) => {
    return {
        type: 'SWAP',
        text: b
    }
};

export const gameOver = (b) => {
    return {
        type: 'GAMEOVER',
        text: b
    }
};

export const updateTable = (table, row, col) => {
    return {
        type: 'UPDATETABLESTATE',
        text: table,
        row: row,
        col: col
    }
};

export const player1 = () => {
    return {
        type: 'PLAYER1'
    }
};

export const player2 = () => {
    return {
        type: 'PLAYER2'
    }
};

export const setRoomId = (roomId) => {
    return {
        type: 'SETROOMID',
        text: roomId
    }
};