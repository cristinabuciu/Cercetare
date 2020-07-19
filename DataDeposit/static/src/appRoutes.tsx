import React, { Component } from "react";
import { Switch, Route } from 'react-router-dom';

import LoginForm from "./LoginForm/LoginForm";
import Home from "./Home/Home";
import UploadPage from "./UploadPage/UploadPage"
import DatasetView from "./DatasetView/DatasetView"
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
                <Route path="/" exact render={(props) => <Home {...props} greeting={""} />}/>
                <Route path="/LoginForm" exact render={(props) => <LoginForm {...props} color={"black"} />} />
                <Route path="/uploadPage" exact render={(props) => <UploadPage {...props} color={"UPLOAD "} />} />
                <Route path="/datasetView/:id" exact render={(props) => <DatasetView {...props} color={"VIEW"} id={props.match.params['id']} />} />
                {/* <Route path="/Contact" component={Contact} />
                <Route path="/Products" component={Products} /> */}
            </Switch>
        )
    }
}