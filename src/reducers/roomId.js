const roomIdReducer = (roomId = 0, action) => {
    switch(action.type) {
        case 'SETROOMID':
            return action.id;
        default:
            return roomId;
    }
};

export default roomIdReducer;