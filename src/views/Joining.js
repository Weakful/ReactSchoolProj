import React from 'react'
import {Button} from "react-bootstrap";
import {Jumbotron} from "./Jumbotron";
import {sendMessage, showNextPrepare, socket} from "../messages/actions";
import {player2, setRoomId} from "../actions";
import {useDispatch} from "react-redux";
import {Link, Redirect} from "react-router-dom";

export const Joining = () => {

    const dispatch = useDispatch();
    dispatch(player2());

    socket.on("room-is-full", function(answer) {
        dispatch(setRoomId(answer.roomId));
        document.getElementById("next-page").style = "display: flex !important";
        document.getElementById("joining-room").style = "display: none !important";
    });

    return (
        <div>
            <Jumbotron />

            <h2 className="text-center">
                Csatlakozás a szobához
            </h2>
            <div className="d-flex justify-content-center" id="joining-room">
                <form>
                    <label>
                        Szoba azonosítója: <br/>
                        <input type="text" name="id" id="room-id"/>
                    </label> <br/>
                    {/*<input type="submit" value="Submit" />*/}
                    <div id="answer"></div>
                    <Button onClick={
                        (e) => {sendMessage('join-room', document.getElementById('room-id').value)}

                    }>
                        Csatlakozás
                    </Button>

                </form>
            </div>
            <div className="d-flex flex-column align-items-center" id="next-page">
                Csatlakoztatva!
                <Link to={"/prepare"} class="btn-lg"> Előkészítő szoba </Link>
                <br/>
            </div>
        </div>
    )
};
