import './Edit.scss';
import MyTranslator from '../../assets/MyTranslator'
import React from 'react';
import axios from 'axios';

import { CardBody, Row, Col, CardTitle, CardSubtitle, CardText, Card,
    Button, Label, FormGroup, FormText, Alert } from 'reactstrap';
import {Switch, LoaderComponent, TooltipButton, CustomCreatableSelect} from '../../Items/Items-components'
import { ResponseStatus } from '../../models/ResponseStatus'
import { ICustomSelectList } from '../../models/ICustomSelectList'

import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { DatasetMetadataForPost, SelectList, UploadInputOptions } from '../../models/FormItems'

export interface IMetadataEditProps {
	private: boolean;
	id: number;
    domain: string;
    subdomain: Array<string> 
    country: string;
    authors: Array<String>;
    year: string;
    dataset_title: string;
    article_title: string; 
    short_desc: string;
    avg_rating: number;
    gitlink: string;
    dataIntegrity: string;
    continuityAccess: string;
	dataReuse: string;
	switchPage: Function;
}

export interface IMetadataEditState {
    datasetMetadata: DatasetMetadataForPost;
    uploadInputOptions: UploadInputOptions;

    shouldEnterNewDomain: boolean;

    loaderVisibility: boolean;
	shouldRenderForm: boolean;
	responseStatus: ResponseStatus;
	responseGetStatus: ResponseStatus;
}

export default class MetadataEdit extends React.Component<IMetadataEditProps, IMetadataEditState> {
    state: IMetadataEditState = {
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
		responseStatus: {
			wasError: false,
			wasSuccess: false,
			responseMessage: ""
		},
		responseGetStatus: {
			wasError: false,
			wasSuccess: false,
			responseMessage: ""
		},
		shouldRenderForm: true,
		shouldEnterNewDomain: false,
        loaderVisibility: true
    }

