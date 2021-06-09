import * as React from 'react';

import axios from 'axios';
import { Card, CardText, CardBody, CardTitle, CardSubtitle, Button, Input, Tooltip,
    Row, Col, FormGroup, FormText, Label, Alert } from 'reactstrap';
import "../style_home.scss";
import "./upload.scss";
import {Switch, LoaderComponent, TooltipButton, CustomCreatableSelect} from '../Items/Items-components'
import LeftBar from "../LeftBar/LeftBar";
import { Container } from 'semantic-ui-react';
import { faLink, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
    tooltipOpen: boolean;
    
    responseGetStatus: ResponseStatus;
    formStatus: ResponseStatus;
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
        tooltipOpen: false,
        responseGetStatus: {
			wasError: false,
			wasSuccess: false,
			responseMessage: ""
		},
        formStatus: {
            wasError: false,
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
                currentDatasetMetadata.otherDomain = "Other";
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

    onInvalidSubmit = (event, errors, values) => {
        const translate: MyTranslator = new MyTranslator("Response-codes");
        this.setState({
            formStatus: {
                wasError: errors.length > 0,
                responseMessage: errors.length + " " + translate.useTranslation("UPLOAD_FORM_ERROR")
            }
        });
    }

    handleSubmit = (event, values) => {
        const translate: MyTranslator = new MyTranslator("Response-codes");

        this.setState({
            loaderVisibility: true,
            formStatus: {
                wasError: false,
                responseMessage: ""
            }
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

                axios.post("/dataset/" + datasetId + '/files', formData)
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

    toggleTooltip = () => {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }
  
    render() {  
    const translate: MyTranslator = new MyTranslator("Upload");
    return (
        <Container className="themed-container" fluid={true}>
            <Row lg="12">
                {/* <Title titleSet={this.props.color}/> */}
            </Row>
            <Row>
                
                <LeftBar className='resizable-1050' modeSearch={false}/>
                <Col md={{ size: 2, offset: 0 }}>
                    .
                </Col>
                <Col md="10" lg="11">
                <Card>
                    <CardBody>
                    <CardTitle></CardTitle>
                    <CardSubtitle></CardSubtitle>
                    <CardText>
                    {this.state.shouldRenderForm ? 
                    <AvForm onValidSubmit={this.handleSubmit} onInvalidSubmit={this.onInvalidSubmit}>
                        <FormGroup>
                            <Row>
                                <Col className="display-flex"><span className="padding-right-16">{translate.useTranslation("private")}</span>
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
                                        label={translate.useTranslation("dataset-title-label")}
                                        placeholder={translate.useTranslation("dataset-title-placeholder")}
                                        validate={{
                                            required: {value: true, errorMessage: translate.useTranslation("dataset-title-error-req")},
                                            pattern: {value: '^[A-Za-z0-9- ]+$', errorMessage: translate.useTranslation("dataset-title-error-pattern")},
                                            minLength: {value: 5, errorMessage: translate.useTranslation("dataset-title-error-len")},
                                            maxLength: {value: 500, errorMessage: translate.useTranslation("dataset-title-error-len")}
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
                                        label={translate.useTranslation("dataset-author-label")}
                                        placeholder={translate.useTranslation("dataset-author-placeholder")}
                                        validate={{
                                            required: {value: true, errorMessage: translate.useTranslation("dataset-author-req")},
                                            pattern: {value: '^[A-Za-z0-9; ]+$', errorMessage: translate.useTranslation("dataset-author-pattern")},
                                            minLength: {value: 5, errorMessage: translate.useTranslation("dataset-author-len")},
                                        }}
                                        />
                                    <TooltipButton 
                                        className="padding-top-10"
                                        ButtonName={translate.useTranslation("show-more-info")} 
                                        body={this.props.authorsTooltip}/>
                                </Col>
                                
                            </Row>
                        </AvGroup>
                       <AvGroup>
                            <Row>
                                <Col >
                                    <Label for="article-title">{translate.useTranslation("articol-title-label")}</Label>
                                    <AvInput 
                                        type="text" 
                                        id="article-title"
                                        name="article-title" 
                                        label={translate.useTranslation("articol-title-label")}
                                        placeholder={translate.useTranslation("articol-title-placeholder")}
                                    />
                                    <FormText>{translate.useTranslation("optional")}</FormText>
                                </Col>
                                
                            </Row>
                        </AvGroup>
                         <AvGroup>
                            <Row className="padding-top-20">
                                <Col md={{ size: 3, offset: 0 }}>
                                    <AvField 
                                        type="number" 
                                        name="year" 
                                        label={translate.useTranslation("year-label")}
                                        placeholder={translate.useTranslation("year-placeholder")}
                                        validate={{
                                            required: {value: true, errorMessage: translate.useTranslation("year-error-req")},
                                            date: {format: 'YYYY', errorMessage: translate.useTranslation("year-error-pattern")}
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
                                        label={translate.useTranslation("year-label")} 
                                        required
                                        validate={{
                                            required: {value: true, errorMessage: translate.useTranslation("country-error-req")},
                                        }}>
                                        <option value="">{translate.useTranslation("country-placeholder")}</option>
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
                                        label={translate.useTranslation("domain-label")}
                                        onChange={this.changeAValue}
                                        validate={{
                                            required: {value: true, errorMessage: translate.useTranslation("domain-error-req")},
                                        }}>
                                        <option value="">{translate.useTranslation("domain-placeholder")}</option>
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
                                        label={translate.useTranslation("newdomain-label")}
                                        placeholder={translate.useTranslation("newdomain-placeholder")}
                                        validate={{
                                            required: {value: this.state.shouldEnterNewDomain, errorMessage: translate.useTranslation("newdomain-error-req")},
                                            pattern: {value: '^[A-Za-z0-9- ]+$', errorMessage: translate.useTranslation("newdomain-error-pattern")},
                                            minLength: {value: 2, errorMessage: translate.useTranslation("newdomain-error-len")},
                                            maxLength: {value: 50, errorMessage: translate.useTranslation("newdomain-error-len")}
                                        }}
                                    /> : <></>}
                                </Col>
                            </Row>
                        </AvGroup>
                        <FormGroup>
                            <Row className="padding-top-20">
                                <Col>
                                    <Label for="tags">{translate.useTranslation("tags-label")}</Label>
                                    <CustomCreatableSelect 
                                        id="tags"
                                        options={this.state.uploadInputOptions.tags}
                                        value={this.state.datasetMetadata.tags}
                                        handleChange={this.handleCreateSelectChange}
                                        onInputChange={this.handleCreateSelectInputChange}
                                        placeholder={translate.useTranslation("tags-placeholder")}
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
                                        label={translate.useTranslation("sdesc-label")}
                                        id="description" 
                                        placeholder= {translate.useTranslation("sdesc-placeholder")}
                                        validate={{
                                            required: {value: true, errorMessage: translate.useTranslation("sdesc-req")},
                                            minLength: {value:10, errorMessage: translate.useTranslation("sdesc-len")},
                                            maxLength: {value: 1000, errorMessage: translate.useTranslation("sdesc-len")}
                                        }}
                                    />
                                </Col>
                            </Row>
                        </AvGroup>
                        <AvGroup>
                            <Row className="padding-top-20">
                                <Col >
                                    <Label for="gitlink">{translate.useTranslation("git-label")}</Label>
                                    <AvInput 
                                        type="text" 
                                        id="gitlink"
                                        name="gitlink" 
                                        label={translate.useTranslation("git-label")}
                                        placeholder={translate.useTranslation("git-placeholder")}
                                    />
                                    <FormText>{translate.useTranslation("optional")}</FormText>
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
                                            {translate.useTranslation("download-link-label")}
                                            </Label>
                                            <>  </><FontAwesomeIcon icon={faLink} />
                                            <AvField
                                                type="url"
                                                name="url"
                                                id="downloadURL"
                                                disabled={!this.state.uploadOption.link}
                                                placeholder={translate.useTranslation("download-link-placeholder")}
                                                validate={{
                                                    required: {value: this.state.uploadOption.link, errorMessage: translate.useTranslation("download-link-error-req")},
                                                }}
                                            />
                                        </AvGroup>
                                    </Card>
                                    </Col>
                                    <Col sm="6">
                                    <Card body id="myFileField" className={this.state.uploadOption.upload ? "selectedUploadCard text-align-center" : "unselectedUploadCard text-align-center"}>
                                        <AvGroup check disabled className="margin-top-5">
                                            <Label check>
                                            <Input
                                                id="INTERNAL"
                                                checked={this.state.uploadOption.upload}
                                                onClick={this.radioHit}
                                                type="checkbox" 
                                                name="radio2" 
                                                className="margin-top-5" />{' '}
                                            {translate.useTranslation("upload-internal-label")}
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
                                                    <FormText className="text-align-left allowed-type"></FormText>

                                            </Col>
                                        </AvGroup>
                                        <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="myFileField" toggle={this.toggleTooltip}>
                                            {this.state.uploadInputOptions.dataFormats.join(", ")}
                                        </Tooltip>
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
                                    placeholder= {translate.useTranslation("data-integrity-placeholder")}
                                    label={translate.useTranslation("data-integrity-label")}
                                    validate={{
                                        required: {value: true, errorMessage: translate.useTranslation("data-integrity-error-req")},
                                        minLength: {value: 5, errorMessage: translate.useTranslation("data-integrity-error-len")},
                                        maxLength: {value: 500, errorMessage: translate.useTranslation("data-integrity-error-len")}
                                    }}
                                    />
                                    <TooltipButton 
                                        body={this.props.dataInteg}
                                        className="padding-top-10"
                                        ButtonName={translate.useTranslation("show-more-info")} />
                            </Col>
                        </Row>
                        <Row className="padding-top-10">
                            <Col >
                            <AvField 
                                type="text"
                                label={translate.useTranslation("cont-label")}
                                name="Cont-access"
                                id="Cont-access" 
                                placeholder={translate.useTranslation("cont-placeholder")}
                                validate={{
                                    required: {value: true, errorMessage: translate.useTranslation("cont-error-req")},
                                    minLength: {value: 5, errorMessage: translate.useTranslation("cont-error-len")},
                                    maxLength: {value: 500, errorMessage: translate.useTranslation("cont-error-len")}
                                }}
                                />
                            <TooltipButton 
                                body={this.props.contAccess}
                                className="padding-top-10"
                                ButtonName={translate.useTranslation("show-more-info")} />
                                
                            </Col>                                
                        </Row>
                        <Row className="padding-top-10">
                            <Col >
                            <AvField 
                                type="text"
                                label={translate.useTranslation("data-reuse-label")}
                                name="data-reuse"
                                id="data-reuse" 
                                placeholder={translate.useTranslation("data-reuse-placeholder")}
                                validate={{
                                    required: {value: true, errorMessage: translate.useTranslation("data-reuse-error-req")},
                                    minLength: {value: 5, errorMessage: translate.useTranslation("data-reuse-error-len")},
                                    maxLength: {value: 500, errorMessage: translate.useTranslation("data-reuse-error-len")}
                                }}
                                />
                            <TooltipButton 
                                body={this.props.dataReuse}
                                className="padding-top-10"
                                ButtonName={translate.useTranslation("show-more-info")} />
                                
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
                                        {translate.useTranslation("upload-button")}
                                    </Button>
                                    }
                                
                                </Col>
                            </Row>
                            <Row className={this.state.formStatus.wasError ? "margin-top-20" : "display-none"}>
                                <Col>
                                    <Alert color="danger" className="text-align-center">
                                        {this.state.formStatus.responseMessage}
                                    </Alert>
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
