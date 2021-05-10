import * as React from 'react';

import axios from 'axios';
import {
    Card, CardText, CardBody, CardTitle, CardSubtitle, Button, Input, Row, Col, FormGroup, FormText, Label, Alert
  } from 'reactstrap';
import "../style_home.scss";
import "./upload.scss";
import {Switch, LoaderComponent, TooltipButton, CustomCreatableSelect} from '../Items/Items-components'
import LeftBar from "../LeftBar/LeftBar";
import { Container } from 'semantic-ui-react';
import { faLink, faDownload, faPortrait } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Title } from '../Items/Title/Title';
import MyTranslator from '../assets/MyTranslator'
import { ResponseStatus } from '../models/ResponseStatus'
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { DatasetMetadataForPost, SelectList, UploadInputOptions, UploadOption } from '../models/FormItems'
 
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
    datasetMetadata: DatasetMetadataForPost;
    uploadInputOptions: UploadInputOptions;
    uploadOption: UploadOption;

    shouldEnterNewDomain: boolean;
    loaderVisibility: boolean;
    shouldRenderForm: boolean;
    
    responseGetStatus: ResponseStatus;
}

export default class UploadPageForm extends React.Component<IUploadPageFormProps, IUploadPageFormState> {

    state: IUploadPageFormState = {
        fileToBeSent: '',
        fileToBeSentName: '',
        datasetMetadata: {
            dataset_title: '',
            article_title: '',
            short_desc: '',
            dataset_authors: '',
            year: 0,
            domain: '',
            otherDomain: null,
            tags: [],
            country: '',
            valueSwitch: false,
            gitlink: '',
            downloadPath: '',
            dataReuse: '',
            contAccess: '',
            dataIntegrity: ''
        },

        uploadInputOptions: {
            domain: [],
            tags: [],
            tagList: {},
            country: [],
            dataFormats: []
        },
        shouldEnterNewDomain: false,
        uploadOption: {
            link: false,
            upload: false
        },

        loaderVisibility: false,
        shouldRenderForm: true,
        responseGetStatus: {
			wasError: false,
			wasSuccess: false,
			responseMessage: ""
		}
    }

