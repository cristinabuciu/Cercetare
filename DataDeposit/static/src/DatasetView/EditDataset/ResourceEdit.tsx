import './Edit.scss';
import MyTranslator from '../../assets/MyTranslator'
import React from 'react';
import axios from 'axios';

import { CardBody, Row, Col, CardTitle, CardSubtitle, CardText, Card,
    Button, Input, FormGroup, Alert, Label, FormText } from 'reactstrap';
import { LoaderComponent } from '../../Items/Items-components'
import { faLink, faDownload, faPortrait } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ResourceToDownload } from './Edit-components'
import { ResponseStatus } from '../../models/ResponseStatus'
import { AvField, AvForm } from 'availity-reactstrap-validation';
import { UploadOption } from '../../models/FormItems'

export interface IResourceEditProps {
	id: number;
	switchPage: Function;
	handleDownload: Function;
}

export interface IResourceEditState {
	fileToBeSent: string | Blob;
    currentResource: string;
	loaderVisibility: boolean;
	uploadOption: UploadOption;
	currentOptions: {
        None: boolean;
        External: boolean;
        Internal: boolean;
    };

	shouldRenderForm: boolean;
	responseStatus: ResponseStatus;
	responseGetStatus: ResponseStatus;
	responseGetDefaultDataStatus: ResponseStatus;
	dataFormats: Array<string>;
}

