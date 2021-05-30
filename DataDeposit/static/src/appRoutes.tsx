import React, { Component, Suspense } from "react";
import { Switch, Route, Redirect, Router } from 'react-router-dom';

const LoginForm = React.lazy(() => import("./LoginForm/LoginForm"));
const Home = React.lazy(() => import("./Home/Home"));
const SearchPage = React.lazy(() => import("./SearchPage/SearchPage"));
const UploadPage = React.lazy(() => import("./UploadPage/UploadPage"));
const DatasetView = React.lazy(() => import("./DatasetView/DatasetView"));
const UserPage = React.lazy(() => import("./UserPage/UserPage"));
import NotFoundPage from "./error/NotFoundPage";

export interface IRoutesProps {}

export interface IRoutesState {
    displayedPage: string;
}

export default class AppRoutes extends Component<IRoutesProps, IRoutesState> {
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
            <Switch >
                <Route path="/" exact render={(props) => <Suspense fallback=""><Home {...props} greeting={""} /></Suspense>}/>
                <Route path="/loginForm" exact render={(props) => <Suspense fallback=""><LoginForm {...props} color={"black"} /></Suspense>} />
                <Route path="/search" exact render={(props) => <Suspense fallback=""><SearchPage {...props} greeting={""} /> </Suspense>}/>
                <Route path="/uploadPage" exact render={(props) => <Suspense fallback=""><UploadPage {...props} color={"UPLOAD "} /></Suspense>} />
                <Route path="/datasetView/:id" exact render={(props) => <Suspense fallback=""><DatasetView {...props} color={"VIEW"} id={props.match.params['id']} /></Suspense>} />
                <Route path="/userpage/:userId" exact render={(props) => <Suspense fallback=""><UserPage {...props} color={"USERPAGE"} userId={props.match.params['userId']} /></Suspense>} />
                <Route path="/404" component={NotFoundPage} />
                <Redirect to="/404" />
            </Switch>
        )
    }
}