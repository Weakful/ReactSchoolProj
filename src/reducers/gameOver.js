const gameOverReducer = (state = false, action) => {
    switch(action.type) {
        case 'GAMEOVER':
            return action.text;
        default:
            return state;
    }
};

export default gameOverReducer;