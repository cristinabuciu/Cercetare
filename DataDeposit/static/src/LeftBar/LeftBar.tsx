import * as React from 'react';
import axios from 'axios';
import { Grid, Menu } from 'semantic-ui-react'

import { Nav } from 'react-bootstrap';
import { NavLink } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import { Col, Button } from 'reactstrap';

import './leftbar.scss';


export interface ILeftBarProps {
    color: "red" | "black";
    modeSearch: boolean;
}

export interface ILeftBarState {
    activeItem: string;
}

export default class LeftBar extends React.Component<ILeftBarProps, ILeftBarState> {

    state = { activeItem: 'bio' }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  
    render() {
      const { activeItem } = this.state
  
      return (
        <Col className="leftBat-fixed-style vertical-line" md={{ size: 3, offset: 0 }}>
            <Nav className="flex-column">
                {this.props.modeSearch ? 
                    <NavLink tag={Link} to="/uploadPage"><Button outline size='lg' className="button-color">Upload dataset</Button>{' '}</NavLink>
                    : <NavLink tag={Link} to="/"><Button outline size='lg' className="button-color">Search datasets</Button>{' '}</NavLink>}
                
            </Nav>

            <Nav defaultActiveKey="/home" className="flex-column margin-top-50">
                <Nav.Link href="/home">About project</Nav.Link>
                <Nav.Link eventKey="link-1">Contact us</Nav.Link>
                <Nav.Link eventKey="link-2">Privacy Policy</Nav.Link>
                <Nav.Link eventKey="link-2">Sponsors</Nav.Link>
                <Nav.Link eventKey="link-2">Developers</Nav.Link>
            </Nav>
        </Col>
      )
    }

}