import * as React from 'react';

import axios from 'axios';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Input, Row, Col, Badge
  } from 'reactstrap';
import "../style_home.scss";
import {InputText, Switch} from '../Items/Items-components'
import LeftBar from "../LeftBar/LeftBar";
import { Container } from 'semantic-ui-react';
import Title from '../Items/Title/Title';
 


export interface IUploadPageProps {
    color: string;
}

export interface IUploadPageState {
    buttonDropDownStatus: boolean;
    startDate: Date;
    dataset_title: string;
    article_title: string;
    dataset_authors: string;
    year: number;
    domain: string;
    subdomain: string;
    dataFormat: string;
    country: string;
    valueSwitch: boolean;
    gitlink: string;
    uploadInputOptions: {
        domain: Array<String>;
        subdomain: Array<String>;
        subdomainList: {
            IT: Array<String>;
            MEDICINE: Array<String>;
            ARCHITECTURE: Array<String>;
            BIOLOGY: Array<String>;
            CHEMISTRY: Array<String>;
            COMPUTER_SCIENCE: Array<String>;
            PHYSICS: Array<String>;
            BUSINESS: Array<String>;
        };
        country: Array<String>;
        dataFormat: Array<String>;
    };
}

export default class UploadPage extends React.Component<IUploadPageProps, IUploadPageState> {

    state = {
        buttonDropDownStatus: true,
        startDate: new Date(),
        dataset_title: '',
        article_title: '',
        dataset_authors: '',
        gitlink: '',
        year: 0,
        valueSwitch: false,
        domain: "Select Domain  ",
        country: "Select Country  ",
        subdomain: "Select Subdomains  ",
        dataFormat: "Select Dataformat  ",
        uploadInputOptions: {
            domain: ['IT', 'MEDICINE', 'ARCHITECTURE', 'BIOLOGY', 'CHEMISTRY', 'COMPUTER_SCIENCE', 'PHYSICS', 'BUSINESS'],
            subdomain: [],
            subdomainList: {
                IT: ['mata'],
                MEDICINE: ['tactu'],
                ARCHITECTURE: ['Codrin'],
                BIOLOGY: ['WoT'],
                CHEMISTRY: ['IS7'],
                COMPUTER_SCIENCE: ['IS4'],
                PHYSICS: ['Zapp'],
                BUSINESS: ['Ragnaros']
            },
            country: ['Romania', 'Patagonia', 'Japonia'],
            dataFormat: ['zip', 'rar', 'tar.gz']
        }
    }
    
    handleChange = date => {
        this.setState({
          startDate: date
        });
    };

    componentDidMount() {

    }

    changeValue = (e, comboBoxTitle, shouldUpdate = false) => {
        if(comboBoxTitle === 'domain') {
            this.state.uploadInputOptions.subdomain = this.state.uploadInputOptions.subdomainList[e];
            this.state.subdomain ="Select Subdomains  ";
        }
        this.state[comboBoxTitle] = e;
        
        this.forceUpdate();
        console.log("TROOPER");
        console.log(this.state);
    }
  
    render() {  

      return (
        <Container className="themed-container" fluid={true}>
            <Row lg="12">
                <Title titleSet={this.props.color}/>
            </Row>
            <Row md="4">
                
                <LeftBar color='black' modeSearch={false}/>
                <Col md={{ size: 3, offset: 0 }}>
                    .
                </Col>
                <Col md={{ size: 9, offset: 0 }}>
                <Card>
                    <CardBody>
                    <CardTitle></CardTitle>
                    <CardSubtitle></CardSubtitle>
                    <CardText>
                        <Row>
                            <Col className="display-flex"><span className="padding-right-16">Private</span>
                            <Switch
                                isOn={this.state.valueSwitch}
                                onColor="#00FF00"
                                handleToggle={() => this.changeValue(!this.state.valueSwitch, 'valueSwitch')}
                            />
                            </Col>
                        </Row>
                        <Row className="padding-top-20">
                            <Col >
                                <Input type="text" name="dataset-title" id="Dataset-title" placeholder="Dataset title" 
                                    onChange={e => this.changeValue(e.target.value, 'dataset_title')}/>
                            </Col>
                            
                        </Row>
                        <Row className="padding-top-20">
                            <Col >
                                <Input type="text" name="dataset-authors" id="Dataset-authors" placeholder="Dataset authors" 
                                    onChange={e => this.changeValue(e.target.value, 'dataset_authors')}/>
                            </Col>
                            
                        </Row>
                        <Row className="padding-top-20">
                            <Col >
                                <Input type="text" name="article-title" id="Article-title" placeholder="Article title" 
                                    onChange={e => this.changeValue(e.target.value, 'article_title')}/>
                            </Col>
                            
                        </Row>
                        <Row className="padding-top-20">
                            <Col md={{ size: 3, offset: 0 }}>
                                <Input type="number" name="year" id="year" placeholder="Year of the publication" 
                                    onChange={e => this.changeValue(e.target.value, 'year')}/>
                            </Col>
                            <Col></Col>
                            
                        </Row>
                        <Row className="padding-top-20">
                            <Col className="text-align-left">
                                <InputText nameOfDropdown="country" titleDropdown={this.state.country} listOfItems={this.state.uploadInputOptions.country} changeValue={this.changeValue} className="button-style-upload" />
                            </Col>
                        </Row>

                        <Row className="padding-top-20">
                            <Col className="text-align-left">
                                <InputText nameOfDropdown="domain" titleDropdown={this.state.domain} listOfItems={this.state.uploadInputOptions.domain} changeValue={this.changeValue} className="button-style-upload" />
                            </Col>
                        </Row>

                        <Row className="padding-top-20">
                            <Col className="text-align-left">
                                <InputText nameOfDropdown="subdomain" titleDropdown={this.state.subdomain} listOfItems={this.state.uploadInputOptions.subdomain} changeValue={this.changeValue} className="button-style-upload" />
                            </Col>
                        </Row>

                        <Row className="padding-top-20">
                            <Col className="text-align-left">
                                <InputText nameOfDropdown="dataFormat" titleDropdown={this.state.dataFormat} listOfItems={this.state.uploadInputOptions.dataFormat} changeValue={this.changeValue} className="button-style-upload" />
                            </Col>
                        </Row>
                        <Row className="padding-top-20">
                            <Col>
                                <Input type="textarea" name="text" maxLength="200"  id="description" placeholder="Short Description" className="margin-top-10" />
                            </Col>
                        </Row>

                        <Row className="padding-top-20">
                            <Col >
                                <Input type="text" name="gitlink" id="gitlink" placeholder="GitHub link" 
                                    onChange={e => this.changeValue(e.target.value, 'gitlink')}/>
                            </Col>
                        </Row>

                        <Row className="padding-top-20">
                            <Col className="text-align-center">
                                <Button color="primary" outline className="upload-button-size">
                                    Upload dataset
                                </Button>
                            </Col>
                        </Row>

















                        {/* <Row>
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
                            <Col md={{ size: 4, offset: 0 }} className="text-align-right"> 
                                <Button color="primary" outline className="search-button-size" onClick={() => this.props.setItemsForShow(this.state.resultsSearchArray.length, this.state.resultsPerPage, this.state.resultsSearchArray)}>
                                    Search    <Badge color="secondary">{this.state.resultsSearchArray.length}</Badge>
                                </Button>
                            </Col>
                                
                        </Row> */}
                    </CardText>
                    
                    </CardBody>
                </Card>
                </Col>
                
            </Row>
    </Container>
      )
    }

}





