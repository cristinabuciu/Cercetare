import * as React from 'react';

import axios from 'axios';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Input, Row, Col, Badge, Form, FormGroup, FormText, Label, Collapse
  } from 'reactstrap';
import "../style_home.scss";
import "./upload.scss";
import {InputText, Switch, LoaderComponent, TooltipButton, CustomCreatableSelect} from '../Items/Items-components'
import LeftBar from "../LeftBar/LeftBar";
import { Container } from 'semantic-ui-react';
import { faLink, faDownload, faPortrait } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Title } from '../Items/Title/Title';
import MyTranslator from '../assets/MyTranslator'
import { ResponseStatus } from '../models/ResponseStatus'
 


export interface IUploadPageFormProps {
    color: string;
    changeToSuccess: Function;
    authorsTooltip?: string;
    contAccess?: any;
    dataInteg?: any;
    dataReuse?: any;
}

export interface IUploadPageFormState {
    fileToBeSent: string | Blob;
    fileToBeSentName: string;
    buttonDropDownStatus: boolean;
    startDate: Date;
    dataset_title: string;
    article_title: string;
    short_desc: string;
    dataset_authors: string;
    year: number;
    domain: string;
    otherDomain: string | null;
    subdomain: Array<String>;
    country: string;
    valueSwitch: boolean;
    gitlink: string;
    uploadInputOptions: {
        domain: Array<String>;
        subdomain: Array<String>;
        country: Array<String>;
    };
    shouldEnterNewDomain: boolean;
    uploadOption: {
        link: boolean;
        upload: boolean;
    };
    validInputs: {
        dataset_title: boolean;
        dataset_authors: boolean;
        year: boolean;
        short_desc: boolean;
    }
    buttonUpload: boolean;
    loaderVisibility: boolean;
    dataReuse: string;
    contAccess: string;
    dataIntegrity: string;
    downloadPath: string;
}

export default class UploadPageForm extends React.Component<IUploadPageFormProps, IUploadPageFormState> {

    state = {
        fileToBeSent: '',
        fileToBeSentName: '',
        buttonDropDownStatus: true,
        startDate: new Date(),
        dataset_title: '',
        article_title: '',
        dataset_authors: '',
        short_desc: '',
        gitlink: '',
        year: 0,
        valueSwitch: false,
        domain: "Select Domain  ",
        otherDomain: null,
        country: "Select Country  ",
        subdomain: [],
        dataReuse: '',
        contAccess: '',
        dataIntegrity: '',
        downloadPath: '',

        uploadInputOptions: {
            domain: [],//['IT', 'MEDICINE', 'ARCHITECTURE', 'BIOLOGY', 'CHEMISTRY', 'PHYSICS', 'BUSINESS'],
            subdomain: [],
            subdomainList: {
                // IT: ['IT_1', 'IT_2', 'IT_3', 'IT_4'],
                // MEDICINE: ['MEDICINE_1', 'MEDICINE_2', 'MEDICINE_3', 'MEDICINE_4'],
                // ARCHITECTURE: ['ARCHITECTURE_1', 'ARCHITECTURE_2', 'ARCHITECTURE_3', 'ARCHITECTURE_4'],
                // BIOLOGY: ['BIOLOGY_1', 'BIOLOGY_2', 'BIOLOGY_3', 'BIOLOGY_4'],
                // CHEMISTRY: ['CHEMISTRY_1', 'CHEMISTRY_2', 'CHEMISTRY_3', 'CHEMISTRY_4'],
                // PHYSICS: ['PHYSICS_1', 'PHYSICS_2', 'PHYSICS_3', 'PHYSICS_4'],
                // BUSINESS: ['BUSINESS_1', 'BUSINESS_2']
            },
            country: [],
            dataFormats: []
        },
        shouldEnterNewDomain: false,
        uploadOption: {
            link: false,
            upload: false
        },

        validInputs: {
            dataset_title: false,
            dataset_authors: false,
            year: false,
            short_desc: false
            
        },
        buttonUpload: true,
        loaderVisibility: false
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
                let domains = response.data['data'][0].concat("Other");
                this.state.uploadInputOptions.domain = domains;
    
                for(var domain in response.data['data'][1]) {
                    if(domain in this.state.uploadInputOptions.subdomainList) {
                        this.state.uploadInputOptions.subdomainList[domain].concat(response.data['data'][1][domain]);
                    } else {
                        this.state.uploadInputOptions.subdomainList[domain] = response.data['data'][1][domain];
                    }
                }
                this.state.uploadInputOptions.country = response.data['data'][2];
                this.state.uploadInputOptions.dataFormats = response.data['data'][3];
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
        
        /////////// FUNCTIONS /////////////
        this.updateUploadOptions = this.updateUploadOptions.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
    }

