import counterReducer from './counter';
import readyReducer from './isReady';
import {combineReducers} from 'redux';
import activePlayerReducer from "./activePlayer";
import gameOverReducer from "./gameOver";
import tableStateReducer from "./tableState";
import messageReducer from "./messageReducer";
import playerReducer from "./player"
import roomIdReducer from "./roomId";

const rootReducers = combineReducers({
    player: playerReducer,
    counter: counterReducer,
    isReady: readyReducer,
    activePlayer: activePlayerReducer,
    gameOver: gameOverReducer,
    tableState: tableStateReducer,
    message: messageReducer,
    roomId: roomIdReducer
});

export default rootReducers;