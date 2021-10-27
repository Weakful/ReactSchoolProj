const playerReducer = (state = 0, action) => {
    switch(action.type) {
        case 'PLAYER1':
            return 1;
        case 'PLAYER2':
            return 2;
        default:
            return state;
    }
};

export default playerReducer;