    changeValue = (e, comboBoxTitle, shouldUpdate = false) => {
        if(comboBoxTitle === 'domain') {
            this.state.uploadInputOptions.subdomain = [];
            if (e === 'Other') {
                this.setState({
                    subdomain: [],
                    shouldEnterNewDomain: true
                });
            }
            else {
                this.state.uploadInputOptions.subdomain = this.state.uploadInputOptions.subdomainList[e];
                this.setState({
                    subdomain: [],
                    shouldEnterNewDomain: false,
                    otherDomain: null
                });
            }
        }
        this.state[comboBoxTitle] = e;
        
        this.forceUpdate();
        console.log("TROOPER");
        console.log(this.state);
    }

    checkForIntegrityOfFields = (value, field) => {
        if (value !== '') {
            this.state['validInputs'][field] = false;
            console.log("Codrin");
        }
        else {
            this.state['validInputs'][field] = true;
            this.state['buttonUpload'] = false;
            console.log("Jafescu");
        }
        this.forceUpdate();
        this.state['buttonUpload'] = !Object.keys(this.state['validInputs']).every(k => !this.state['validInputs'][k]);
    }

    handleSubmit = () => {
        const translate = new MyTranslator("Response-codes");

        this.setState({
            loaderVisibility: true
        });

        let hasErrorOnMetadata: boolean = false;
        let errorMessage: string = "";
        let hasErrorOnFiles: boolean = false;
        let datasetId: number = -1;
        const formData = new FormData();

        axios.post( '/datasets', {
            params: {
              	notArrayParams: {
                    domain: this.state.otherDomain ? this.state.otherDomain : this.state.domain,
                    country: this.state.country,
                    year: this.state.year,
                    dataset_title: this.state.dataset_title,
                    article_title: this.state.article_title,
                    short_desc: this.state.short_desc,
                    gitlink: this.state.gitlink,
                    full_desc: '...',
                    dataReuse: this.state.dataReuse,
                    dataIntegrity: this.state.dataIntegrity,
                    continuityAccess: this.state.contAccess,
                    downloadPath: this.state.downloadPath,
                },
                arrayParams: {
                    tags: this.state.subdomain,
                    authors: this.state.dataset_authors.split(", ")
                },
                private: this.state.valueSwitch
            }
        })
        .then(response => {
            if (response.data['statusCode'] === 200) {
                hasErrorOnMetadata = false;
                formData.append("packageId", response.data['data']['packageId']);
                datasetId = response.data['data']['datasetId'];

            } else {
                hasErrorOnMetadata = true;
                errorMessage = translate.useTranslation(response.data['data']);
            }
        })
        .catch(function (error) {
            console.log(error);
            hasErrorOnMetadata = true;
            errorMessage = translate.useTranslation("UPLOAD_DATASET_ERROR");
        })
        .finally( () => {
            // always executed
            if (!hasErrorOnMetadata && this.state.uploadOption.upload) {
                let file = this.state.fileToBeSent;
                formData.append("file", file);

                axios
                .post("/dataset/" + datasetId + '/files', formData)
                .then(res => {
                    if (res.data['statusCode'] === 200) {
                        hasErrorOnFiles = false;
                    } else {
                        hasErrorOnFiles = true;
                        errorMessage = translate.useTranslation(res.data['data']);
                    }
                })
                .catch(err => {
                    console.warn(err);
                    hasErrorOnFiles = true;
                    errorMessage = translate.useTranslation("UPLOAD_DATASET_FILES_ERROR");
                })
                .finally(() => {
                    if (hasErrorOnFiles) {
                        this.props.changeToSuccess(0, false, errorMessage);
                    } else {
                        this.props.changeToSuccess(datasetId);
                    }
                });
            } else {
                if (hasErrorOnMetadata) {
                    this.props.changeToSuccess(0, false, errorMessage);
                } else {
                    this.props.changeToSuccess(datasetId);
                }
            }
        });
    }

