import * as React from 'react';

import axios from 'axios';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Input, Row, Col, Badge
  } from 'reactstrap';
import {InputText, LoaderComponent, CustomSelect} from '../Items-components'
import DatePicker from "react-datepicker";
import NumericInput from 'react-numeric-input';
import "../../style_home.scss";

export interface ICardProps {
    setItemsForShow: Function;
    currentPage: number;
    handleLoaderChange: Function;
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
    subdomain: Array<String>;
    country: string;
    dataFormat: string;
    sortBy: string;
    resultsPerPage: number | null;
    year: string;
    dataset_title: string | null;
    authors: string | null;
    resultsSearchArray: Array<String>;
    resultsSearchArrayLen: number;
}

export default class Search extends React.Component<ICardProps, ICardState> {
    state = {
        buttonDropDownStatus: true,
        startDate: new Date(),
        searchInputOptions: {
            domain: ['All domains  '],//['All domains  ', 'IT', 'MEDICINE', 'ARCHITECTURE', 'BIOLOGY', 'CHEMISTRY', 'PHYSICS', 'BUSINESS'],
            subdomain: [],
            subdomainList: {
                'All domains  ': []
                // IT: [{ value: 'IT_1', label: 'IT_1' }, { value: 'IT_2', label: 'IT_2' }, { value: 'IT_3', label: 'IT_3' }, { value: 'IT_4', label: 'IT_4' }],
                // MEDICINE: [{ value: 'MEDICINE_1', label: 'MEDICINE_1' }, { value: 'MEDICINE_2', label: 'MEDICINE_2' }, { value: 'MEDICINE_3', label: 'MEDICINE_3' }, { value: 'MEDICINE_4', label: 'MEDICINE_4' }, { value: 'MEDICINE_5', label: 'MEDICINE_5' }],
                // ARCHITECTURE: [{ value: 'ARCHITECTURE_1', label: 'ARCHITECTURE_1' }, { value: 'ARCHITECTURE_2', label: 'ARCHITECTURE_2' }, { value: 'ARCHITECTURE_3', label: 'ARCHITECTURE_3' }, { value: 'ARCHITECTURE_4', label: 'ARCHITECTURE_4' }],
                // BIOLOGY: [{ value: 'BIOLOGY_1', label: 'BIOLOGY_1' }, { value: 'BIOLOGY_2', label: 'BIOLOGY_2' }, { value: 'BIOLOGY_3', label: 'BIOLOGY_3' }, { value: 'BIOLOGY_4', label: 'BIOLOGY_4' }],
                // CHEMISTRY: [{ value: 'CHEMISTRY_1', label: 'CHEMISTRY_1' }, { value: 'CHEMISTRY_2', label: 'CHEMISTRY_2' }, { value: 'CHEMISTRY_3', label: 'CHEMISTRY_3' }, { value: 'CHEMISTRY_4', label: 'CHEMISTRY_4' }],
                // PHYSICS: [{ value: 'PHYSICS_1', label: 'PHYSICS_1' }, { value: 'PHYSICS_2', label: 'PHYSICS_2' }, { value: 'PHYSICS_3', label: 'PHYSICS_3' }, { value: 'PHYSICS_4', label: 'PHYSICS_4' }],
                // BUSINESS: [{ value: 'BUSINESS_1', label: 'BUSINESS_1' }, { value: 'BUSINESS_2', label: 'BUSINESS_2' }]
            },
            country: ['All countries  ', 'Romania', 'Chile', 'Japan', 'Russia', 'China', 'Canada', 'Mexico', 'Egypt'],
            dataFormat: ['All Data Formats ', 'zip', 'rar', 'tar.gz'],
            sortBy: ['Dataset_title ASC', 'Dataset_title DESC', 'Avg_Rating_Value ASC', 'Avg_Rating_Value DESC'],
            downloadFrom: ['All Downloads ', 'Download Link', 'Download File', 'No Download']
        },
        domain: "All domains  ",
        subdomain: [],
        country: "All countries  ",
        dataFormat: "All Data Formats ",
        downloadFrom: "All Downloads ",
        sortBy: "Sort By  ",
        resultsPerPage: 7,
        year: '',
        dataset_title: '',
        authors: '',
        resultsSearchArray: [],
        resultsSearchArrayLen: 0
    }
    
    handleChange = date => {
        this.setState({
          startDate: date
        });
    };

