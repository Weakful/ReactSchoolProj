import React from 'react';
import {useSelector} from "react-redux";
import { getMessage } from "./selectors";

export function MessageList() {
    const messages = useSelector(getMessage);

    return (
        <div>
        </div>
    )

}