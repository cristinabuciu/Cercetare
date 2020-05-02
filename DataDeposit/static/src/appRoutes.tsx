import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";

import LoginForm from "./LoginForm/LoginForm";
import Home from "./Home/Home";
// import Contact from "./Contact/Contact";
// import Products from "./Product/Products";
import history from './history';

export default class AppRoutes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact render={(props) => <Home {...props} greeting={"De ce ma intrebi? SPEAK"} />}/>
                    <Route path="/LoginForm" render={(props) => <LoginForm {...props} color={"black"} />} />
                    {/* <Route path="/Contact" component={Contact} />
                    <Route path="/Products" component={Products} /> */}
                </Switch>
            </Router>
        )
    }
}