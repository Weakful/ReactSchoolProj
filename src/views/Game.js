import React from 'react'
import {Table} from "react-bootstrap";
import '../styles.css'
import { useSelector, useDispatch } from 'react-redux'
import {swap, gameOver, updateTable} from "../actions"
import {sendMessage, socket} from "../messages/actions";
import io from "socket.io-client";
import {useLocation} from "react-router-dom";
import Button from "react-bootstrap/Button";

let selectedPiece;
let piece;
let hit = 1;


const createTable = (rows, cols, tableState, player) => {

    console.log("creating table");

    let table = [];
    for (let i = 0; i < rows; i++) {
        let children = [];
        for (let j = 0; j < cols; j++) {
            if (i < 2) {
                if (player == 1) {
                    children.push(<td key={i + "" + j} id={i + "" + j}
                                      className={"red-player"}>?</td>);
                }
                if (player == 2) {
                    children.push(<td key={i + "" + j} id={i + "" + j}
                                      className={"red-player"}>{tableState[0][i][j]}</td>);
                }
            }
            else if (i > 3) {
                if (player == 1) {
                    children.push(<td key={i + "" + j} id={i + "" + j}
                                      className={"blue-player"}>{tableState[0][i][j]}</td>);
                }
                if (player == 2) {
                    children.push(<td key={i + "" + j} id={i + "" + j}
                                     className={"blue-player"}>?</td>);
                }
            }
            else {
                children.push(<td key={i + "" + j} id={i + "" + j}></td>);
            }
        }
            table.push(<tr key={"r" + i} id={"r" + i}>{children}</tr>);
    }
    return table;
};

function hideEnemy(player) {
    if(player == 1) {
        for (let i = 0; i < document.getElementsByClassName("red-player").length; i++) {
            if (document.getElementsByClassName("red-player")[i]) {
                document.getElementsByClassName("red-player")[i].innerHTML = "?";
            }
        }

    }

    if(player == 2) {
        for (let i = 0; i < document.getElementsByClassName("blue-player").length; i++) {
            if (document.getElementsByClassName("blue-player")[i]) {
                document.getElementsByClassName("blue-player")[i].innerHTML = "?";
            }
        }
    }
}