    componentDidMount() {

        axios.get( '/getDomainsAndTags', {
            params: {}
        })
          .then(response => {
            // ['All domains  '].push(response.data)
            this.state.searchInputOptions.domain = ['All domains  '].concat(response.data[0])
            
            for(var domain in response.data[1]) {
                if(domain in this.state.searchInputOptions.subdomainList) {
                    this.state.searchInputOptions.subdomainList[domain].concat(response.data[1][domain]);
                } else {
                    this.state.searchInputOptions.subdomainList[domain] = response.data[1][domain];
                }
            }
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally( () => {
            // always executed
            this.forceUpdate();
          });


        this.searchData(true);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentPage !== this.props.currentPage) {
            this.searchData(false);
        }
    }

    changeValue = (e, comboBoxTitle, shouldUpdateNumber) => {
        console.log("CODRIN");
        console.log(e);
        if(comboBoxTitle === 'domain') {
            this.state.searchInputOptions.subdomain = this.state.searchInputOptions.subdomainList[e];
            this.setState({
                subdomain: []
            });
        }
        this.state[comboBoxTitle] = '' + e;
        this.forceUpdate();
        if(shouldUpdateNumber) {
        	this.searchData(true);
        }
    }

    splitSort = (words) => {
        var n = words.split(" ");
        return n[n.length - 1];
    }

    splitSortName = (words) => {
        var n = words.split(" ");
        return n[0];
    }

    searchData = (shouldCount, searchWasPressed = false) => {
        console.log("AEROSMITH");
        console.log(this.props.currentPage);
        console.log("sdl;jfmsuidc");
        
        if (shouldCount == false) {
            this.props.handleLoaderChange(true);
        }

        axios.post( '/getData', {
            params: {
              	notArrayParams: {
                    domain: this.state.domain === 'All domains  ' ? '*' : this.state.domain,
                    country: this.state.country === 'All countries  ' ? '*' : this.state.country,
                    data_format: this.state.dataFormat === 'All Data Formats ' ? '*' : this.state.dataFormat,
                    year: this.state.year === '' ? '*' : this.state.year + '*',
                    dataset_title: this.state.dataset_title === '' ? '*' : '*' + this.state.dataset_title + '*',
                    downloadFrom: this.state.downloadFrom === 'All Downloads ' ? '*' : this.state.downloadFrom,
                },
                arrayParams: {
                      tags: this.state.subdomain, //=== 'All subdomains  ' ? '' : this.state.subdomain,
                      author: this.state.authors
                },
                sortBy: this.state.sortBy === 'Sort By  ' ? 'None' : this.splitSort(this.state.sortBy),
                sortByField: this.state.sortBy === 'Sort By  ' ? 'None' : this.splitSortName(this.state.sortBy),
                count: shouldCount,
                resultsPerPage: this.state.resultsPerPage,
                currentPage: this.props.currentPage
            }
        })
          .then(response => {
            console.log("///////////");
            console.log(response.data);
            console.log("///////////");
            if (shouldCount == false) {
                this.setState({
                    resultsSearchArray:response.data
                }, () => {
                    this.props.handleLoaderChange(false);
                    this.props.setItemsForShow(this.state.resultsSearchArrayLen, this.state.resultsPerPage, this.state.resultsSearchArray, searchWasPressed, false, this.state.resultsSearchArrayLen == 0);
                });
            } else {
                this.setState({
                    resultsSearchArrayLen:response.data
                });
            }
    

          })
          .catch( error => {
            console.log(error);
            this.props.setItemsForShow(0, 0, [], searchWasPressed, true, false);
          })
          .finally( () => {
            // always executed
          }); 
    }

    handleSelectChange = value => {
        this.setState({
            subdomain: value
        }, () => {
            this.searchData(true);
        });
    };
    

    render() { 

      return (
        <Card className="z-depth-1-half">
        <CardBody>
          <CardTitle></CardTitle>
          <CardSubtitle></CardSubtitle>
          <CardText>
            <Row>
                <Col className="text-align-left">
                    <InputText nameOfDropdown="domain" titleDropdown={this.state.domain} listOfItems={this.state.searchInputOptions.domain} changeValue={this.changeValue} />
                </Col>
                <Col className="text-align-center">
                    <InputText nameOfDropdown="country" titleDropdown={this.state.country} listOfItems={this.state.searchInputOptions.country} changeValue={this.changeValue} />
                </Col>
                <Col className="text-align-right">
                    <InputText nameOfDropdown="dataFormat" titleDropdown={this.state.dataFormat} listOfItems={this.state.searchInputOptions.dataFormat} changeValue={this.changeValue}  />
                </Col>
                <Col className="text-align-right">
                    <InputText nameOfDropdown="downloadFrom" titleDropdown={this.state.downloadFrom} listOfItems={this.state.searchInputOptions.downloadFrom} changeValue={this.changeValue}  />
                </Col>
            </Row>
            <Row className="padding-top-20">
                <Col>
                    <CustomSelect 
                        options={this.state.searchInputOptions.subdomain}
                        value={this.state.subdomain}
                        handleChange={this.handleSelectChange}
                        placeholder="All subdomains"
                    />

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
                    <InputText 
                        nameOfDropdown="sortBy" 
                        titleDropdown={this.state.sortBy} 
                        listOfItems={this.state.searchInputOptions.sortBy} 
                        className="button-style-sort"
                        changeValue={this.changeValue} />
                
                    <NumericInput 
                        className="width-numeric-input" 
                        step={1} 
                        min={3} 
                        max={50} 
                        value={this.state.resultsPerPage}
                        onChange={value => this.setState({resultsPerPage: value })} />
                </Col>
                {/* <Col md={{ size: 6, offset: 0 }}></Col>*/}
                <Col md={{ size: 4, offset: 0 }} className="text-align-right"> 
                    <Button color="primary" outline className="search-button-size" onClick={() => this.searchData(false, true)}>
                        Search    <Badge color="secondary">{this.state.resultsSearchArrayLen}</Badge>
                    </Button>
                </Col>
                    
            </Row>
          </CardText>
          
        </CardBody>
      </Card>
      )
    }
}