    uploadFile(e): boolean {
        // 100 Mb
        debugger;
        if(e.target.files[0].size > 100 * 1000 * 1000) { 
            alert("File is too big!");
            this.setState({
                fileToBeSentName: ''
            });
            return false;
        };

        this.setState({
            fileToBeSentName: "C:\\fakepath\\" + e.target.files[0].name,
            fileToBeSent: e.target.files[0]
        });

        return true;
    }

    updateUploadOptions(linkMode : boolean, uploadMode : boolean): void {
        const newUploadOptions = { 
            link: linkMode,
            upload: uploadMode
        };

        this.setState({
            uploadOption: newUploadOptions
        });
    }

    radioHit = (e) => {
        const currentUploadOptions = this.state.uploadOption;

        switch(e.target.id) {
        case 'EXTERNAL':
            this.updateUploadOptions(!currentUploadOptions.link, false);
            break;
        case 'INTERNAL':
            this.updateUploadOptions(false, !currentUploadOptions.upload);
            break;
        default:
            console.log("No match for radio button in upload !!!");
            return;
        }
    }

    handleSelectChange = value => {
        this.setState({
            subdomain: value
        });
    }

    handleCreateSelectChange = (newValue: any, actionMeta: any) => {
        console.group('Value Changed');
        console.log(newValue);
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();
        this.setState({
            subdomain: newValue
        });
      };

    handleCreateSelectInputChange = (inputValue: any, actionMeta: any) => {
        console.group('Input Changed');
        console.log(inputValue);
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();
      };
  
