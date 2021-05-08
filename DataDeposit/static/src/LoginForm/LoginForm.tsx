import * as React from 'react';
import axios from 'axios';
import { Alert, Button, Col, Label, Row } from 'reactstrap';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { ResponseStatus } from '../models/ResponseStatus'
import MyTranslator from '../assets/MyTranslator'

import './loginForm.scss';

export interface ILoginFormProps {
    color: "red" | "black";
}

export interface ILoginFormState {
    username: string;
    password: string;
    rememberMe: boolean;
    loaderVisibility: boolean;
    responseStatus: ResponseStatus;
}

export default class LoginForm extends React.Component<ILoginFormProps, ILoginFormState> {
    state: ILoginFormState = {
        username: '',
        password: '',
        rememberMe: false,
        loaderVisibility: false,
        responseStatus: {
			wasError: false,
			wasSuccess: false,
			responseMessage: ""
		}
    };

    componentDidMount(): void {
        ////////// FUNCTIONS /////////////
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event, errors, { username, password, rememberMe = false }): void {
        let responseStatus: ResponseStatus = {};
		const translate = new MyTranslator("Response-codes");
        this.setState({
            loaderVisibility: true
        });

        axios.post( '/login', {
            username: username,
            password: password,
            rememberMe: rememberMe
        })
        .then(response => {
            console.log(response);
            if(response.data.isAuthenticated) {
                if (response.data['statusCode'] === 200) {
                    responseStatus.wasSuccess = true;                
                    localStorage.setItem('login_user_token', response.data.username);
                    localStorage.setItem('login_user_token_id', response.data.userId);
                    window.location.href = '/';
                } else {
                    responseStatus.wasError = true;
                    responseStatus.responseMessage = translate.useTranslation(response.data['data']);
                }
            } else {
                console.log(response.data.errorMessage);
                responseStatus.wasError = true;
                responseStatus.responseMessage = translate.useTranslation(response.data['data']);
            }
        })
        .catch(function (error) {
            console.log(error);
            responseStatus.wasError = true;
            responseStatus.responseMessage = translate.useTranslation("LOGIN_ERROR");
        })
        .finally(() => {
            // always executed
            this.setState({
                responseStatus: responseStatus,
                loaderVisibility: false
            });
        }); 
      };

    render() {
        const translate = new MyTranslator("Login-Form");
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
                        <Button disabled={this.state.loaderVisibility} color="primary" type="submit">
                            {translate.useTranslation("login-form")}
                        </Button>
                    </div>
                    </AvForm>
                </div>
            </Col>
            </Row>
            <Row className={this.state.responseStatus.wasError ? "" : "display-none"}>
                <Col>
                    <Alert color="danger" className="text-align-center">
                        {this.state.responseStatus.responseMessage}
                    </Alert>
                </Col>
            </Row>
        </React.Fragment>
        );
  }

}