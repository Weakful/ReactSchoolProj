import React from 'react'
import {Jumbotron} from "./Jumbotron";

export const Home = () => (
    <div>
        <Jumbotron />
        <div className="d-flex justify-content-center">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/uX2Y5CK5OIY" frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen>

            </iframe>
        </div>

    </div>
)
