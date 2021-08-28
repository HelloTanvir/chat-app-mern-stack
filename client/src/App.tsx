import React, { FC, ReactElement } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Inbox from './components/inbox/Inbox';
import Loader from './components/loader/Loader';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';

const App: FC = (): ReactElement => (
    <Router>
        <Loader />
        <Switch>
            <Route exact path="/">
                <Login />
            </Route>

            <Route exact path="/signup">
                <Signup />
            </Route>

            <Route exact path="/chat">
                <Inbox />
            </Route>
        </Switch>
    </Router>
);

export default App;
