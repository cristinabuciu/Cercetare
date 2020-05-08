import React, { Component } from "react";
import { Switch, Route } from 'react-router-dom';

import LoginForm from "./LoginForm/LoginForm";
import Home from "./Home/Home";
// import Contact from "./Contact/Contact";
// import Products from "./Product/Products";

export default class AppRoutes extends Component {
    constructor(props) {
        super(props);
        this.state = {
          displayedPage: 'Home'
        }
    }
    
    changePage = pageName => {
        this.setState({ displayedPage: pageName });
    }

    render() {
        return (
            <Switch>
                <Route path="/" exact render={(props) => <Home {...props} greeting={"De ce ma intrebi? SPEAK"} />}/>
                <Route path="/LoginForm" exact render={(props) => <LoginForm {...props} color={"black"} />} />
                {/* <Route path="/Contact" component={Contact} />
                <Route path="/Products" component={Products} /> */}
            </Switch>
        )
    }
}