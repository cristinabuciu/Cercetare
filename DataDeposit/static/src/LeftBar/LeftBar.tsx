import * as React from 'react';
import axios from 'axios';
import { Grid, Menu } from 'semantic-ui-react'

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
        console.log(token);
        console.log("COMPONENT DID MOUNT LEFT BAR");
        if(token) {
            console.log("INTRA PE AICI in Left Bar");
            this.setState({
                isAuthenticated: true
            })
        }
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  
    render() {
        const { activeItem } = this.state
        const className = "leftBat-fixed-style vertical-line";
        return (
            <Col className={className} md={{ size: 2, offset: 0 }}>
                <Nav className="flex-column">
                    {this.state.isAuthenticated ? 
                    <>
                    {this.props.modeSearch ? 
                        <NavLink tag={Link} to="/uploadPage"><Button outline size='lg' className="button-color">Upload dataset</Button>{' '}</NavLink>
                        : <NavLink tag={Link} to="/"><Button outline size='lg' className="button-color">Search datasets</Button>{' '}</NavLink>}</>
                        : <></>
                    }
                    
                </Nav>

                <Nav defaultActiveKey="/home" className="flex-column margin-top-50">
                    <Nav.Link href="/aboutus">About project</Nav.Link>
                    <Nav.Link eventKey="link-1">Contact us</Nav.Link>
                    <Nav.Link eventKey="link-2">Privacy Policy</Nav.Link>
                    <Nav.Link eventKey="link-2">Sponsors</Nav.Link>
                    <Nav.Link eventKey="link-2">Developers</Nav.Link>
                </Nav>
            </Col>
      )
    }

}