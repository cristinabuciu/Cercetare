import * as React from 'react';

import {
    Card, Label, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Input, Row, Col, Tooltip
  } from 'reactstrap';
import {InputText} from './Items-components'
import DatePicker from "react-datepicker";
import NumericInput from 'react-numeric-input';
import "../style_home.scss";
import StarRatings from 'react-star-ratings';
import { Nav } from 'react-bootstrap';
import "./items.scss"
 


export interface ISearchCardProps {}


export interface ISearchCardState {
    setTooltipOpen: boolean;
    ratingAvgValue: number;
}

export default class SearchCard extends React.Component<ISearchCardProps, ISearchCardState> {

    state = {
        setTooltipOpen: false,
        ratingAvgValue: 4.58 
    }


    tooltipOpen(value) {
        this.setState ({
            setTooltipOpen: value
        });
    }
  
    render() {  

      return (
        <Card className="margin-top-20">
        <CardBody>
          <CardTitle></CardTitle>
          <CardSubtitle></CardSubtitle>
          <CardText>
            <Row>
                <Col md={{ size: 9, offset: 0 }}>
                </Col>
                <Col><div id="TooltipStars">
                    <StarRatings
                        rating={this.state.ratingAvgValue}
                        starDimension="19px"
                        starSpacing="3px"
                        numberOfStars={5}
                        starRatedColor="gold"
                        name='rating'
                    />
                    </div>
                    <Tooltip 
                        placement="top" 
                        isOpen={this.state.setTooltipOpen} 
                        target="TooltipStars" 
                        toggle={() => this.tooltipOpen(!this.state.setTooltipOpen)}>
                        {this.state.ratingAvgValue}
                    </Tooltip>
                </Col>
            </Row>
            <Row>
                <Col md={{ size: 2, offset: 0 }}> 
                    <Label for="titluDataset" className="label-format">Titlu Dataset:</Label>
                </Col>
                <Col>
                    <Nav.Link href="/home" id="titluDataset">TITLU</Nav.Link>
                </Col>
                
            </Row>
            <Row>
                <Col md={{ size: 2, offset: 0 }}> 
                    <Label for="titluArticol" className="label-format">Titlu Articol:</Label>
                </Col>
                <Col>
                    <Nav.Link href="/home" id="titluArticol">TITLU ARTICOL + AN</Nav.Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <span className="label-format">
                        Domeniu: ...
                    </span>
                </Col>
            </Row>
            <Row>
                <Col>
                    <span className="label-format">
                        Data Format: ...
                    </span>
                </Col>
            </Row>
            <Row>
                <Col>
                    <span className="label-format">
                        Country: ...
                    </span>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Input type="textarea" name="text" id="description" placeholder="Short Description" className="margin-top-10" />
                </Col>
            </Row>
            <Row>
            <Col md={{ size: 2, offset: 0 }}> 
                    <Label for="gitLink" className="label-format">Gitlink:</Label>
                </Col>
                <Col>
                    <Nav.Link href="/home" id="gitLink">www.mata.com</Nav.Link>
                </Col>
            </Row>
            <Row>
                <Col className="text-align-center">
                    <Button color="primary" outline className="download-button-size">
                        Download
                    </Button>
                </Col>
            </Row>
          </CardText>
          
        </CardBody>
      </Card>
      )
    }

}