export const Game = ({rows = 6, cols = 6}) => {
    const activePlayer = useSelector(state => state.activePlayer);
    const dispatch = useDispatch();
    const finished = useSelector(state => state.gameOver);
    const player = useSelector(state => state.player);
    const roomId = useSelector(state => state.roomId);

    const tableState = useSelector(state => state.tableState);

    const location = useLocation();

    socket.on("state-changed", function (answer) {
        if (location.pathname === "/game") {

            console.log(answer);

            if (answer.state.finished) {
                dispatch(gameOver(true));
            } else {

                if (answer.state.newcontent == "Z") {
                    dispatch(gameOver(true));
                }


                dispatch(updateTable(null, answer.state.oldId[0], answer.state.oldId[1]));
                dispatch(updateTable(answer.state.newcontent, answer.state.newId[0], answer.state.newId[1]));



                document.getElementById(answer.state.oldId).innerHTML = "";
                document.getElementById(answer.state.oldId).className = "";


                if (answer.state.hit == 2) {
                    document.getElementById(answer.state.newId).innerHTML = "";
                    document.getElementById(answer.state.newId).className = "";
                }
                if (answer.state.hit == 1) {
                    document.getElementById(answer.state.newId).innerHTML = "?";

                    if (answer.state.activePlayer) {
                        document.getElementById(answer.state.newId).className = "blue-player";
                    } else if (!answer.state.activePlayer) {
                        document.getElementById(answer.state.newId).className = "red-player";
                    }

                }

                document.getElementById(answer.state.oldId).className = "";

                dispatch(swap(!answer.state.activePlayer));

            }
        }

    });

    const move = (e, activePlayer, player) => {
        if (e.target.classList.contains("blue-player") && activePlayer && !e.target.classList.contains("selected") && e.target.innerHTML !== "Z" && e.target.innerHTML !== "B" && player == 1) {
            let elems = document.querySelectorAll(".possibility");
            [].forEach.call(elems, function(el) {
                el.classList.remove("possibility");
            });
            if (selectedPiece != null) {
                selectedPiece.classList.remove("selected");
            }
            selectedPiece = e.target;
            piece = selectedPiece.innerHTML;
            selectedPiece.classList.add("selected");

            let possibilities;
            possibilities = [parseInt(selectedPiece.id) - 1, parseInt(selectedPiece.id) + 1, parseInt(selectedPiece.id) - 10, parseInt(selectedPiece.id) + 10];


            for (let i = 0; i < 4; i++) {
                let id = possibilities.pop();
                if (id < 10) { id = "0" + id.toString()}
                if (document.getElementById(id) && !document.getElementById(id).classList.contains("blue-player")) {
                    document.getElementById(id).classList.add("possibility");
                }
            }

            return 0;
        }

        if (e.target.classList.contains("red-player") && !activePlayer && !e.target.classList.contains("selected") && e.target.innerHTML !== "Z" && e.target.innerHTML !== "B" && player == 2) {
            let elems = document.querySelectorAll(".possibility");
            [].forEach.call(elems, function(el) {
                el.classList.remove("possibility");
            });
            if (selectedPiece != null) {
                selectedPiece.classList.remove("selected");
            }
            selectedPiece = e.target;
            piece = selectedPiece.innerHTML;
            selectedPiece.classList.add("selected");

            let possibilities;
            possibilities = [parseInt(selectedPiece.id) - 1, parseInt(selectedPiece.id) + 1, parseInt(selectedPiece.id) - 10, parseInt(selectedPiece.id) + 10];

            for (let i = 0; i < 4; i++) {
                let id = possibilities.pop();
                if (id < 10) {
                    id = "0" + id.toString()
                }
                if (document.getElementById(id) && !document.getElementById(id).classList.contains("red-player")) {
                    document.getElementById(id).classList.add("possibility");
                }
            }

            return 0;
        }

        if (e.target.classList.contains("selected")) {
            let elems = document.querySelectorAll(".possibility");
            [].forEach.call(elems, function(el) {
                el.classList.remove("possibility");
            });
            e.target.classList.remove("selected");

            return 1;
        }



        if(e.target.classList.contains("possibility")) {

            if (e.target.innerHTML === "Z") {
                e.target.innerHTML = selectedPiece.innerHTML;


                return 3; //game over
            }

            if (activePlayer) {
                if( e.target.classList.contains("red-player") ) {

                    e.target.innerHTML = tableState[0][e.target.id[0]][e.target.id[1]];

                    if ( (parseInt(selectedPiece.innerHTML) > parseInt(e.target.innerHTML)
                        || (selectedPiece.innerHTML == 3 && e.target.innerHTML == "B" )
                        || (selectedPiece.innerHTML == 1 && e.target.innerHTML == 10 ))
                        &&  !(selectedPiece.innerHTML == 10 && e.target.innerHTML == 1)) {

                        let target= e.target;

                        hit = 1;

                        setTimeout(function () {
                            target.innerHTML = selectedPiece.innerHTML;
                            document.getElementById(selectedPiece.id).innerHTML = "";
                            document.getElementById(selectedPiece.id).classList.remove("selected");
                            document.getElementById(selectedPiece.id).classList.remove("blue-player");
                            target.classList.add("blue-player");
                            target.classList.remove("red-player");

                            //kék nyert piros

                        }, 3000);

                    } else if ( selectedPiece.innerHTML === e.target.innerHTML ) {

                        let target = e.target;

                        hit = 2;

                        setTimeout(function () {
                            document.getElementById(selectedPiece.id).innerHTML = "";
                            document.getElementById(selectedPiece.id).className = "";
                            target.innerHTML = "";
                            target.className = "";

                            //kék döntetlen piros

                        }, 3000);

                    } else {

                        hit = 0;

                        setTimeout(function () {
                            document.getElementById(selectedPiece.id).innerHTML = "";
                            document.getElementById(selectedPiece.id).className = "";

                            //kék vereség piros

                        }, 3000);

                    }
                } else {
                    e.target.innerHTML = selectedPiece.innerHTML;
                    document.getElementById(selectedPiece.id).innerHTML = "";
                    document.getElementById(selectedPiece.id).classList.remove("selected");
                    document.getElementById(selectedPiece.id).classList.remove("blue-player");
                    e.target.classList.add("blue-player");
                }
            } else {
                if( e.target.classList.contains("blue-player") ) {

                    e.target.innerHTML = tableState[0][e.target.id[0]][e.target.id[1]];

                    let target = e.target;

                    if (parseInt(selectedPiece.innerHTML) > parseInt(target.innerHTML)
                        || (selectedPiece.innerHTML == 3 && target.innerHTML == "B")
                        || (selectedPiece.innerHTML == 1 && target.innerHTML == 10)
                        &&  !(selectedPiece.innerHTML == 10 && target.innerHTML == 1)) {

                        hit = 1;

                        setTimeout(function () {
                            target.innerHTML = selectedPiece.innerHTML;
                            document.getElementById(selectedPiece.id).innerHTML = "";
                            document.getElementById(selectedPiece.id).classList.remove("selected");
                            document.getElementById(selectedPiece.id).classList.remove("red-player");
                            target.classList.add("red-player");
                            target.classList.remove("blue-player");
                            //piros ütött kéket
                        }, 3000);



                    } else if (selectedPiece.innerHTML === target.innerHTML) {

                        hit = 2;


                        setTimeout(function () {
                            document.getElementById(selectedPiece.id).innerHTML = "";
                            document.getElementById(selectedPiece.id).className = "";
                            target.innerHTML = "";
                            target.className = "";
                        }, 3000);


                        //piros döntetlen kék

                    } else {

                        hit = 0;

                        setTimeout(function () {
                            document.getElementById(selectedPiece.id).innerHTML = "";
                            document.getElementById(selectedPiece.id).className = "";
                        }, 3000);

                        //piros vereség kék

                    }
                } else {
                    e.target.innerHTML = selectedPiece.innerHTML;
                    document.getElementById(selectedPiece.id).innerHTML = "";
                    document.getElementById(selectedPiece.id).classList.remove("selected");
                    document.getElementById(selectedPiece.id).classList.remove("red-player");
                    e.target.classList.add("red-player");
                }

            }

            let elems = document.querySelectorAll(".possibility");
            [].forEach.call(elems, function(el) {
                el.classList.remove("possibility");
            });

            return 2;
        }
    };



    return (

    <div className="ml-5 mt-3">
        <div hidden={!finished || activePlayer} className={"game-over"}>Kék győzelem</div>
        <div hidden={!finished || !activePlayer} className={"game-over"}>Piros győzelem</div>
        <h2 hidden={!activePlayer || finished}>
            Kék játékos következik!
        </h2>
        <h2 hidden={activePlayer || finished}>
            Piros játékos következik!
        </h2>
        <div className="d-flex">
            <Table striped bordered hover size="sm" className={"gametable"}>
                <thead>
                </thead>
                <tbody onClick={
                    (e) => {
                        let result = move(e, activePlayer, player);
                        if (result === 0) {
                            dispatch(updateTable(null, selectedPiece.id[0], selectedPiece.id[1]));
                        }
                        if (result === 1) {
                            dispatch(updateTable(selectedPiece.innerHTML, selectedPiece.id[0], selectedPiece.id[1]));
                        }
                        if (result === 2){

                            if (hit === 1) {

                                if (e.target.innerHTML == "Z") {

                                    dispatch(gameOver(true));
                                    sendMessage("sync-state", roomId, {finished: true}, false)
                                }

                                dispatch(updateTable(piece, e.target.id[0], e.target.id[1]));
                                sendMessage("sync-state", roomId, {"newId": e.target.id, "oldId": selectedPiece.id, "newcontent": piece, "activePlayer": activePlayer, "hit": hit, "og": piece}, true);
                                piece = null;

                            } else if (hit === 0) {

                                if (e.target.innerHTML == "Z") {


                                    dispatch(gameOver(true));
                                    sendMessage("sync-state", roomId, {finished: true}, false)
                                }


                                sendMessage("sync-state", roomId, {"newId": e.target.id, "oldId": selectedPiece.id, "newcontent": e.target.innerHTML, "activePlayer": activePlayer, "hit": hit, "og": piece}, true);
                                hit = 1;
                                piece = null;


                            } else if (hit === 2) {

                                if (e.target.innerHTML == "Z") {

                                    dispatch(gameOver(true));
                                    sendMessage("sync-state", roomId, {finished: true}, false)
                                }

                                dispatch(updateTable(null, e.target.id[0], e.target.id[1]));

                                sendMessage("sync-state", roomId, {"newId": e.target.id, "oldId": selectedPiece.id, "newcontent": null, "activePlayer": activePlayer, "hit": hit, "og": piece}, true);
                                hit = 1;

                            }


                            dispatch(swap(!activePlayer));
                            hideEnemy(player);

                        }
                        else if(result === 3) {

                            console.log("game over 5")

                            dispatch(gameOver(true));
                            sendMessage("sync-state", roomId, {finished: finished}, false)
                        }
                    }
                }>
                    { createTable(rows, cols, tableState, player) }
                    {  }
                </tbody>
            </Table>
            <div className="d-flex justify-content-between flex-column ml-5">
                <Table striped bordered hover size="sm" >
                <thead>
                </thead>
                    <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    </tbody>
                </Table>
                <Table striped bordered hover size="sm" >
                    <thead>
                    </thead>
                    <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    </tbody>
                </Table>
            </div>
        </div>
        <div id="next-page back-to-main" className="back-to-main" hidden={!finished}>
            <Button href={"/"}>Vissza a főoldalra</Button>
        </div>
    </div>
)};
