const readyReducer = (state = false, action) => {
    switch(action.type){
        case 'READY':
            return !state;
        default:
            return state;
    }
};
export default readyReducer;