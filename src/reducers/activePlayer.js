const activePlayerReducer = (state = true, action) => {
    switch(action.type) {
        case 'SWAP':
            return action.text;
        default:
            return state;
    }
};

export default activePlayerReducer;