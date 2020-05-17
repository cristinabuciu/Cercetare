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
    year: string;
    dataset_title: string | null;
    authors: string | null;
    resultsSearchArray: Array<String>;
}

export default class Search extends React.Component<ICardProps, ICardState> {

    state = {
        buttonDropDownStatus: true,
        startDate: new Date(),
        searchInputOptions: {
            domain: ['All domains  ', 'IT', 'MEDICINE', 'ARCHITECTURE', 'BIOLOGY', 'CHEMISTRY', 'PHYSICS', 'BUSINESS'],
            subdomain: ['All subdomains  '],
            subdomainList: {
                'All domains  ': ['All subdomains  '],
                IT: ['All subdomains  ', 'IT_1', 'IT_2', 'IT_3', 'IT_4'],
                MEDICINE: ['All subdomains  ', 'MEDICINE_1', 'MEDICINE_2', 'MEDICINE_3', 'MEDICINE_4'],
                ARCHITECTURE: ['All subdomains  ', 'ARCHITECTURE_1', 'ARCHITECTURE_2', 'ARCHITECTURE_3', 'ARCHITECTURE_4'],
                BIOLOGY: ['All subdomains  ', 'BIOLOGY_1', 'BIOLOGY_2', 'BIOLOGY_3', 'BIOLOGY_4'],
                CHEMISTRY: ['All subdomains  ', 'CHEMISTRY_1', 'CHEMISTRY_2', 'CHEMISTRY_3', 'CHEMISTRY_4'],
                PHYSICS: ['All subdomains  ', 'PHYSICS_1', 'PHYSICS_2', 'PHYSICS_3', 'PHYSICS_4'],
                BUSINESS: ['All subdomains  ', 'Ragnaros']
            },
            country: ['All countries  ', 'Romania', 'Patagonia', 'Japonia'],
            dataFormat: ['All Data Formats ', 'zip', 'rar', 'tar.gz'],
            sortBy: ['ASC', 'DESC']
        },
        domain: "All domains  ",
        subdomain: "All subdomains  ",
        country: "All countries  ",
        dataFormat: "All Data Formats ",
        sortBy: "Sort By  ",
        resultsPerPage: 10,
        year: '',
        dataset_title: '',
        authors: '',
        resultsSearchArray: []
    }
    
    handleChange = date => {
        this.setState({
          startDate: date
        });
    };

    componentDidMount() {
        this.searchData();
    }

    changeValue = (e, comboBoxTitle, shouldUpdateNumber) => {
        console.log("CODRIN");
        console.log(e);
        if(comboBoxTitle === 'domain') {
            this.state.searchInputOptions.subdomain = this.state.searchInputOptions.subdomainList[e];
            this.state.subdomain = "All subdomains  ";
        }
        this.state[comboBoxTitle] = '' + e;
        this.forceUpdate();
        if(shouldUpdateNumber) {
        	this.searchData();
        }
    }

    searchData = () => {
        console.log(this.state.year);
        axios.post( '/getData', {
            items: this.state.resultsPerPage,
            params: {
              	notArrayParams: {
                    domain: this.state.domain === 'All domains  ' ? '%' : this.state.domain,
                    country: this.state.country === 'All countries  ' ? '%' : this.state.country,
                    data_format: this.state.dataFormat === 'All Data Formats ' ? '%' : this.state.dataFormat,
                    year: this.state.year === '' ? '%' : this.state.year,
                    dataset_title: this.state.dataset_title === '' ? '%' : '%' + this.state.dataset_title + '%'
                },
                arrayParams: {
                      subdomain: this.state.subdomain === 'All subdomains  ' ? '%' : this.state.subdomain,
                      author: this.state.authors
                },
                sortBy: this.state.sortBy === 'Sort By  ' ? 'None' : this.state.sortBy
              
            }
        })
          .then(response => {
            console.log("///////////");
            console.log(response.data);
            console.log("///////////");
            this.setState({
              resultsSearchArray:response.data
            });
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
                <InputText nameOfDropdown="dataFormat" titleDropdown={this.state.dataFormat} listOfItems={this.state.searchInputOptions.dataFormat} changeValue={this.changeValue}  />
                </Col>
            </Row>
            <Row className="padding-top-20">
                <Col md={{ size: 5, offset: 0 }}>
                    <Input type="text" name="author" id="Author" placeholder="Author" 
                        onChange={e => this.changeValue(e.target.value, 'authors', true)} />
                </Col>
                <Col md={{ size: 2, offset: 0 }}>
                    <Input type="number" name="year" id="Year" placeholder="Year" className="text-align-center" 
                        onChange={e => this.changeValue(e.target.value, 'year', true)}/>
                </Col>
                <Col md={{ size: 5, offset: 0 }}>
                    <Input type="text" name="Dataset-title" id="Dataset-title" placeholder="Dataset title" 
                        onChange={e => this.changeValue(e.target.value, 'dataset_title', true)}/>
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
                {/* <Col md={{ size: 6, offset: 0 }}></Col>*/}
                <Col md={{ size: 4, offset: 0 }} className="text-align-right"> 
                    <Button color="primary" outline className="search-button-size" onClick={() => this.props.setItemsForShow(this.state.resultsSearchArray.length, this.state.resultsPerPage, this.state.resultsSearchArray)}>
                        Search    <Badge color="secondary">{this.state.resultsSearchArray.length}</Badge>
                    </Button>
                </Col>
                    
            </Row>
          </CardText>
          
        </CardBody>
      </Card>
      )
    }

}





