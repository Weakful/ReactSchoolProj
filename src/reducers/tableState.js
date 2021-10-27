const tableStateReducer = (state = [[[],[],[],[],[],[]]], action) => {
    switch(action.type) {
        case 'UPDATETABLESTATE':
            state[0][action.row][action.col] = action.text;
            return state;
        default:
            return state;
    }
};

export default tableStateReducer;