    componentDidMount(): void {
        let responseGetStatus: ResponseStatus = {};
		const translate: MyTranslator = new MyTranslator("Response-codes");

        // Domains, Tags, Countries
        axios.get( '/getDefaultData')
        .then(response => {
            if (response.data['statusCode'] === 200) {
                responseGetStatus.wasSuccess = true;
                let domains = response.data['data'][0].concat("Other");
                this.state.uploadInputOptions.domain = domains;
                for(var domain in response.data['data'][1]) {
                    if(domain in this.state.uploadInputOptions.tagList) {
                        this.state.uploadInputOptions.tagList[domain].concat(response.data['data'][1][domain]);
                    } else {
                        this.state.uploadInputOptions.tagList[domain] = response.data['data'][1][domain];
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
            this.setState({
                shouldRenderForm: responseGetStatus.wasError ? false : true,
                responseGetStatus: responseGetStatus
            });
            this.forceUpdate();
        });
        
        /////////// FUNCTIONS /////////////
        this.updateUploadOptions = this.updateUploadOptions.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.changeAValue = this.changeAValue.bind(this);
    }

    changeAValue(event: any, value: string): void {
        if(event.target.name === 'domain') {
            let currentUploadInputOptions: UploadInputOptions = this.state.uploadInputOptions;
            let currentDatasetMetadata: DatasetMetadataForPost = this.state.datasetMetadata;
            currentUploadInputOptions.tags = [];
            currentDatasetMetadata.tags = [];

            if (value === 'Other') {
                this.setState({ 
                    shouldEnterNewDomain: true
                });
            }
            else {
                currentUploadInputOptions.tags = this.state.uploadInputOptions.tagList[value] ? this.state.uploadInputOptions.tagList[value] : [];
                currentDatasetMetadata.otherDomain = null;
                this.setState({ 
                    shouldEnterNewDomain: false
                });
            }

            this.setState({
                datasetMetadata: currentDatasetMetadata,
                uploadInputOptions: currentUploadInputOptions
            });
        }

        console.log("Roxen");
        console.log(this.state);
    }

    changeValue = (e: boolean) => {
        let currentDatasetMetadata: DatasetMetadataForPost = this.state.datasetMetadata;
        currentDatasetMetadata.valueSwitch = e;
        this.setState({
            datasetMetadata: currentDatasetMetadata
        });
        
        console.log("TROOPER");
        console.log(this.state);
    }

    handleSubmit = (event, erros: Array<any>, values) => {
        if (erros.length > 0) {
            return;
        }

        const translate: MyTranslator = new MyTranslator("Response-codes");
        this.setState({
            loaderVisibility: true
        });

        let hasErrorOnMetadata: boolean = false;
        let errorMessage: string = "";
        let hasErrorOnFiles: boolean = false;
        let datasetId: number = -1;
        const formData: FormData = new FormData();

        axios.post( '/datasets', {
            params: {
              	notArrayParams: {
                    domain: this.state.datasetMetadata.otherDomain ? values.newDomain : values.domain,
                    country: values.country,
                    year: values.year,
                    dataset_title: values['dataset-title'],
                    article_title: values['article-title'],
                    short_desc: values.text,
                    gitlink: values.gitlink,
                    full_desc: '...',
                    dataReuse: values['data-reuse'],
                    dataIntegrity: values['Data-integ'],
                    continuityAccess: values['Cont-access'],
                    downloadPath: values.url,
                },
                arrayParams: {
                    tags: this.state.datasetMetadata.tags,
                    authors: values['dataset-authors'].split(", ")
                },
                private: this.state.datasetMetadata.valueSwitch
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
        const newUploadOptions: UploadOption = { 
            link: linkMode,
            upload: uploadMode
        };

        this.setState({
            uploadOption: newUploadOptions
        });
    }

    radioHit = (e) => {
        const currentUploadOptions: UploadOption = this.state.uploadOption;

        switch(e.target.id) {
        case 'EXTERNAL':
            this.updateUploadOptions(!currentUploadOptions.link, false);
            break;
        case 'INTERNAL':
            this.updateUploadOptions(false, !currentUploadOptions.upload);
            break;
        default:
            console.log("Boris");
            console.log("No match for radio button in upload !!!");
            return;
        }
    }

    handleSelectChange = value => {
        let currentDatasetMetadata: DatasetMetadataForPost = this.state.datasetMetadata;
        currentDatasetMetadata.tags = value;

        this.setState({
            datasetMetadata: currentDatasetMetadata
        });
    }

    handleCreateSelectChange = (newValue: Array<SelectList>, actionMeta: any) => {
        console.group('Value Changed');
        console.log(newValue);
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();

        let currentDatasetMetadata: DatasetMetadataForPost = this.state.datasetMetadata;
        currentDatasetMetadata.tags = newValue;
        this.setState({
            datasetMetadata: currentDatasetMetadata
        });
      };

    handleCreateSelectInputChange = (inputValue: any, actionMeta: any) => {
        console.group('Input Changed');
        console.log(inputValue);
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();
    };
  
    render() {  
    const translate: MyTranslator = new MyTranslator("Upload");
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
                    {this.state.shouldRenderForm ? 
                    <AvForm onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Row>
                                <Col className="display-flex"><span className="padding-right-16">Private</span>
                                <Switch
                                    isOn={this.state.datasetMetadata.valueSwitch}
                                    onColor="#00FF00"
                                    handleToggle={() => this.changeValue(!this.state.datasetMetadata.valueSwitch)}
                                />
                                </Col>
                            </Row>
                        </FormGroup>
                        <AvGroup>
                            <Row className="padding-top-20">
                                <Col >
                                    <AvField 
                                        type="text"
                                        name="dataset-title" 
                                        label="Dataset title:" 
                                        placeholder="Dataset title"
                                        validate={{
                                            required: {value: true, errorMessage: 'Please enter a name for the dataset'},
                                            pattern: {value: '^[A-Za-z0-9 ]+$', errorMessage: 'Your name must be composed only with letter and numbers'},
                                            minLength: {value: 5, errorMessage: 'Your name must be between 5 and 50 characters'},
                                            maxLength: {value: 50, errorMessage: 'Your name must be between 5 and 5. characters'}
                                          }}
                                        />
                                </Col>
                                
                            </Row>
                        </AvGroup>
                         <AvGroup>
                            <Row className="padding-top-20">
                                <Col >
                                    <AvField 
                                        type="text" 
                                        name="dataset-authors"
                                        label="Authors:" 
                                        placeholder="Dataset authors" 
                                        validate={{
                                            required: {value: true, errorMessage: 'Please enter an author for the dataset'},
                                            pattern: {value: '^[A-Za-z0-9; ]+$', errorMessage: 'Your name must be composed only with letter, numbers and ;'},
                                            minLength: {value: 5, errorMessage: 'This field must have at least 5 characters'},
                                        }}
                                        />
                                    <TooltipButton 
                                        className="padding-top-10"
                                        ButtonName="Show more info" 
                                        body={this.props.authorsTooltip}/>
                                </Col>
                                
                            </Row>
                        </AvGroup>
                       <AvGroup>
                            <Row>
                                <Col >
                                    <Label for="article-title">Article title:</Label>
                                    <AvInput 
                                        type="text" 
                                        id="article-title"
                                        name="article-title" 
                                        label="Article title:" 
                                        placeholder="Article title"
                                    />
                                    <FormText>This field is optional</FormText>
                                </Col>
                                
                            </Row>
                        </AvGroup>
                         <AvGroup>
                            <Row className="padding-top-20">
                                <Col md={{ size: 3, offset: 0 }}>
                                    <AvField 
                                        type="number" 
                                        name="year" 
                                        label="Year:" 
                                        placeholder="Year of the publication" 
                                        validate={{
                                            required: {value: true, errorMessage: 'Please enter a year for the dataset'},
                                            date: {format: 'YYYY', errorMessage: 'Please enter a valid year for the dataset'}
                                        }} 
                                        title="Use YYYY"
                                    />
                                </Col>
                                <Col></Col>
                                
                            </Row>
                        </AvGroup>
                        <AvGroup>
                            <Row className="padding-top-20">
                                <Col className="text-align-left" md="3">
                                    <AvField
                                        type="select" 
                                        name="country" 
                                        label="Select a country" 
                                        required
                                        validate={{
                                            required: {value: true, errorMessage: 'Please select a country'},
                                        }}>
                                        <option value="">Select Country</option>
                                        {
                                            this.state.uploadInputOptions.country.map((item: string) => {
                                                return (<option value={item}>{item}</option>)
                                            })
                                        }
                                    </AvField>

                                </Col>
                                <Col ></Col>
                            </Row>
                        </AvGroup>
                        <AvGroup>
                            <Row className="padding-top-20 align-start">
                                <Col className="text-align-left" md="3">
                                    <AvField
                                        type="select" 
                                        name="domain" 
                                        label="Select a Domain" 
                                        onChange={this.changeAValue}
                                        validate={{
                                            required: {value: true, errorMessage: 'Please select a domain for the dataset'},
                                        }}>
                                        <option value="">Select Domain</option>
                                        {
                                            this.state.uploadInputOptions.domain.map((item: string) => {
                                                return (<option value={item}>{item}</option>)
                                            })
                                        }
                                    </AvField>
                                </Col>
                                <Col className="text-align-left">
                                    {this.state.shouldEnterNewDomain ? 
                                    <AvField 
                                        type="text" 
                                        name="newDomain" 
                                        id="newDomain" 
                                        label="Enter new domain:" 
                                        placeholder="Enter new domain" 
                                        validate={{
                                            required: {value: this.state.shouldEnterNewDomain, errorMessage: 'Please enter a new domain for the dataset'},
                                            pattern: {value: '^[A-Za-z0-9 ]+$', errorMessage: 'Your name must be composed only with letter and numbers'},
                                            minLength: {value: 5, errorMessage: 'Your name must be between 5 and 50 characters'},
                                            maxLength: {value: 50, errorMessage: 'Your name must be between 5 and 5. characters'}
                                        }}
                                    /> : <></>}
                                </Col>
                            </Row>
                        </AvGroup>
                        <FormGroup>
                            <Row className="padding-top-20">
                                <Col>
                                    <Label for="tags">Select tags:</Label>
                                    <CustomCreatableSelect 
                                        id="tags"
                                        options={this.state.uploadInputOptions.tags}
                                        value={this.state.datasetMetadata.tags}
                                        handleChange={this.handleCreateSelectChange}
                                        onInputChange={this.handleCreateSelectInputChange}
                                        placeholder="Select tags"
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                        <AvGroup>
                            <Row className="padding-top-20">
                                <Col className="margin-top-10" >
                                    <AvField 
                                        type="textarea" 
                                        name="text" 
                                        maxLength="1000"  
                                        label="Short Description:"
                                        id="description" 
                                        placeholder="Please enter a short description..." 
                                        validate={{
                                            required: {value: true, errorMessage: 'Please enter a short description'},
                                            minLength: {value:10, errorMessage: 'Your name must be between 10 and 1000 characters'},
                                            maxLength: {value: 1000, errorMessage: 'Your name must be between 10 and 1000. characters'}
                                        }}
                                    />
                                </Col>
                            </Row>
                        </AvGroup>
                        <AvGroup>
                            <Row className="padding-top-20">
                                <Col >
                                    <Label for="gitlink">GitHub link:</Label>
                                    <AvInput 
                                        type="text" 
                                        id="gitlink"
                                        name="gitlink" 
                                        label="GitHub link:" 
                                        placeholder="GitHub link"
                                    />
                                    <FormText>This field is optional</FormText>
                                </Col>
                            </Row>
                        </AvGroup>
                        <FormGroup>
                            <Row className="padding-top-20">
                                <Col sm="6">
                                    <Card body className={this.state.uploadOption.link ? "selectedUploadCard text-align-center" : "unselectedUploadCard text-align-center"}>
                                        <AvGroup check className="margin-top-5">
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
                                            <AvField
                                                type="url"
                                                name="url"
                                                id="downloadURL"
                                                disabled={!this.state.uploadOption.link}
                                                placeholder="Download Link..."
                                                validate={{
                                                    required: {value: this.state.uploadOption.link, errorMessage: 'Please enter an external url'},
                                                }}
                                            />
                                        </AvGroup>
                                    </Card>
                                    </Col>
                                    <Col sm="6">
                                    <Card body className={this.state.uploadOption.upload ? "selectedUploadCard text-align-center" : "unselectedUploadCard text-align-center"}>
                                        <AvGroup check disabled className="margin-top-5">
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
                                        </AvGroup>
                                    </Card>
                                </Col>
                            </Row>
                        </FormGroup>
                        <Row className="padding-top-20">
                            <Col >
                                <AvField 
                                    type="text"
                                    name="Data-integ" 
                                    id="Data-integ" 
                                    placeholder="Data integrity and authenticity" 
                                    label="Data integrity and authenticity:" 
                                    validate={{
                                        required: {value: true, errorMessage: 'Please enter information about data integrity and authenticity'},
                                        minLength: {value: 5, errorMessage: 'Your name must be between 5 and 500 characters'},
                                        maxLength: {value: 500, errorMessage: 'Your name must be between 5 and 500. characters'}
                                    }}
                                    />
                                    <TooltipButton 
                                        body={this.props.dataInteg}
                                        className="padding-top-10"
                                        ButtonName="Show more info" />
                            </Col>
                        </Row>
                        <Row className="padding-top-10">
                            <Col >
                            <AvField 
                                type="text"
                                label="Continuity of access:" 
                                name="Cont-access"
                                id="Cont-access" 
                                placeholder="Continuity of access" 
                                validate={{
                                    required: {value: true, errorMessage: 'Please enter information about continuity of access'},
                                    minLength: {value: 5, errorMessage: 'Your name must be between 5 and 500 characters'},
                                    maxLength: {value: 500, errorMessage: 'Your name must be between 5 and 500. characters'}
                                }}
                                />
                            <TooltipButton 
                                body={this.props.contAccess}
                                className="padding-top-10"
                                ButtonName="Show more info" />
                                
                            </Col>                                
                        </Row>
                        <Row className="padding-top-10">
                            <Col >
                            <AvField 
                                type="text"
                                label="Data Reuse:"
                                name="data-reuse"
                                id="data-reuse" 
                                placeholder="Data Reuse" 
                                validate={{
                                    required: {value: true, errorMessage: 'Please enter information about data Reuse'},
                                    minLength: {value: 5, errorMessage: 'Your name must be between 5 and 500 characters'},
                                    maxLength: {value: 500, errorMessage: 'Your name must be between 5 and 500. characters'}
                                }}
                                />
                            <TooltipButton 
                                body={this.props.dataReuse}
                                className="padding-top-10"
                                ButtonName="Show more info" />
                                
                            </Col>                                
                        </Row>

                        <AvGroup>
                            <Row className="padding-top-20">
                                <Col className="text-align-center">
                                    {this.state.loaderVisibility ?
                                    <LoaderComponent visible={this.state.loaderVisibility}/> 
                                    :                                    
                                    <Button 
                                        color="primary" 
                                        outline className="upload-button-size"
                                        type="submit"
                                    >
                                        Upload dataset
                                    </Button>
                                    }
                                
                                </Col>
                            </Row>
                        </AvGroup>
                    </AvForm>
                    : 
                    <Row className={this.state.responseGetStatus.wasError ? "" : "display-none"}>
                        <Col>
                            <Alert color="danger" className="text-align-center">
                                {this.state.responseGetStatus.responseMessage}
                            </Alert>
                        </Col>
                    </Row>
                    }
                    </CardText>
                    </CardBody>
                </Card>
                </Col>
            </Row>
    </Container>
      )
    }

}





