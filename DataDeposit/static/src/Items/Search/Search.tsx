import * as React from 'react';
import MyTranslator from '../../assets/MyTranslator'

import axios from 'axios';
import { Card, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Input, Row, Col, Badge } from 'reactstrap';
import {InputText, CustomSelect} from '../Items-components'
import { SearchCardItems } from '../../models/SearchCardItems'
import NumericInput from 'react-numeric-input';
import "../../style_home.scss";
import { SelectList } from "../../models/FormItems";

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ResponseStatus } from '../../models/ResponseStatus'

export interface ICardProps {
    setItemsForShow: Function;
    currentPage: number;
    handleLoaderChange: Function;

    userId?: number;
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
        downloadFrom: Array<SelectList>;
    };
    downloadFrom: SelectList;
    domain: string;
    subdomain: Array<String>;
    country: string;
    dataFormat: string;
    sortBy: string;
    resultsPerPage: number | null;
    year: string;
    dataset_title: string | null;
    authors: string | null;
    resultsSearchArray: Array<SearchCardItems[]>;
    resultsSearchArrayLen: number;

	responseStatus: ResponseStatus;
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
            },
            country: ['All countries  '],
            dataFormat: ['All Data Formats '],
            sortBy: ['dataset_title ASC', 'dataset_title DESC', 'avg_rating_value ASC', 'avg_rating_value DESC'],
            downloadFrom: [{label: 'All Downloads ', value: '*'}, {label: 'Download Link', value: 'EXTERNAL'}, {label: 'Download File', value: 'INTERNAL'}, {label: 'No Download', value: 'NONE'}]
        },
        domain: "All domains  ",
        subdomain: [],
        country: "All countries  ",
        dataFormat: "All Data Formats ",
        downloadFrom: {label: "All Downloads ", value: "*"},
        sortBy: "Sort By  ",
        resultsPerPage: 7,
        year: '',
        dataset_title: '',
        authors: '',
        resultsSearchArray: [],
        resultsSearchArrayLen: 0,
        responseStatus: {
			wasError: false,
			wasSuccess: false,
            wasInfo: false,
			responseMessage: ""
		}
    }
    
    handleChange = date => {
        this.setState({
          startDate: date
        });
    };

    componentDidMount(): void {
        let responseGetStatus: ResponseStatus = {};
		const translate = new MyTranslator("Response-codes");

        // Domains, Tags, Countries
        axios.get( '/getDefaultData')
        .then(response => {
            if (response.data['statusCode'] === 200) {
                responseGetStatus.wasSuccess = true;
                this.state.searchInputOptions.domain = ['All domains  '].concat(response.data['data'][0])
            
                for(var domain in response.data['data'][1]) {
                    if(domain in this.state.searchInputOptions.subdomainList) {
                        this.state.searchInputOptions.subdomainList[domain].concat(response.data['data'][1][domain]);
                    } else {
                        this.state.searchInputOptions.subdomainList[domain] = response.data['data'][1][domain];
                    }
                }
                this.state.searchInputOptions.country = ['All countries  '].concat(response.data['data'][2]);
                this.state.searchInputOptions.dataFormat = ['All Data Formats '].concat(response.data['data'][3]);
            } else {
                responseGetStatus.wasError = true;
                responseGetStatus.responseMessage = translate.useTranslation(response.data['data']);
            }
        })
        .catch(function (error) {
            console.log(error);
            responseGetStatus.wasError = true;
            responseGetStatus.responseMessage = translate.useTranslation("GET_DEFAULT_DATA_ERROR");
        })
        .finally( () => {
            // always executed
            this.forceUpdate();
        });

        ///////////////// FUNCTIONS /////////////////
        this.searchData = this.searchData.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.searchData(true);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentPage !== this.props.currentPage) {
            this.searchData(false);
        }
    }

    changeValue(e, comboBoxTitle, shouldUpdateNumber): void {
        console.log("CODRIN");
        console.log(e);
        if (comboBoxTitle === 'domain') {
            this.state.searchInputOptions.subdomain = this.state.searchInputOptions.subdomainList[e];
            this.setState({
                subdomain: []
            });
        }

        if (comboBoxTitle === 'dataFormat') {
            if (this.state.downloadFrom.value === 'EXTERNAL' || this.state.downloadFrom.value === 'NONE')
            {
                this.state.downloadFrom = {label: "All Downloads ", value: "*"}
            }
        }

        if (comboBoxTitle === 'downloadFrom') {
            if (e.value && (e.value === 'EXTERNAL' || e.value === 'NONE'))
            {
                this.setState({
                    dataFormat: "All Data Formats "
                });
            }
        }

        this.state[comboBoxTitle] = e;
        this.forceUpdate();
        if (shouldUpdateNumber) {
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

    searchData(shouldCount: boolean, searchWasPressed: boolean = false): void {
        console.log("AEROSMITH");
        console.log(this.props.currentPage);
        let responseStatus: ResponseStatus = {};
		const translate = new MyTranslator("Response-codes");
        
        if (shouldCount == false) {
            this.props.handleLoaderChange(true);
        }
        axios.get( '/datasets', {
            params: {
                allFilters: {
                    notArrayParams: {
                        domain: this.state.domain === 'All domains  ' ? '*' : this.state.domain,
                        country: this.state.country === 'All countries  ' ? '*' : this.state.country,
                        data_format: this.state.dataFormat === 'All Data Formats ' ? '*' : this.state.dataFormat,
                        year: this.state.year === '' ? '*' : this.state.year + '*',
                        dataset_title: this.state.dataset_title === '' ? '*' : this.state.dataset_title,
                        downloadType: this.state.downloadFrom.value,
                        userId: this.props.userId
                    },
                    arrayParams: {
                        tags: this.state.subdomain, //=== 'All subdomains  ' ? '' : this.state.subdomain,
                        author: this.state.authors.split(",")
                    },
                    sortBy: this.state.sortBy === 'Sort By  ' ? 'None' : this.splitSort(this.state.sortBy),
                    sortByField: this.state.sortBy === 'Sort By  ' ? 'None' : this.splitSortName(this.state.sortBy),
                    count: shouldCount,
                    resultsPerPage: this.state.resultsPerPage,
                    currentPage: this.props.currentPage
                }
            }
        })
        .then(response => {
            console.log("///////////");
            console.log(response.data);
            console.log("///////////");
            if (shouldCount == false) {
                if (response.data['statusCode'] === 200) {
                    responseStatus.wasSuccess = true;

                    this.setState({
                        resultsSearchArray:response.data['data']
                    }, () => {
                        this.props.handleLoaderChange(false);
                        responseStatus.wasInfo = this.state.resultsSearchArrayLen == 0;
                        responseStatus.responseMessage = translate.useTranslation("ITEMS_NOT_FOUND");
                        this.props.setItemsForShow(this.state.resultsSearchArrayLen, this.state.resultsPerPage, this.state.resultsSearchArray, searchWasPressed, responseStatus);
                    });
                } else {
                    responseStatus.wasError = true;
                    responseStatus.responseMessage = translate.useTranslation(response.data['data']);
                    this.props.setItemsForShow(this.state.resultsSearchArrayLen, this.state.resultsPerPage, this.state.resultsSearchArray, searchWasPressed, responseStatus);
                }
            } else {
                if (response.data['statusCode'] === 200) {
                    responseStatus.wasSuccess = true;
                    this.setState({
                        resultsSearchArrayLen:response.data['data']
                    });
                } else {
                    responseStatus.wasError = true;
                    responseStatus.responseMessage = translate.useTranslation(response.data['data']);
                }
            }
        })
        .catch( error => {
            console.log(error);
            this.props.handleLoaderChange(false);
            responseStatus.wasError = true;
            responseStatus.responseMessage = translate.useTranslation("GET_DATASETS_ERROR");
            this.props.setItemsForShow(0, 0, [], searchWasPressed, responseStatus);
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
        const translate = new MyTranslator("Search");
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
                    <InputText nameOfDropdown="downloadFrom" titleDropdown={this.state.downloadFrom.label} listOfItems={this.state.searchInputOptions.downloadFrom} changeValue={this.changeValue}  />
                </Col>
            </Row>
            <Row className="padding-top-20">
                <Col>
                    <CustomSelect 
                        options={this.state.searchInputOptions.subdomain}
                        value={this.state.subdomain}
                        handleChange={this.handleSelectChange}
                        placeholder="All tags"
                    />

                </Col>
            </Row>
            <Row className="padding-top-20">
                <Col md={{ size: 5, offset: 0 }}>
                    <Input type="text" name="author" id="Author" placeholder={translate.useTranslation("author")} 
                        onChange={e => this.changeValue(e.target.value, 'authors', true)} />
                </Col>
                <Col md={{ size: 2, offset: 0 }}>
                    <Input type="number" name="year" id="Year" placeholder={translate.useTranslation("year")}  className="text-align-center" 
                        onChange={e => this.changeValue(e.target.value, 'year', true)}/>
                </Col>
                <Col md={{ size: 5, offset: 0 }}>
                    <Input type="text" name="Dataset-title" id="Dataset-title" placeholder={translate.useTranslation("dataset-title")} 
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
                    <FontAwesomeIcon icon={faSearch}/>{translate.useTranslation("search")}    <Badge color="secondary">{this.state.resultsSearchArrayLen}</Badge>
                    </Button>
                </Col>
                    
            </Row>
          </CardText>
          
        </CardBody>
      </Card>
      )
    }
}