    render() {  

      return (
        <Container className="themed-container" fluid={true}>
            <Row lg="12">
                {/* <Title titleSet={this.props.color}/> */}
            </Row>
            <Row md="4">
                
                <LeftBar className='resizable-1050' modeSearch={false}/>
                <Col md={{ size: 3, offset: 0 }}>
                    .
                </Col>
                <Col md={{ size: 9, offset: 0 }}>
                <Card>
                    <CardBody>
                    <CardTitle></CardTitle>
                    <CardSubtitle></CardSubtitle>
                    <CardText>
                    <Form>
                        <FormGroup>
                            <Row>
                                <Col className="display-flex"><span className="padding-right-16">Private</span>
                                <Switch
                                    isOn={this.state.valueSwitch}
                                    onColor="#00FF00"
                                    handleToggle={() => this.changeValue(!this.state.valueSwitch, 'valueSwitch')}
                                />
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row className="padding-top-20">
                                <Col >
                                    <Input 
                                        type="text"
                                        invalid={this.state.validInputs.dataset_title}
                                        name="dataset-title" 
                                        id="Dataset-title" 
                                        placeholder="Dataset title" 
                                        onBlur={e => this.checkForIntegrityOfFields(e.target.value, 'dataset_title')}
                                        onChange={e => this.changeValue(e.target.value, 'dataset_title')}/>
                                </Col>
                                
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row className="padding-top-20">
                                <Col >
                                    <Input 
                                        type="text" 
                                        name="dataset-authors"
                                        id="Dataset-authors" 
                                        placeholder="Dataset authors" 
                                        invalid={this.state.validInputs.dataset_authors}
                                        onBlur={e => this.checkForIntegrityOfFields(e.target.value, 'dataset_authors')}
                                        onChange={e => this.changeValue(e.target.value, 'dataset_authors')}/>
                                    <TooltipButton 
                                        className="padding-top-10"
                                        ButtonName="Show more info" 
                                        body={this.props.authorsTooltip}/>
                                </Col>
                                
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row>
                                <Col >
                                    <Input 
                                        type="text" 
                                        name="article-title" 
                                        id="Article-title" 
                                        placeholder="Article title" 
                                        // invalid={this.state.validInputs.article_title}
                                        // onBlur={e => this.checkForIntegrityOfFields(e.target.value, 'article_title')}
                                        onChange={e => this.changeValue(e.target.value, 'article_title')}/>
                                        <FormText>This field is optional</FormText>
                                </Col>
                                
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row className="padding-top-20">
                                <Col md={{ size: 3, offset: 0 }}>
                                    <Input 
                                        type="number" 
                                        name="year" 
                                        id="year" 
                                        placeholder="Year of the publication" 
                                        invalid={this.state.validInputs.year}
                                        onBlur={e => this.checkForIntegrityOfFields(e.target.value, 'year')}
                                        onChange={e => this.changeValue(e.target.value, 'year')}/>
                                </Col>
                                <Col></Col>
                                
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row className="padding-top-20">
                                <Col className="text-align-left">
                                    <InputText 
                                        nameOfDropdown="country" 
                                        titleDropdown={this.state.country} 
                                        listOfItems={this.state.uploadInputOptions.country} 
                                        changeValue={this.changeValue} 
                                        className="button-style-upload" />
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row className="padding-top-20">
                                <Col className="text-align-left" md="3">
                                    <InputText nameOfDropdown="domain" titleDropdown={this.state.domain} listOfItems={this.state.uploadInputOptions.domain} changeValue={this.changeValue} className="button-style-upload" />
                                </Col>
                                <Col className="text-align-left">
                                    {this.state.shouldEnterNewDomain ? 
                                    <Input type="text" name="newDomain" id="newDomain" placeholder="Enter new domain" 
                                    onChange={e => this.changeValue(e.target.value.toUpperCase(), 'otherDomain')}
                                    /> : <></>}
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row className="padding-top-20">
                                {/* <Col className="text-align-left">
                                    <InputText nameOfDropdown="subdomain" titleDropdown={this.state.subdomain} listOfItems={this.state.uploadInputOptions.subdomain} changeValue={this.changeValue} className="button-style-upload" />
                                </Col> */}
                                <Col>
                                    <CustomCreatableSelect 
                                        options={this.state.uploadInputOptions.subdomain}
                                        value={this.state.subdomain}
                                        handleChange={this.handleCreateSelectChange}
                                        onInputChange={this.handleCreateSelectInputChange}
                                        placeholder="Select tags"
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row className="padding-top-20">
                                <Col>
                                    <Input 
                                        type="textarea" 
                                        name="text" 
                                        maxLength="1000"  
                                        id="description" 
                                        placeholder="Short Description" 
                                        className="margin-top-10" 
                                        invalid={this.state.validInputs.short_desc}
                                        onBlur={e => this.checkForIntegrityOfFields(e.target.value, 'short_desc')}
                                        onChange={e => this.changeValue(e.target.value, 'short_desc')}/>
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row className="padding-top-20">
                                <Col >
                                    <Input type="text" name="gitlink" id="gitlink" placeholder="GitHub link" 
                                        onChange={e => this.changeValue(e.target.value, 'gitlink')}/>
                                    <FormText>This field is optional</FormText>
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row className="padding-top-20">
                                <Col sm="6">
                                    <Card body className={this.state.uploadOption.link ? "selectedUploadCard text-align-center" : "unselectedUploadCard text-align-center"}>
                                        <FormGroup check className="margin-top-5">
                                            <Label check>
                                            <Input 
                                                id="EXTERNAL"
                                                checked={this.state.uploadOption.link}
                                                onClick={this.radioHit}
                                                type="checkbox" 
                                                name="radio2" 
                                                className="margin-top-5" />{' '}
                                            Download link 
                                            </Label>
                                            <>  </><FontAwesomeIcon icon={faLink} />
                                            <Input
                                                type="url"
                                                name="url"
                                                id="downloadURL"
                                                disabled={!this.state.uploadOption.link}
                                                placeholder="Download Link..."
                                                onChange={e => this.changeValue(e.target.value, 'downloadPath')}
                                            />
                                        </FormGroup>
                                    </Card>
                                    </Col>
                                    <Col sm="6">
                                    <Card body className={this.state.uploadOption.upload ? "selectedUploadCard text-align-center" : "unselectedUploadCard text-align-center"}>
                                        <FormGroup check disabled className="margin-top-5">
                                            <Label check>
                                            <Input
                                                id="INTERNAL"
                                                checked={this.state.uploadOption.upload}
                                                onClick={this.radioHit}
                                                type="checkbox" 
                                                name="radio2" 
                                                className="margin-top-5" />{' '}
                                            Upload dataset
                                            </Label>
                                            <>  </><FontAwesomeIcon icon={faDownload} />
                                            <Col >
                                                <Input 
                                                    type="file" 
                                                    disabled={!this.state.uploadOption.upload}
                                                    name="myFile" 
                                                    id="myFile"
                                                    value={this.state.fileToBeSentName}
                                                    onChange={this.uploadFile} />
                                                    <FormText className="text-align-left allowed-type">*{this.state.uploadInputOptions.dataFormats.join(", ")}</FormText>
                                            </Col>
                                        </FormGroup>
                                    </Card>
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row className="padding-top-20">
                                <Col >
                                    <Input 
                                        type="text"
                                        // invalid={this.state.validInputs.dataset_title}
                                        name="Data-integ" 
                                        id="Data-integ" 
                                        placeholder="Data integrity and authenticity" 
                                        // onBlur={e => this.checkForIntegrityOfFields(e.target.value, 'dataset_title')}
                                        onChange={e => this.changeValue(e.target.value, 'dataIntegrity')}
                                        />
                                        <TooltipButton 
                                            body={this.props.dataInteg}
                                            className="padding-top-10"
                                            ButtonName="Show more info" />
                                </Col>
                            </Row>
                            <Row className="padding-top-10">
                                <Col >
                                <Input 
                                        type="text"
                                        // invalid={this.state.validInputs.dataset_title}
                                        name="Cont-access"
                                        id="Cont-access" 
                                        placeholder="Continuity of access" 
                                        // onBlur={e => this.checkForIntegrityOfFields(e.target.value, 'dataset_title')}
                                        onChange={e => this.changeValue(e.target.value, 'contAccess') }
                                        />
                                    <TooltipButton 
                                        body={this.props.contAccess}
                                        className="padding-top-10"
                                        ButtonName="Show more info" />
                                    
                                </Col>                                
                            </Row>
                            <Row className="padding-top-10">
                                <Col >
                                <Input 
                                        type="text"
                                        // invalid={this.state.validInputs.dataset_title}
                                        name="data-reuse"
                                        id="data-reuse" 
                                        placeholder="Data Reuse" 
                                        // onBlur={e => this.checkForIntegrityOfFields(e.target.value, 'dataset_title')}
                                        onChange={e => this.changeValue(e.target.value, 'dataReuse')}
                                        />
                                    <TooltipButton 
                                        body={this.props.dataReuse}
                                        className="padding-top-10"
                                        ButtonName="Show more info" />
                                    
                                </Col>                                
                            </Row>
                        </FormGroup>

                        <FormGroup>
                            <Row className="padding-top-20">
                                <Col className="text-align-center">
                                    {this.state.loaderVisibility ?
                                    <LoaderComponent visible={this.state.loaderVisibility}/> 
                                    :                                    
                                    <Button 
                                    color="primary" 
                                    outline className="upload-button-size" 
                                    disabled={this.state.buttonUpload}
                                    onClick={() => this.handleSubmit()}>
                                        Upload dataset
                                    </Button>
                                    }
                                
                                </Col>
                            </Row>
                        </FormGroup>
                        </Form>

















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





