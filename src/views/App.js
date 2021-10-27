import React, { Component } from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import { Home } from './Home';
import { Waiting } from './Waiting';
import { Joining } from './Joining';
import { Prepare } from './Prepare';
import { Game } from './Game';
import { NoMatch } from './NoMatch';
import {GameNavbar} from "./Navbar";


class App extends Component {
    render() {
        return (
            <React.Fragment>
                <Router>
                    <GameNavbar />
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/waiting" component={Waiting} />
                        <Route path="/joining" component={Joining} />
                        <Route path="/prepare" component={Prepare} />
                        <Route path="/game" component={Game} />
                        <Route component={NoMatch} />
                    </Switch>
                </Router>
            </React.Fragment>
        );
    }

}

export default App;
