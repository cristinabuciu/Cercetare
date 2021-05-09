import './Edit.scss';
import MyTranslator from '../../assets/MyTranslator'
import React from 'react';
import axios from 'axios';

import { CardBody, Row, Col, CardTitle, CardSubtitle, CardText, Card,
    Button, Input, Form, FormGroup, FormText, Alert } from 'reactstrap';
import {InputText, Switch, LoaderComponent, TooltipButton, CustomCreatableSelect} from '../../Items/Items-components'
import { ResponseStatus } from '../../models/ResponseStatus'
import { ICustomSelectList } from '../../models/ICustomSelectList'

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
    fileToBeSent: string | Blob;
    buttonDropDownStatus: boolean;
    startDate: Date;
    dataset_title: string;
    article_title: string;
    short_desc: string;
    dataset_authors: string;
    year: number;
    domain: string;
    otherDomain: string | null;
    subdomain: ICustomSelectList[];
    country: string;
    valueSwitch: boolean;
    gitlink: string;
    uploadInputOptions: {
        domain: Array<string>;
        subdomain: Array<string>;
        country: Array<string>;
    };
    shouldEnterNewDomain: boolean;
    uploadOption: {
        private: boolean;
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

	shouldRenderForm: boolean;
	responseStatus: ResponseStatus;
	responseGetStatus: ResponseStatus;
}

export default class MetadataEdit extends React.Component<IMetadataEditProps, IMetadataEditState> {
    state = {
        fileToBeSent: '',
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
        subdomain: [{label: "", value: ""}],
        dataReuse: '',
        contAccess: '',
        dataIntegrity: '',
        downloadPath: '',

        uploadInputOptions: {
            domain: [],
            subdomain: [],
            subdomainList: {},
            country: []
        },
        shouldEnterNewDomain: false,
        uploadOption: {
            private: false,
            link: false,
            upload: false
        },

        validInputs: {
            dataset_title: false,
            dataset_authors: false,
            year: false,
            short_desc: false
        },
        buttonUpload: false,
        loaderVisibility: true,

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
		shouldRenderForm: true
    }

