import React from 'react'
import { Button } from 'react-bootstrap';
import {Jumbotron} from "./Jumbotron";
import io from "socket.io-client";
import {MessageList} from "../messages/MessageList";
import {createRoom, sendMessage, showNextPrepare, socket} from "../messages/actions";
import {player1, setRoomId} from "../actions";
import {useDispatch} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import '../styles.css'

export const Waiting = (props) => {


    console.log("name: ", props);

    const dispatch = useDispatch();
    dispatch(player1());


    socket.on("room-is-full", function(answer) {

        dispatch(setRoomId(answer.roomId));

        document.getElementById("next-page").style = "display: flex !important";
        document.getElementById("generate-button").style = "display: none !important";
        document.getElementById("waiting").innerHTML = "2. játékos csatlakoztatva!";
    });

        return (
    <div>
        <Jumbotron />
        <MessageList/>
        <h2 className="text-center">
            <Button onClick={
                (e) => {
                    sendMessage('create-room');
                }

            } id="generate-button">
                Új azonosító generálása
            </Button>
            <br/>
            Szoba azonosítója: <br/>
            <div id="answer"></div>
        </h2>
        <div>

            <div className="d-flex justify-content-center flex-column align-items-center">
                <div id="waiting">
                    Várakozás a 2. játékosra...
                </div>
                <div id="next-page">
                    <Link to={"/prepare"} class="btn-lg"> Előkészítő szoba </Link>
                    <br/>
                </div>
            </div>



            <Link to={"/"} className="d-flex justify-content-center">Vissza</Link>
        </div>
    </div>
)};