    componentDidMount (): void {
		let responseGetStatus: ResponseStatus = {};
		const translate = new MyTranslator("Response-codes");

        this.setState({
            loaderVisibility: true,
			shouldRenderForm: false
        });

		axios.get( 'http://localhost:41338/getDefaultData')
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
			let currentTags: ICustomSelectList[] = [];
			this.props.subdomain.forEach(function(part, index) {
				currentTags.push({label: part, value: part});
			});
			let currentDatasetMetadata: DatasetMetadataForPost = this.state.datasetMetadata;
			let currentUploadInputOptions: UploadInputOptions = this.state.uploadInputOptions;

			currentUploadInputOptions.tags = this.state.uploadInputOptions.tagList[this.props.domain];
			currentDatasetMetadata.dataset_title = this.props.dataset_title;
			currentDatasetMetadata.article_title = this.props.article_title;
			currentDatasetMetadata.dataset_authors = this.props.authors.map((value) => `${value}`).join(';');
			currentDatasetMetadata.short_desc = this.props.short_desc;
			currentDatasetMetadata.gitlink = this.props.gitlink;
			currentDatasetMetadata.dataIntegrity = this.props.dataIntegrity;
			currentDatasetMetadata.contAccess = this.props.continuityAccess;
			currentDatasetMetadata.dataReuse = this.props.dataReuse;
			currentDatasetMetadata.country = this.props.country;
			currentDatasetMetadata.domain = this.props.domain;
			currentDatasetMetadata.year = Number(this.props.year);
			currentDatasetMetadata.valueSwitch = this.props.private;
			currentDatasetMetadata.tags = currentTags;
			currentDatasetMetadata.otherDomain = null;

			this.setState({
				datasetMetadata: currentDatasetMetadata,
				uploadInputOptions: currentUploadInputOptions,
				shouldEnterNewDomain: false,
				loaderVisibility: false,
				shouldRenderForm: responseGetStatus.wasSuccess ? true : false,
				responseGetStatus: responseGetStatus
			});
		});

		///////////// FUNCTIONS ////////////////
		this.changeValue = this.changeValue.bind(this);
		this.changeAValue = this.changeAValue.bind(this);
		this.handleCreateSelectChange = this.handleCreateSelectChange.bind(this);
		this.handleCreateSelectInputChange = this.handleCreateSelectInputChange.bind(this);
		this.switchPageBack = this.switchPageBack.bind(this);
	}
	
	changeAValue (event: any, value: string): void {
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

        console.log("Genesis");
        console.log(this.state);
    }

	changeValue = (e: boolean) => {
        let currentDatasetMetadata: DatasetMetadataForPost = this.state.datasetMetadata;
        currentDatasetMetadata.valueSwitch = e;
        this.setState({
            datasetMetadata: currentDatasetMetadata
        });
        
        console.log("Land of Confusion");
        console.log(this.state);
    }

	handleCreateSelectChange(newValue: Array<SelectList>, actionMeta: any): void {
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

    handleCreateSelectInputChange(inputValue: any, actionMeta: any): void {
        console.group('Input Changed');
        console.log(inputValue);
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();
	};

	switchPageBack(): void {
		this.props.switchPage();
	}
	
	handleSubmit = (event, errors: Array<any>, values) => {
		if (errors.length > 0) {
            return;
        }

		let responseStatus: ResponseStatus = {};
		const translate = new MyTranslator("Response-codes");

        this.setState({
            loaderVisibility: true,
			shouldRenderForm: false
        });
        
        axios.put( 'http://localhost:41338/dataset/' + this.props.id, {
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
					continuityAccess: values['Cont-access']
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
                responseStatus.wasSuccess = true;
                responseStatus.responseMessage = translate.useTranslation("UPDATE_DATASET_SUCCESS");
            } else {
                responseStatus.wasError = true;
                responseStatus.responseMessage = translate.useTranslation(response.data['data']);
            }
		})
		.catch(function (error) {
            console.log(error);
			responseStatus.wasError = true;
			responseStatus.responseMessage = translate.useTranslation("UPDATE_DATASET_ERROR");
		})
		.finally(() => {
            // always executed
			this.setState({
				responseStatus: responseStatus,
				loaderVisibility: false
			});
        });
    }

    render() {  
        const translate = new MyTranslator("Upload");
        return (
			<>
			
			<CardBody>
			{this.state.shouldRenderForm ? <>
				<CardTitle></CardTitle>
				<CardSubtitle></CardSubtitle>
				<CardText>
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
										value={this.state.datasetMetadata.dataset_title}
                                        validate={{
                                            required: {value: true, errorMessage: 'Please enter a name for the dataset'},
                                            pattern: {value: '^[A-Za-z0-9 ]+$', errorMessage: 'Your name must be composed only with letter and numbers'},
                                            minLength: {value: 5, errorMessage: 'Your name must be between 5 and 500 characters'},
                                            maxLength: {value: 500, errorMessage: 'Your name must be between 5 and 500. characters'}
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
										value={this.state.datasetMetadata.dataset_authors}
                                        validate={{
                                            required: {value: true, errorMessage: 'Please enter an author for the dataset'},
                                            pattern: {value: '^[A-Za-z0-9; ]+$', errorMessage: 'Your name must be composed only with letter, numbers and ;'},
                                            minLength: {value: 5, errorMessage: 'This field must have at least 5 characters'},
                                        }}
                                        />
                                    <TooltipButton 
                                        className="padding-top-10"
                                        ButtonName="Show more info" 
                                        body={''}/>
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
										value={this.state.datasetMetadata.article_title}
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
										value={this.state.datasetMetadata.year}
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
										value={this.state.datasetMetadata.country}
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
										value={this.state.datasetMetadata.domain}
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
										value={this.state.datasetMetadata.short_desc}
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
										value={this.state.datasetMetadata.gitlink}
                                    />
                                    <FormText>This field is optional</FormText>
                                </Col>
                            </Row>
                        </AvGroup>
                        <Row className="padding-top-20">
                            <Col >
                                <AvField 
                                    type="text"
                                    name="Data-integ" 
                                    id="Data-integ" 
                                    placeholder="Data integrity and authenticity" 
                                    label="Data integrity and authenticity:" 
									value={this.state.datasetMetadata.dataIntegrity}
                                    validate={{
                                        required: {value: true, errorMessage: 'Please enter information about data integrity and authenticity'},
                                        minLength: {value: 5, errorMessage: 'Your name must be between 5 and 500 characters'},
                                        maxLength: {value: 500, errorMessage: 'Your name must be between 5 and 500. characters'}
                                    }}
                                    />
                                    <TooltipButton 
                                        body={'cc'}
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
								value={this.state.datasetMetadata.contAccess}
                                validate={{
                                    required: {value: true, errorMessage: 'Please enter information about continuity of access'},
                                    minLength: {value: 5, errorMessage: 'Your name must be between 5 and 500 characters'},
                                    maxLength: {value: 500, errorMessage: 'Your name must be between 5 and 500. characters'}
                                }}
                                />
                            <TooltipButton 
                                body={'aa'}
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
								value={this.state.datasetMetadata.dataReuse}
                                validate={{
                                    required: {value: true, errorMessage: 'Please enter information about data Reuse'},
                                    minLength: {value: 5, errorMessage: 'Your name must be between 5 and 500 characters'},
                                    maxLength: {value: 500, errorMessage: 'Your name must be between 5 and 500. characters'}
                                }}
                                />
                            <TooltipButton 
                                body={'bb'}
                                className="padding-top-10"
                                ButtonName="Show more info" />
                                
                            </Col>                                
                        </Row>

                        <AvGroup>
						<Row className="padding-top-20">
							<Col md="3"></Col>
							<Col md="6" className="text-align-center">                                
								<Button 
									color="primary" 
									outline className="upload-button-size">{translate.useTranslation("edit")}</Button>
							</Col>
							<Col md="3" className="text-align-right">
								{/* <a onClick={this.switchPageBack}>{translate.useTranslation("cancel")}</a> */}
							</Col>
						</Row>
                        </AvGroup>
                    </AvForm>
				</CardText>
			{/* END FORM */}
			</> : 
			<>
				<LoaderComponent visible={this.state.loaderVisibility}/>
				<Row className={this.state.responseStatus.wasError ? "" : "display-none"}>
					<Col>
						<Alert color="danger" className="text-align-center">
							{this.state.responseStatus.responseMessage}
						</Alert>
					</Col>
				</Row>

				<Row className={this.state.responseGetStatus.wasError ? "" : "display-none"}>
					<Col>
						<Alert color="danger" className="text-align-center">
							{this.state.responseGetStatus.responseMessage}
						</Alert>
					</Col>
				</Row>

				<Row className={this.state.responseStatus.wasSuccess ? "" : "display-none"}>
					<Col>
						<Alert color="success" className="text-align-center">
							{this.state.responseStatus.responseMessage}
						</Alert>
					</Col>
				</Row>
			</>
			} 
			</CardBody>
			</>
		)
    }
}