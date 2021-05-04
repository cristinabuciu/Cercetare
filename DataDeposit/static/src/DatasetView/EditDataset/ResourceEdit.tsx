import './Edit.scss';
import MyTranslator from '../../assets/MyTranslator'
import React from 'react';
import axios from 'axios';

import { CardBody, Row, Col, CardTitle, CardSubtitle, CardText, Card,
    Button, Input, Form, FormGroup, FormText, Label } from 'reactstrap';
import {InputText, Switch, LoaderComponent } from '../../Items/Items-components'
import { faLink, faDownload, faPortrait } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ResourceToDownload } from './Edit-components'

export interface IMetadataEditProps {
	id: number;
	switchPage: Function;
	handleDownload: Function;
}

export interface IMetadataEditState {
	fileToBeSent: string | Blob;
    currentResource: string;
	loaderVisibility: boolean;
	uploadOption: {
        private: boolean;
        link: boolean;
        upload: boolean;
    };
	currentOptions: {
        None: boolean;
        External: boolean;
        Internal: boolean;
    };
	newDownloadPath: string;
}

export default class MetadataEdit extends React.Component<IMetadataEditProps, IMetadataEditState> {
    state: IMetadataEditState = {
		fileToBeSent: '',
        currentResource: '',
		loaderVisibility: false,
		uploadOption: {
            private: false,
            link: false,
            upload: false
        },
		currentOptions: {
			None: false,
			External: false,
			Internal: false
		},
		newDownloadPath: ''
    }

    componentDidMount (): void {
		axios.get( '/dataset/' + this.props.id + '/files')
		.then(response => {
			let currentResource = '';
			let currentOptions = {
				None: false,
				External: false,
				Internal: false
			}

			switch(response.data['resourceType']) {
			case 'NONE':
				currentResource = '';
				currentOptions.None = true;
				break;
			case 'EXTERNAL':
				currentResource = response.data['downloadLink'];
				currentOptions.External = true;
				break;
			case 'INTERNAL':
				currentResource = response.data['fileName'];
				currentOptions.Internal = true;
				break;
			}

			this.setState({
				currentResource: currentResource,
				currentOptions: currentOptions
			});
		})
		.catch(function (error) {
			console.log(error);
		})
		.finally( () => {
			// always executed
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
	
	handleSubmit(): void {
        // this.setState({
        //     loaderVisibility: true
        // });
		let hasError: boolean = false;
		const formData = new FormData();
		
		if (this.state.uploadOption.private) {
			formData.append("newResourceType", 'NONE');
		} else if (this.state.uploadOption.link) {
			formData.append("newResourceType", 'EXTERNAL');
			formData.append("downloadUrl", this.state.newDownloadPath);
		} else if (this.state.uploadOption.upload) {
			let file = this.state.fileToBeSent;
			formData.append("newResourceType", 'INTERNAL');
			formData.append("file", file);
		}

		axios.put("/dataset/" + this.props.id + '/files', formData)
		.then(response => {
			if (response.data === 'UPDATE_DATASET_FILES_ERROR') {
				hasError = true;
			} else {
				hasError = false;
			}
		})
		.catch(err => {
			console.warn(err);
			hasError = true;
		})
		.finally(() => {});
    }

	updateUploadOptions(privateMode : boolean, linkMode : boolean, uploadMode : boolean): void {
        const newUploadOptions = { 
            private: privateMode,
            link: linkMode,
            upload: uploadMode
        };

        this.setState({
            uploadOption: newUploadOptions
        });
    }

    radioHit(e): void {
		const currentUploadOptions = this.state.uploadOption;

        switch(e.target.id) {
        case 'NONE':
            this.updateUploadOptions(!currentUploadOptions.private, false, false);
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
			{this.state.loaderVisibility ? <LoaderComponent visible={this.state.loaderVisibility}/> :
			<CardBody>
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
				<Form>
				<FormGroup>
						<Row className="padding-top-20">
							<Col sm="4">
								<Card body className={this.state.uploadOption.private ? "selectedUploadCard text-align-center" : "unselectedUploadCard text-align-center"}>
									<FormGroup check className="margin-top-5">
										<Label check>
										<Input 
											id="NONE"
											checked={this.state.uploadOption.private}
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
										<Input
											type="url"
											name="url"
											id="downloadURL"
											disabled={!this.state.uploadOption.link}
											placeholder="Download Link..."
											onChange={e => this.setState({newDownloadPath: e.target.value})}
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
								outline className="upload-button-size" 
								onClick={() => this.handleSubmit()}>
									{translate.useTranslation("edit")}
								</Button>
								}
							
							</Col>
							<Col md="3" className="text-align-right">
								{/* <a onClick={this.switchPageBack}>{translate.useTranslation("cancel")}</a> */}
							</Col>
						</Row>
					</FormGroup>
					</Form>
				</CardText>
			
			</CardBody>
			}
			</>
		)
    }
}