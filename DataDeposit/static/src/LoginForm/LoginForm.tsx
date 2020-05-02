import * as React from 'react';
import axios from 'axios';
import * as ReactDOM from 'react-dom';

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
                        {/* <Col md="12">
                        {this.props.loginError ? (
                            <Alert color="danger">
                            <Translate contentKey="login.messages.error.authentication">
                                <strong>Failed to sign in!</strong> Please check your credentials and try again.
                            </Translate>
                            </Alert>
                        ) : null}
                        {this.props.permissionsError ? (
                            <Alert color="danger">
                            <Translate contentKey="login.messages.error.permissions">
                                <strong>Failed to sign in!</strong> Please check your credentials and try again.
                            </Translate>
                            </Alert>
                        ) : null}
                        </Col> */}
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