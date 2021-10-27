import React from 'react'
import {Button, Table} from 'react-bootstrap'
import '../styles.css'
import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, ready, notReady, updateTable } from '../actions'
import {sendMessage, socket } from "../messages/actions";
import {Link} from "react-router-dom";
import { useLocation } from 'react-router-dom'

let selectedPiece;
const max = 12;

let gameMap = [[], [], [], [], [], []];

const createTable = (player, rows, cols, availableRows) => {
    let table = [];
    for (let i = 0; i < rows; i++) {
        let children = [];
        for (let j = 0; j < cols; j++) {
            children.push(<td key={i + "" + j} id={i + "" + j}></td>);
        }
        if (player === 1) {
            if (i < rows - availableRows) {
                table.push(<tr className="red-bg" key={"r" + i} id={"r" + i}>{children}</tr>);
            } else {
                table.push(<tr className="available-cell" key={"r" + i} id={"r" + i}>{children}</tr>);
            }
        } else if (player === 2) {
            if (i >= availableRows) {
                table.push(<tr className="red-bg" key={"r" + i} id={"r" + i}>{children}</tr>);
            } else {
                table.push(<tr className="available-cell" key={"r" + i} id={"r" + i}>{children}</tr>);
            }
        }
    }
    return table;
};

const createPiecesTable = (rows, cols) => {
    let table = [];
    let pieces = ["Z", "B", "B", 1, 2, 2, 3, 3, 4, 6, 8, 10];
    for (let i = 0; i < rows; i++) {
        let children = [];
        for (let j = 0; j < cols; j++) {
            children.push(<td key={"p" + i + "" + j} id={"p" + i + "" + j}>{pieces.shift()}</td>);
        }
        table.push(<tr key={"pr" + i} className={"piece"}>{children}</tr>);
    }
    return table;
};

const handleClickP = (e) => {
    if (e.target.innerHTML) {
        if (selectedPiece) {
            document.getElementById(selectedPiece.id).classList.remove("selected");
        }
        selectedPiece = e.target;
        e.target.classList.add("selected");
    }

    if (!e.target.innerHTML && selectedPiece) {
        e.target.innerHTML = selectedPiece.innerHTML;
        document.getElementById(selectedPiece.id).innerHTML = "";
        document.getElementById(selectedPiece.id).classList.remove("selected");
        if (!selectedPiece.parentNode.classList.contains("piece")) {
            selectedPiece = null;
            return true;
        }
        selectedPiece = null;
    }
    return false;
};

const handleClickGame = (e) => {

    if (e.target.innerHTML && !selectedPiece) {
        if (selectedPiece) {
            document.getElementById(selectedPiece.id).classList.remove("selected");
        }
        selectedPiece = e.target;
        e.target.classList.add("selected");
    }

    if (!e.target.innerHTML && selectedPiece && e.target.parentNode.classList.contains("available-cell")) {
        e.target.innerHTML = selectedPiece.innerHTML;
        document.getElementById(selectedPiece.id).innerHTML = "";
        document.getElementById(selectedPiece.id).classList.remove("selected");
        if (!selectedPiece.parentNode.classList.contains("available-cell")) {
            selectedPiece = null;
            return true;
        }
        selectedPiece = null;
    }
    return false;
};

export const Prepare = ({rows = 6, cols = 6, availableRows = 2}) => {
    const counter = useSelector(state => state.counter);
    const player = useSelector(state => state.player);
    const roomId = useSelector(state => state.roomId);
    const isReady = useSelector(state => state.isReady);
    const tableState = useSelector(state => state.tableState);

    const dispatch = useDispatch();

    let player1ready = false;
    let player2ready = false;

    const location = useLocation();


        socket.on("state-changed", function (answer) {
            if (location.pathname === "/prepare") {


                if (answer.state.player === 1 && answer.state.ready) {
                    player1ready = true;

                    for (let el in answer.state.tableState[0][4]) {
                        gameMap[4][el] = answer.state.tableState[0][4][el]
                    }
                    for (let el in answer.state.tableState[0][5]) {
                        gameMap[5][el] = answer.state.tableState[0][5][el]
                    }
                    // console.log(answer.state.tableState)
                }

                if (answer.state.player === 2 && answer.state.ready) {
                    player2ready = true;
                    for (let el in answer.state.tableState[0][0]) {
                        gameMap[0][el] = answer.state.tableState[0][0][el]
                    }
                    for (let el in answer.state.tableState[0][1]) {
                        gameMap[1][el] = answer.state.tableState[0][1][el]
                    }
                }

                if (player1ready && player2ready && answer.state.ready) {
                    document.getElementById("next-page").style = "display: flex !important";
                }
            }
        })


    return (
    <div className="d-flex justify-content-around p-5">
        <div>
            <h2>
                Harcmező
                <br/>
            </h2>
            <Table bordered hover size="sm" className="gametable">
                <thead>
                </thead>
                <tbody onClick={(e) => {
                    if(handleClickGame(e)) {
                        dispatch(increment());
                        if(counter+1 === max) {
                            dispatch(ready());
                        }
                    }
                    }}>
                    {createTable(player, rows, cols, availableRows)}
                </tbody>
            </Table>
            <div>
                Elhelyezett bábuk: {counter} / {max}
            </div>
        </div>
        <div className="pieces mt-5">
            <h2>
                Elhelyezhető bábuk:
            </h2>
            <Table striped bordered hover size="sm">
            <tbody onClick={(e) => {
                if(handleClickP(e)){
                    dispatch(decrement());
                    if(counter < max ) {
                        dispatch(notReady());
                    }
                }
                // console.log(counter, max)
            }}>
            {createPiecesTable(availableRows, cols)}
            </tbody>
        </Table>

            <Button onClick={
                (e) => {
                    if (player === 2) {
                        for (let i = 0; i < availableRows; i++) {
                            for (let j = 0; j < cols; j++) {
                                let elementId = i.toString() + j.toString();
                                dispatch(updateTable(document.getElementById(elementId).innerHTML, i, j))
                            }
                        }
                    }
                    if (player === 1) {
                        for (let i = rows - 1; i >= rows - availableRows; i--) {
                            for (let j = 0; j < cols; j++) {
                                let elementId = i.toString() + j.toString();
                                dispatch(updateTable(document.getElementById(elementId).innerHTML, i, j))
                            }
                        }
                    }
                    sendMessage("sync-state", roomId, {player: player, "ready": true, "tableState": tableState}, false);
                }
            } disabled={!isReady}>
                Kész
            </Button>

            <div id="next-page">

                <Link onClick={
                    (e)=> {
                        if (player === 2) {
                            for (let i = 4; i < 6; i++) {
                                for (let j = 0; j < cols; j++)
                                dispatch(updateTable(gameMap[i][j], i, j))
                            }
                        }
                        if (player === 1) {
                            for (let i = 0; i < 2; i++) {
                                for (let j = 0; j < cols; j++)
                                    dispatch(updateTable(gameMap[i][j], i, j))
                            }
                        }
                    }
                } to={"/game"} class="btn-lg"> Játék indítása </Link>
                <br/>
            </div>

        </div>
    </div>
)};