    componentDidMount (): void {
		let responseGetStatus: ResponseStatus = {};
		const translate = new MyTranslator("Response-codes");

        this.setState({
            loaderVisibility: true,
			shouldRenderForm: false
        });

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
			debugger;
			this.props.subdomain.forEach(function(part, index) {
				currentTags.push({label: part, value: part});
			});
			this.setState({
				dataset_title: this.props.dataset_title,
				article_title: this.props.article_title,
				dataset_authors: this.props.authors.map((value) => `${value}`).join(';'),
				short_desc: this.props.short_desc,
				gitlink: this.props.gitlink,
				dataIntegrity: this.props.dataIntegrity,
				contAccess: this.props.continuityAccess,
				dataReuse: this.props.dataReuse,
				country: this.props.country,
				domain: this.props.domain,
				year: Number(this.props.year),
				valueSwitch: this.props.private,
				subdomain: currentTags,
				shouldEnterNewDomain: false,
				otherDomain: null,
				loaderVisibility: false,
				shouldRenderForm: responseGetStatus.wasSuccess ? true : false,
				responseGetStatus: responseGetStatus
			});

			this.state.uploadInputOptions.subdomain = this.state.uploadInputOptions.subdomainList[this.props.domain];

			this.forceUpdate();
		});

		///////////// FUNCTIONS ////////////////
		this.changeValue = this.changeValue.bind(this);
		this.checkForIntegrityOfFields = this.checkForIntegrityOfFields.bind(this);
		this.handleCreateSelectChange = this.handleCreateSelectChange.bind(this);
		this.handleCreateSelectInputChange = this.handleCreateSelectInputChange.bind(this);
		this.switchPageBack = this.switchPageBack.bind(this);
	}
	
	changeValue (e: any, comboBoxTitle: string, shouldUpdate: boolean = false): void {
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
    }

    checkForIntegrityOfFields(value: string, field: string): void {
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

	handleCreateSelectChange(newValue: any, actionMeta: any): void {
        console.group('Value Changed');
        console.log(newValue);
        console.log(`action: ${actionMeta.action}`);
		console.groupEnd();

        this.setState({
            subdomain: newValue
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
	
	handleSubmit(): void {
		let responseStatus: ResponseStatus = {};
		const translate = new MyTranslator("Response-codes");

        this.setState({
            loaderVisibility: true,
			shouldRenderForm: false
        });
        
        axios.put( '/dataset/' + this.props.id, {
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
									placeholder={translate.useTranslation("dataset_title")}
									value={this.state.dataset_title}
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
									placeholder={translate.useTranslation("dataset_authors")}
									value={this.state.dataset_authors}
									invalid={this.state.validInputs.dataset_authors}
									onBlur={e => this.checkForIntegrityOfFields(e.target.value, 'dataset_authors')}
									onChange={e => this.changeValue(e.target.value, 'dataset_authors')}/>
								<TooltipButton 
									className="padding-top-10"
									ButtonName="Show more info" 
									body={''}/>
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
									placeholder={translate.useTranslation("article_title")}
									value={this.state.article_title}
									// invalid={this.state.validInputs.article_title}
									// onBlur={e => this.checkForIntegrityOfFields(e.target.value, 'article_title')}
									onChange={e => this.changeValue(e.target.value, 'article_title')}/>
									<FormText>{translate.useTranslation("optional")}</FormText>
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
									placeholder={translate.useTranslation("year")}
									invalid={this.state.validInputs.year}
									value={this.state.year}
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
							<Col>
								<CustomCreatableSelect 
									options={this.state.uploadInputOptions.subdomain}
									value={this.state.subdomain}
									handleChange={this.handleCreateSelectChange}
									onInputChange={this.handleCreateSelectInputChange}
									placeholder={translate.useTranslation("tags")}
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
									placeholder={translate.useTranslation("description")}
									className="margin-top-10" 
									value={this.state.short_desc}
									invalid={this.state.validInputs.short_desc}
									onBlur={e => this.checkForIntegrityOfFields(e.target.value, 'short_desc')}
									onChange={e => this.changeValue(e.target.value, 'short_desc')}/>
							</Col>
						</Row>
					</FormGroup>
					<FormGroup>
						<Row className="padding-top-20">
							<Col >
								<Input type="text" name="gitlink" id="gitlink" placeholder="GitHub link" value={this.state.gitlink}
									onChange={e => this.changeValue(e.target.value, 'gitlink')}/>
								<FormText>{translate.useTranslation("optional")}</FormText>
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
									placeholder={translate.useTranslation("data_integrity")}
									value={this.state.dataIntegrity}
									// onBlur={e => this.checkForIntegrityOfFields(e.target.value, 'dataset_title')}
									onChange={e => this.changeValue(e.target.value, 'dataIntegrity')}
									/>
									<TooltipButton 
										body={'a'}
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
									placeholder={translate.useTranslation("access")}
									value={this.state.contAccess}
									// onBlur={e => this.checkForIntegrityOfFields(e.target.value, 'dataset_title')}
									onChange={e => this.changeValue(e.target.value, 'contAccess') }
									/>
								<TooltipButton 
									body={translate.useTranslation("access-info")}
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
									placeholder={translate.useTranslation("reuse")}
									value={this.state.dataReuse}
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
							<Col md="3"></Col>
							<Col md="6" className="text-align-center">                                
								<Button 
									color="primary" 
									outline className="upload-button-size" 
									disabled={this.state.buttonUpload}
									onClick={() => this.handleSubmit()}>{translate.useTranslation("edit")}</Button>
							</Col>
							<Col md="3" className="text-align-right">
								{/* <a onClick={this.switchPageBack}>{translate.useTranslation("cancel")}</a> */}
							</Col>
						</Row>
					</FormGroup>
					</Form>
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