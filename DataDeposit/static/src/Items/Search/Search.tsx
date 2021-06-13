import * as React from 'react';
import MyTranslator from '../../assets/MyTranslator'

import axios from 'axios';
import { Card, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Row, Col, Badge } from 'reactstrap';
import { InputText, CustomSelect } from '../Items-components'
import { SearchCardItems } from '../../models/SearchCardItems'
import NumericInput from 'react-numeric-input';
import "../../style_home.scss";
import { SelectList } from "../../models/FormItems";

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ResponseStatus } from '../../models/ResponseStatus'
import { IFilters } from '../../models/IFilters'
import { AvField, AvForm } from 'availity-reactstrap-validation';

export interface ICardProps {
    setItemsForShow: Function;
    currentPage: number;
    handleLoaderChange: Function;

    userId?: number;
    allFiltersType?: IFilters;
}

export interface ICardState {
    buttonDropDownStatus: boolean;
    startDate: Date;
    searchInputOptions: {
        domain: Array<String>;
        subdomain: Array<String>;
        country: Array<String>;
        dataFormat: Array<String>;
        sortBy: Array<SelectList>;
        downloadFrom: Array<SelectList>;
    };
    downloadFrom: string;
    domain: string;
    tags: Array<String>;
    country: string;
    dataFormat: string;
    sortBy: SelectList;
    resultsPerPage: number;
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
            sortBy: [{label: "Title ASC", value: 'dataset_title ASC'}, {label: "Title DESC", value: 'dataset_title DESC'}, {label: "Rating ASC", value: 'avg_rating_value ASC'}, {label: "Rating DESC", value: 'avg_rating_value DESC'}],
            downloadFrom: [{label: 'All Downloads ', value: '*'}, {label: 'Download Link', value: 'EXTERNAL'}, {label: 'Download File', value: 'INTERNAL'}, {label: 'No Download', value: 'NONE'}]
        },
        domain: "All domains  ",
        tags: [],
        country: "All countries  ",
        dataFormat: "All Data Formats ",
        downloadFrom: "*",
        sortBy: {label: "Sort By  ", value: "*"},
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
            this.updateTagList(this.state.domain);
            this.forceUpdate();
        });

        ///////////////// FUNCTIONS /////////////////
        this.searchData = this.searchData.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateTagList = this.updateTagList.bind(this);
        if (!localStorage.getItem('allFilters') || this.props.userId) {
            this.searchData(true);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.allFiltersType !== this.props.allFiltersType) {
            console.log("BAZOOKA");
            if (this.props.allFiltersType) {
                this.setState({
                    domain: this.props.allFiltersType.notArrayParams.domain === '*' ? 'All domains  ' : this.props.allFiltersType.notArrayParams.domain,
                    tags: this.props.allFiltersType.arrayParams.tags,
                    country: this.props.allFiltersType.notArrayParams.country === '*' ? "All countries  " : this.props.allFiltersType.notArrayParams.country,
                    dataFormat: this.props.allFiltersType.notArrayParams.data_format === '*' ? "All Data Formats " : this.props.allFiltersType.notArrayParams.data_format,
                    downloadFrom: this.props.allFiltersType.notArrayParams.downloadType,
                    sortBy: {label: "Sort By  ", value: "*"},
                    resultsPerPage: this.props.allFiltersType.resultsPerPage,
                    year: this.props.allFiltersType.notArrayParams.year,
                    dataset_title: this.props.allFiltersType.notArrayParams.dataset_title === '*' ? '' : this.props.allFiltersType.notArrayParams.dataset_title,
                    authors: this.props.allFiltersType.arrayParams.author.join(),
                    resultsSearchArrayLen: this.props.allFiltersType.totalResults
                });
                
                this.updateTagList(this.props.allFiltersType.notArrayParams.domain);
                this.searchData(false, false, this.props.allFiltersType);
            }
        }
        else if (prevProps.currentPage !== this.props.currentPage) {
            this.searchData(false);
        }
    }

    updateTagList(newDomain: string): boolean {
        if (this.state.searchInputOptions.subdomainList[newDomain]) {
            this.state.searchInputOptions.subdomain = this.state.searchInputOptions.subdomainList[newDomain];
            this.forceUpdate();
            return true;
        }
        return false;
    }

    changeValue(e, comboBoxTitle, shouldUpdateNumber): void {
        console.log("CODRIN");
        console.log(e);
        if (comboBoxTitle === 'domain') {
            this.state.searchInputOptions.subdomain = this.state.searchInputOptions.subdomainList[e];
            this.setState({
                tags: []
            });
        }

        if (comboBoxTitle === 'dataFormat') {
            if (this.state.downloadFrom === 'EXTERNAL' || this.state.downloadFrom === 'NONE')
            {
                this.state.downloadFrom = "*"
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

    handleSubmit(event, errors, values): void {
        if (errors.length == 0) {
            this.searchData(false, true);   
        }
    }

    searchData(shouldCount: boolean, searchWasPressed: boolean = false, allFiltersType: IFilters | null = null): void {
        console.log("AEROSMITH");
        console.log(this.props.currentPage);
        let responseStatus: ResponseStatus = {};
		const translate = new MyTranslator("Response-codes");
        if (shouldCount == false) {
            this.props.handleLoaderChange(true);
        }
        let currentFilters: IFilters = {
            notArrayParams: {
                domain: this.state.domain === 'All domains  ' ? '*' : this.state.domain,
                country: this.state.country === 'All countries  ' ? '*' : this.state.country,
                data_format: this.state.dataFormat === 'All Data Formats ' ? '*' : this.state.dataFormat,
                year: this.state.year === '' ? '*' : this.state.year + '*',
                dataset_title: this.state.dataset_title === '' ? '*' : this.state.dataset_title,
                downloadType: this.state.downloadFrom,
                userId: this.props.userId
            },
            arrayParams: {
                tags: this.state.tags, //=== 'All subdomains  ' ? '' : this.state.subdomain,
                author: this.state.authors.split(",")
            },
            sortBy: this.state.sortBy.value === '*' ? 'None' : this.splitSort(this.state.sortBy.value),
            sortByField: this.state.sortBy.value === '*' ? 'None' : this.splitSortName(this.state.sortBy.value),
            count: shouldCount,
            resultsPerPage: this.state.resultsPerPage,
            currentPage: this.props.currentPage,
            totalResults: this.state.resultsSearchArrayLen
        };

        if (allFiltersType) {
            currentFilters = allFiltersType;
        }

        if (shouldCount == false) {
            localStorage.setItem('allFilters', JSON.stringify(currentFilters));
        }

        axios.get( '/datasets', {
            params: {
                allFilters: currentFilters
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
            tags: value
        }, () => {
            this.searchData(true);
        });
    };
    

    render() { 
        const translate = new MyTranslator("Search");
        const yearValueRegex: RegExpMatchArray | null = this.state.year.match(/(\d+)/);
        let yearValue: number | null = yearValueRegex ? parseInt(yearValueRegex[0]) : null;
        
      return (
        <Card className="z-depth-1-half">
        <CardBody>
        <CardTitle></CardTitle>
        <CardSubtitle></CardSubtitle>
        <CardText>
        <AvForm onSubmit={this.handleSubmit}>
            <Row>
                <Col>
                    <AvField
                        type="select" 
                        label={translate.useTranslation("domain-label")} 
                        name="domain"
                        value={this.state.domain}
                        onChange={(e) => this.changeValue(e.target.value, e.target.name, true)} >
                        {
                            this.state.searchInputOptions.domain.map((item: string) => {
                                return (<option value={item}>{item}</option>)
                            })
                        }
                    </AvField>
                </Col>
                <Col>
                    <AvField
                        type="select" 
                        value={this.state.country}
                        label={translate.useTranslation("country-label")} 
                        onChange={(e) => this.changeValue(e.target.value, e.target.name, true)}
                        name="country" >
                        {
                            this.state.searchInputOptions.country.map((item: string) => {
                                return (<option value={item}>{item}</option>)
                            })
                        }
                    </AvField>
                </Col>
                <Col>
                    <AvField
                        type="select" 
                        name="dataFormat"
                        value={this.state.dataFormat}
                        label={translate.useTranslation("dataFormat-label")} 
                        onChange={(e) => this.changeValue(e.target.value, e.target.name, true)} >
                        {
                            this.state.searchInputOptions.dataFormat.map((item: string) => {
                                return (<option value={item}>{item}</option>)
                            })
                        }
                    </AvField>
                </Col>
                <Col>
                    <AvField
                        type="select" 
                        label={translate.useTranslation("downloadFrom-label")} 
                        name="downloadFrom"
                        value={this.state.downloadFrom}
                        onChange={(e) => this.changeValue(e.target.value, e.target.name, true)} >
                        {
                            this.state.searchInputOptions.downloadFrom.map((item: SelectList) => {
                                return (<option value={item.value}>{item.label}</option>)
                            })
                        }
                    </AvField>
                </Col>
            </Row>
            <Row className="padding-top-20">
                <Col>
                    <CustomSelect 
                        options={this.state.searchInputOptions.subdomain}
                        value={this.state.tags}
                        handleChange={this.handleSelectChange}
                        placeholder="All tags"
                    />

                </Col>
            </Row>
            <Row className="padding-top-20 align-start">
                <Col md={{ size: 5, offset: 0 }}>
                    <AvField 
                        type="text" 
                        id="Author"
                        name="authors"
                        value={this.state.authors}
                        placeholder={translate.useTranslation("author")}
                        onChange={e => this.changeValue(e.target.value, e.target.name, true)}
                        validate={{
                            pattern: {value: '^[A-Za-z0-9; ]+$', errorMessage: translate.useTranslation("dataset-author-pattern")}
                        }}
                    />
                </Col>
                <Col md={{ size: 2, offset: 0 }}>
                    <AvField 
                        type="number" 
                        name="year" 
                        value={yearValue}
                        placeholder={translate.useTranslation("year")}
                        onChange={e => this.changeValue(e.target.value, e.target.name, true)}
                    />
                </Col>
                <Col md={{ size: 5, offset: 0 }}>
                    <AvField 
                        type="text" 
                        id="Dataset-title"
                        name="dataset_title"
                        value={this.state.dataset_title}
                        placeholder={translate.useTranslation("dataset-title")}
                        onChange={e => this.changeValue(e.target.value, e.target.name, true)}
                        validate={{
                            pattern: {value: '^[A-Za-z0-9- ]+$', errorMessage: translate.useTranslation("dataset-title-error-pattern")}
                        }}
                    />
                </Col>
            </Row>
            <Row className="padding-top-20">
                <Col>
                    <InputText 
                        nameOfDropdown="sortBy" 
                        titleDropdown={this.state.sortBy.label} 
                        listOfItems={this.state.searchInputOptions.sortBy} 
                        className="button-style-sort"
                        changeValue={this.changeValue} />
                
                    <NumericInput 
                        className="width-numeric-input" 
                        step={1} 
                        min={3} 
                        max={50} 
                        value={this.state.resultsPerPage}
                        onChange={value => this.setState({resultsPerPage: value ? value : 3 })} />
                </Col>
                <Col md={{ size: 4, offset: 0 }} className="text-align-right"> 
                    <Button color="primary" outline className="search-button-size" type="submit">
                    <FontAwesomeIcon icon={faSearch}/>{translate.useTranslation("search")}    <Badge color="secondary">{this.state.resultsSearchArrayLen}</Badge>
                    </Button>
                </Col>
                    
            </Row>
        </AvForm>
        </CardText>
          
        </CardBody>
      </Card>
      )
    }
}
