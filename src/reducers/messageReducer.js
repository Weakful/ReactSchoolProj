import {CREATE_ROOM, JOIN_ROOM, LEAVE_ROOM, SYNC_ACTION, SYNC_STATE} from "../messages/actions";

const initialState = [
    { id: '1', text: 'Message1'},
    { id: '2', text: 'Message2'},
]


const messageReducer = (state = initialState, action) => {
    const { type, payload } = action;

    if (type === CREATE_ROOM) {
        return [...state, payload]
    }

    if (type === JOIN_ROOM) {
        return [...state, payload]
    }

    if (type === SYNC_STATE) {
        return [...state, payload]
    }

    if (type === SYNC_ACTION) {
        return [...state, payload]
    }

    if (type === LEAVE_ROOM) {
        return [...state, payload]
    }

    return state;

};

export default messageReducer;