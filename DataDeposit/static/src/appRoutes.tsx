import React, { Component } from "react";
import { Switch, Route, Redirect, Router } from 'react-router-dom';

import LoginForm from "./LoginForm/LoginForm";
import Home from "./Home/Home";
import SearchPage from "./SearchPage/SearchPage";
import UploadPage from "./UploadPage/UploadPage"
import DatasetView from "./DatasetView/DatasetView"
import UserPage from "./UserPage/UserPage"
import NotFoundPage from "./error/NotFoundPage"
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
        // const BrowserHistory = require('react-router/lib/BrowserHistory').default;
        
        return (
            <Switch >
                <Route path="/test" exact render={(props) => <Home {...props} greeting={""} />}/>
                <Route path="/" exact render={(props) => <SearchPage {...props} greeting={""} />}/>
                <Route path="/LoginForm" exact render={(props) => <LoginForm {...props} color={"black"} />} />
                <Route path="/search" exact render={(props) => <SearchPage {...props} greeting={""} />}/>
                <Route path="/uploadPage" exact render={(props) => <UploadPage {...props} color={"UPLOAD "} />} />
                <Route path="/datasetView/:id" exact render={(props) => <DatasetView {...props} color={"VIEW"} id={props.match.params['id']} />} />
                <Route path="/userpage/:userId" exact render={(props) => <UserPage {...props} color={"USERPAGE"} userId={props.match.params['userId']} />} />
                <Route path="/404" component={NotFoundPage} />
                <Redirect to="/404" />
                {/* <Route path="/Contact" component={Contact} />
                <Route path="/Products" component={Products} /> */}
            </Switch>
        )
    }
}