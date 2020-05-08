import * as React from 'react';
import axios from 'axios';
import { Grid, Menu } from 'semantic-ui-react'

import { Nav } from 'react-bootstrap';
import { Col, Button } from 'reactstrap';

import './leftbar.scss';


export interface ILeftBarProps {
    color: "red" | "black";
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
        <Col md={{ size: 3, offset: 0 }} className="vertical-line">
            <Nav className="flex-column">
                <Nav.Link href="/home"><Button outline size='lg' className="button-color">Upload Dataset</Button>{' '}</Nav.Link>
            </Nav>

            <Nav defaultActiveKey="/home" className="flex-column">
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