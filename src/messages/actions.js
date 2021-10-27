import io from 'socket.io-client';
import React from 'react'
import {useHistory, useLocation} from "react-router-dom";

export const CREATE_ROOM = 'CREATE_ROOM';
export const JOIN_ROOM = 'JOIN_ROOM';
export const SYNC_STATE = 'SYNC_STATE';
export const SYNC_ACTION = 'SYNC_ACTION';
export const LEAVE_ROOM = 'LEAVE_ROOM';

export const createRoom = message => ({
    type: CREATE_ROOM,
    payload: message,
});

export const joinRoom = message => ({
    type: JOIN_ROOM,
    payload: message,
});

export const syncState = message => ({
    type: SYNC_STATE,
    payload: message,
});

export const syncAction = message => ({
    type: SYNC_ACTION,
    payload: message,
});

export const leaveRoom = message => ({
    type: LEAVE_ROOM,
    payload: message,
});

export let showNextPrepare = false;

export const socket = io('http://webprogramozas.inf.elte.hu:3030');


socket.on('connect', () => {
    console.log("socket connected: ", socket.connected);
});

function outputMessage(answer) {
    const div = document.getElementById("answer");
    div.innerHTML = answer;
}

export const sendMessage = (message, roomId, info, msgdir) => {

    if (message === "create-room") {
        socket.emit(message, function(answer) {
            if (answer.status === 'ok') {
                outputMessage(answer.roomId);
            }
            if (answer.status === 'error') {
                outputMessage(answer.message);
            }
        });
    }

    if (message === "join-room") {
        socket.emit(message, roomId, function(answer) {
            if (answer.status === 'error') {
                outputMessage(answer.message);
            }
        });
    }

    if (message === "sync-state") {
        socket.emit(message, roomId, info, msgdir, function(answer) {
            console.log(answer);
        })
    }

    socket.on("room-is-full", function(answer) {
        showNextPrepare = true;
    })

}
