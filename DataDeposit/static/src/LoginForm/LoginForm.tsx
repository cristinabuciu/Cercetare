import * as React from 'react';
import axios from 'axios';
import * as ReactDOM from 'react-dom';
import {withRouter} from 'react-router';
import { connect } from 'react-redux'

import { Alert, Button, Col, Label, Row } from 'reactstrap';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';

import './loginForm.scss';

export interface ILoginFormProps {
    color: "red" | "black";
}

export interface ILoginFormState {
    username: string;
    password: string;
    rememberMe: boolean;
}

export default class LoginForm extends React.Component<ILoginFormProps, ILoginFormState> {
    state = {
        username: '',
        password: '',
        rememberMe: false
      };

      
    handleSubmit = (event, errors, { username, password, rememberMe = false }) => {
        // this.props.login(username.split('@')[0], password, rememberMe);
        console.log("HATZ");

        axios.post( '/login_post', {
            username: username,
            password: password,
            rememberMe: rememberMe
        })
          .then(response => {
            console.log(response);
            if(response.data.isAuthenticated) {
                localStorage.setItem('login_user_token', response.data.username);
                // window.location.reload(false);
                window.location.href = '/';
            } else {
                console.log(response.data.errorMessage);
            }
            
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(function () {
            // always executed
          }); 
      };

    render() {
        return (
        <React.Fragment>
            <Row>
            <Col xs={{ size: 12 }} sm={{ size: 12 }} md={{ size: 8 }} lg={{ size: 4 }} xl={{ size: 4 }}>
            <div className="login-form-container">
                <div className="login-form-logo">
                    <img src={'static/dist/content/images/logo-normal.png'} alt="Logo" />
                    </div>
                    <AvForm onSubmit={this.handleSubmit}>
                    <Row>
                        <Col md="12">
                        <AvField
                            name="username"
                            autoComplete="username"
                            label="Username"
                            placeholder="Username"
                            required
                            value={this.state.username}
                        />
                        <AvField
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            label="Password"
                            placeholder="Parola"
                            required
                            value={this.state.password}
                        />
                        <AvGroup check inline>
                            <Label className="form-check-label">
                            <AvInput type="checkbox" name="rememberMe" value={this.state.rememberMe} />
                            <span>Remember Me</span>
                            {/* <Translate contentKey="login.form.rememberme" /> */}
                            </Label>
                        </AvGroup>
                        </Col>
                    </Row>
                    <div className="mt-1">&nbsp;</div>
                    <div style={{ textAlign: 'center' }}>
                        <Button color="primary" type="submit">
                            Login
                        </Button>
                    </div>
                    </AvForm>
                </div>
            </Col>
            </Row>
        </React.Fragment>
        );
  }

}