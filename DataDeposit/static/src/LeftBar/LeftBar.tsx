import * as React from 'react';
import MyTranslator from '../assets/MyTranslator'

import { Nav } from 'react-bootstrap';
import { NavLink } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import { Col, Button } from 'reactstrap';

import './leftbar.scss';


export interface ILeftBarProps {
    className?: string;
    modeSearch: boolean;
}

export interface ILeftBarState {
    isAuthenticated: boolean;
}

export default class LeftBar extends React.Component<ILeftBarProps, ILeftBarState> {

    state: ILeftBarState = { 
        isAuthenticated: false
    }

    componentDidMount(): void {
        this.state.isAuthenticated = false;
        const token = localStorage.getItem('login_user_token');
        if (token) {
            this.setState({
                isAuthenticated: true
            })
        }

        //////////// FUNCTIONS /////////////
        this.resetSearch = this.resetSearch.bind(this);
    }

    resetSearch(): void {
        localStorage.removeItem('allFilters');
    }
  
    render() {

        const className: string = "leftBat-fixed-style vertical-line";
        const translate = new MyTranslator("LeftBar");
        return (
            <Col className={className} md={{ size: 2, offset: 0 }}>
                <Nav className="flex-column">
                    {this.state.isAuthenticated ? 
                    <>
                    {this.props.modeSearch ? 
                        <NavLink tag={Link} className="margin-bottom-30" to="/uploadPage"><Button outline size='lg' className="button-color">{translate.useTranslation("upload")}</Button>{' '}</NavLink>
                        : <NavLink tag={Link} className="margin-bottom-30" to="/search"><Button outline size='lg' onClick={this.resetSearch} className="button-color">{translate.useTranslation("search")}</Button>{' '}</NavLink>}</>
                        : <></>
                    }
                    
                </Nav>

                <Nav defaultActiveKey="/home" className="flex-column margin-top-50">
                    <Nav.Link href="/aboutus">{translate.useTranslation("about")}</Nav.Link>
                    <Nav.Link target="_blank" href="http://localhost:5000/organization/crescdi">{translate.useTranslation("ckan")}</Nav.Link>
                    <Nav.Link target="_blank" href="http://localhost:5601/app/kibana#/dashboard/e6d030c0-c6c6-11eb-ac1c-bde289732919/">{translate.useTranslation("kibana")}</Nav.Link>
                    <Nav.Link eventKey="link-2">{translate.useTranslation("privacy")}</Nav.Link>
                    <Nav.Link eventKey="link-2">{translate.useTranslation("sponsors")}</Nav.Link>
                    <Nav.Link eventKey="link-2">{translate.useTranslation("developers")}</Nav.Link>
                    <Nav.Link eventKey="link-1">{translate.useTranslation("contact")}</Nav.Link>
                </Nav>
            </Col>
      )
    }
}