export default class ResourceEdit extends React.Component<IResourceEditProps, IResourceEditState> {
    state: IResourceEditState = {
		fileToBeSent: '',
        currentResource: '',
		loaderVisibility: false,
		uploadOption: {
            none: false,
            link: false,
            upload: false
        },
		currentOptions: {
			None: false,
			External: false,
			Internal: false
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
		responseGetDefaultDataStatus: {
			wasError: false,
			wasSuccess: false,
			responseMessage: ""
		},
		shouldRenderForm: true,
		dataFormats: []
    }

    componentDidMount (): void {
		let responseGetStatus: ResponseStatus = {};
		let responseGetDefaultDataStatus: ResponseStatus = {};
		const translate = new MyTranslator("Response-codes");
		let currentResource = '';
		let currentOptions = {
			None: false,
			External: false,
			Internal: false
		}

		this.setState({
            loaderVisibility: true,
			shouldRenderForm: false
        });

		axios.get( '/dataset/' + this.props.id + '/files')
		.then(response => {
			if (response.data['statusCode'] === 200) {
                responseGetStatus.wasSuccess = true;

				switch(response.data['data']['resourceType']) {
				case 'NONE':
					currentResource = '';
					currentOptions.None = true;
					break;
				case 'EXTERNAL':
					currentResource = response.data['data']['downloadLink'];
					currentOptions.External = true;
					break;
				case 'INTERNAL':
					currentResource = response.data['data']['fileName'];
					currentOptions.Internal = true;
					break;
				}
            } else {
                responseGetStatus.wasError = true;
                responseGetStatus.responseMessage = translate.useTranslation(response.data['data']);
			}
		})
		.catch(function (error) {
			console.log(error);
			responseGetStatus.wasError = true;
			responseGetStatus.responseMessage = translate.useTranslation("GET_RESOURCE_INFO_ERROR");
		})
		.finally( () => {
			// always executed
			let dataFormats: Array<string> = [];
			axios.get( '/getDefaultData')
			.then(response => {
				if (response.data['statusCode'] === 200) {
					responseGetDefaultDataStatus.wasSuccess = true;
					dataFormats = response.data['data'][3];
				} else {
					responseGetDefaultDataStatus.wasError = true;
					responseGetDefaultDataStatus.responseMessage = translate.useTranslation(response.data['data']);
				}
			})
			.catch(function (error) {
				console.log(error);
				responseGetDefaultDataStatus.wasError = true;
				responseGetDefaultDataStatus.responseMessage = translate.useTranslation("GET_DEFAULT_DATA_ERROR");
			})
			.finally( () => {
				// always executed
				this.setState({
					currentResource: currentResource,
					currentOptions: currentOptions,
					shouldRenderForm: responseGetStatus.wasSuccess && responseGetDefaultDataStatus.wasSuccess ? true : false,
					loaderVisibility: false,
					dataFormats: dataFormats,
					responseGetStatus: responseGetStatus,
					responseGetDefaultDataStatus: responseGetDefaultDataStatus
				});
			});
		});

		//////////// FUNCTIONS //////////////
		this.checkForIntegrityOfFields = this.checkForIntegrityOfFields.bind(this);
		this.switchPageBack = this.switchPageBack.bind(this);
		this.radioHit = this.radioHit.bind(this);
		this.updateUploadOptions = this.updateUploadOptions.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
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

	switchPageBack(): void {
		this.props.switchPage();
	}
	
	handleSubmit = (event, errors: Array<any>, values) => {
		if (errors.length > 0) {
			return;
		}
		let responseStatus: ResponseStatus = {};
		const translate: MyTranslator = new MyTranslator("Response-codes");

        this.setState({
            loaderVisibility: true,
			shouldRenderForm: false
        });
		const formData: FormData = new FormData();
		
		if (this.state.uploadOption.none) {
			formData.append("newResourceType", 'NONE');
		} else if (this.state.uploadOption.link) {
			formData.append("newResourceType", 'EXTERNAL');
			formData.append("downloadUrl", values.url);
		} else if (this.state.uploadOption.upload) {
			let file = this.state.fileToBeSent;
			formData.append("newResourceType", 'INTERNAL');
			formData.append("file", file);
		}

		axios.put("/dataset/" + this.props.id + '/files', formData)
		.then(response => {
			if (response.data['statusCode'] === 200) {
                responseStatus.wasSuccess = true;
                responseStatus.responseMessage = translate.useTranslation(response.data['data']);
            } else {
                responseStatus.wasError = true;
                responseStatus.responseMessage = translate.useTranslation(response.data['data']);
            }
		})
		.catch(err => {
			console.warn(err);
			responseStatus.wasSuccess = true;
			responseStatus.responseMessage = translate.useTranslation("UPDATE_DATASET_FILES_ERROR");
		})
		.finally(() => {
			this.setState({
				responseStatus: responseStatus,
				loaderVisibility: false
			});
		});
    }

	updateUploadOptions(privateMode : boolean, linkMode : boolean, uploadMode : boolean): void {
        const newUploadOptions: UploadOption = { 
            none: privateMode,
            link: linkMode,
            upload: uploadMode
        };

        this.setState({
            uploadOption: newUploadOptions
        });
    }

    radioHit(e): void {
		const currentUploadOptions: UploadOption = this.state.uploadOption;

        switch(e.target.id) {
        case 'NONE':
            this.updateUploadOptions(!currentUploadOptions.none, false, false);
            break;
        case 'EXTERNAL':
            this.updateUploadOptions(false, !currentUploadOptions.link, false);
            break;
        case 'INTERNAL':
            this.updateUploadOptions(false, false, !currentUploadOptions.upload);
            break;
        default:
            console.log("No match for radio button in upload !!!");
            return;
        }
    }

	uploadFile(e): void {
        this.setState({
            fileToBeSent: e.target.files[0]
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
				<Row>
					<Col>
						<div className="resource-title margin-top-10">
							{this.state.currentOptions.None ? <></> : 
							<ResourceToDownload
								handleDownload={this.props.handleDownload}
								firstName={"Existing resource: "}
								name={this.state.currentResource} />}
						</div>
					</Col>
				</Row>
				<AvForm onSubmit={this.handleSubmit}>
				<FormGroup>
						<Row className="padding-top-20">
							<Col sm="4">
								<Card body className={this.state.uploadOption.none ? "selectedUploadCard text-align-center" : "unselectedUploadCard text-align-center"}>
									<FormGroup check className="margin-top-5">
										<Label check>
										<Input 
											id="NONE"
											checked={this.state.uploadOption.none}
											type="checkbox"
											name="radio2" 
											onClick={this.radioHit}
											className="margin-top-5" />{' '}
										Delete Resource
										</Label>
										<>  </><FontAwesomeIcon icon={faPortrait} />
									</FormGroup>
								</Card>
							</Col>
							<Col sm="4">
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
										Add External link
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
									</FormGroup>
								</Card>
							</Col>
							<Col sm="4">
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
									Upload another Resource
									</Label>
									<>  </><FontAwesomeIcon icon={faDownload} />
									<Col >
										<Input 
											type="file" 
											disabled={!this.state.uploadOption.upload}
											name="myFile" 
											id="myFile" 
											onChange={this.uploadFile} />
										<FormText className="text-align-left allowed-type">*{this.state.dataFormats.join(", ")}</FormText>
									</Col>
								</FormGroup>
							</Card>
							</Col>
						</Row>
					</FormGroup>
		
					<FormGroup>
						<Row className="padding-top-20">
							<Col md="3"></Col>
							<Col md="6" className="text-align-center">
								{this.state.loaderVisibility ?
								<LoaderComponent visible={this.state.loaderVisibility}/> 
								:                                
								<Button 
								color="primary" 
								outline className="upload-button-size">
									{translate.useTranslation("edit")}
								</Button>
								}
							
							</Col>
							<Col md="3" className="text-align-right">
								{/* <a onClick={this.switchPageBack}>{translate.useTranslation("cancel")}</a> */}
							</Col>
						</Row>
					</FormGroup>
					</AvForm>
				</CardText>
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

				<Row className={this.state.responseGetDefaultDataStatus.wasError ? "" : "display-none"}>
					<Col>
						<Alert color="danger" className="text-align-center">
							{this.state.responseGetDefaultDataStatus.responseMessage}
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
				
				</>}
			</CardBody>
			</>
		)
    }
}