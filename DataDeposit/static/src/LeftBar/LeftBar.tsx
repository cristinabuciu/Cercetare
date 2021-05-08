import * as React from 'react';
import MyTranslator from '../assets/MyTranslator'

import { Nav } from 'react-bootstrap';
import { NavLink } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import { Col, Button } from 'reactstrap';

import './leftbar.scss';


export interface ILeftBarProps {
    className?: String;
    modeSearch: boolean;
}

export interface ILeftBarState {
    activeItem: string;
    isAuthenticated: boolean;
}

export default class LeftBar extends React.Component<ILeftBarProps, ILeftBarState> {

    state = { activeItem: 'bio',
        isAuthenticated: false
    }

    componentDidMount() {
        this.state.isAuthenticated = false;
        const token = localStorage.getItem('login_user_token');
        if(token) {
            this.setState({
                isAuthenticated: true
            })
        }
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  
    render() {

        const className = "leftBat-fixed-style vertical-line";
        const translate = new MyTranslator("LeftBar");
        return (
            <Col className={className} md={{ size: 2, offset: 0 }}>
                <Nav className="flex-column">
                    {this.state.isAuthenticated ? 
                    <>
                    {this.props.modeSearch ? 
                        <NavLink tag={Link} to="/uploadPage"><Button outline size='lg' className="button-color">{translate.useTranslation("upload")}</Button>{' '}</NavLink>
                        : <NavLink tag={Link} to="/search"><Button outline size='lg' className="button-color">{translate.useTranslation("search")}</Button>{' '}</NavLink>}</>
                        : <></>
                    }
                    
                </Nav>

                <Nav defaultActiveKey="/home" className="flex-column margin-top-50">
                    <Nav.Link href="/aboutus">{translate.useTranslation("about")}</Nav.Link>
                    <Nav.Link target="_blank" href="http://localhost:5000/organization/crescdi">{translate.useTranslation("ckan")}</Nav.Link>
                    <Nav.Link target="_blank" href="http://localhost:5601/">{translate.useTranslation("kibana")}</Nav.Link>
                    <Nav.Link eventKey="link-2">{translate.useTranslation("privacy")}</Nav.Link>
                    <Nav.Link eventKey="link-2">{translate.useTranslation("sponsors")}</Nav.Link>
                    <Nav.Link eventKey="link-2">{translate.useTranslation("developers")}</Nav.Link>
                    <Nav.Link eventKey="link-1">{translate.useTranslation("contact")}</Nav.Link>
                </Nav>
            </Col>
      )
    }

}