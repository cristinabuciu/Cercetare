import * as React from 'react';

import axios from 'axios';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Input, Row, Col, Badge
  } from 'reactstrap';
import {InputText} from '../Items-components'
import DatePicker from "react-datepicker";
import NumericInput from 'react-numeric-input';
import "../../style_home.scss";
 


export interface ICardProps {
    setItemsForShow: Function;
}

export interface ICardState {
    buttonDropDownStatus: boolean;
    startDate: Date;
    searchInputOptions: {
        domain: Array<String>;
        subdomain: Array<String>;
        country: Array<String>;
        dataFormat: Array<String>;
        sortBy: Array<String>;
    };
    domain: string;
    subdomain: string;
    country: string;
    dataFormat: string;
    sortBy: string;
    resultsPerPage: number | null;
}

export default class Search extends React.Component<ICardProps, ICardState> {

    state = {
        buttonDropDownStatus: true,
        startDate: new Date(),
        searchInputOptions: {
            domain: ['abc', 'def'],
            subdomain: ['123', '456'],
            country: ['Romania', 'Patagonia', 'Japonia'],
            dataFormat: ['zip', 'rar', 'tar.gz'],
            sortBy: ['Asc', 'Desc']
        },
        domain: "Domain  ",
        subdomain: "Subomain ",
        country: "Country ",
        dataFormat: "Data Format ",
        sortBy: "Sort By  ",
        resultsPerPage: 10
            
    }
    
    handleChange = date => {
        this.setState({
          startDate: date
        });
      };

    changeValue = (e, comboBoxTitle) => {
        this.state[comboBoxTitle] = e;
        this.forceUpdate();
    }

    searchData = () => {
        console.log(this.state.resultsPerPage);
        axios.post( '/getData', {
            items: this.state.resultsPerPage,
        })
          .then(response => {
            console.log(response);
            this.props.setItemsForShow(3, 10, [['a'], ['b'], ['c']]);
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(function () {
            // always executed
          }); 
      }
    
  
    render() {  

      return (
        <Card>
        <CardBody>
          <CardTitle></CardTitle>
          <CardSubtitle></CardSubtitle>
          <CardText>
            <Row>
            <Col>
                <InputText nameOfDropdown="domain" titleDropdown={this.state.domain} listOfItems={this.state.searchInputOptions.domain} changeValue={this.changeValue} />
            </Col>
            <Col>
                <InputText nameOfDropdown="subdomain" titleDropdown={this.state.subdomain} listOfItems={this.state.searchInputOptions.subdomain} changeValue={this.changeValue} />
                </Col>
                
                <Col>
                <InputText nameOfDropdown="country" titleDropdown={this.state.country} listOfItems={this.state.searchInputOptions.country} changeValue={this.changeValue} />
                </Col>
                <Col>
                <InputText nameOfDropdown="dataFormat" titleDropdown={this.state.dataFormat} listOfItems={this.state.searchInputOptions.dataFormat} changeValue={this.changeValue} />
                </Col>
            </Row>
            <Row className="padding-top-20">
                <Col md={{ size: 5, offset: 0 }}>
                    <Input type="text" name="author" id="Author" placeholder="Author" />
                </Col>
                <Col md={{ size: 2, offset: 0 }}>
                    <Input type="number" name="year" id="Year" placeholder="Year" className="text-align-center" />
                </Col>
                <Col md={{ size: 5, offset: 0 }}>
                    <Input type="text" name="Dataset-title" id="Dataset-title" placeholder="Dataset title" />
                </Col>
                
            </Row>
            <Row className="padding-top-20">
                <Col>
                    <InputText nameOfDropdown="sortBy" titleDropdown={this.state.sortBy} listOfItems={this.state.searchInputOptions.sortBy} changeValue={this.changeValue} />
                
                    <NumericInput 
                        className="width-numeric-input" 
                        step={1} 
                        min={0} 
                        max={50} 
                        value={this.state.resultsPerPage}
                        onChange={value => this.setState({resultsPerPage: value })} />
                </Col>
                {/* <Col md={{ size: 6, offset: 0 }}></Col>
                <Col md={{ size: 3, offset: 0 }}> */}
                    <Button color="primary" outline className="search-button-size" onClick={() => this.searchData()}>
                        Search    <Badge color="secondary">4</Badge>
                    </Button>
                {/* </Col> */}
                    
            </Row>
          </CardText>
          
        </CardBody>
      </Card>
      )
    }

}





