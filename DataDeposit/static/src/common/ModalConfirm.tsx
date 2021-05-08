import React from 'react';
import { Button, DropdownToggle, DropdownMenu, DropdownItem, Collapse, Card, CardBody,
  ModalHeader, ModalBody, ModalFooter, Row, Col, Input, Alert,
  TabContent, TabPane, Nav, NavItem, CardTitle, CardText, Modal } from 'reactstrap';
import { NavLink } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import "./commonElems.scss";
import MyTranslator from '../assets/MyTranslator'
import { DeleteMessageItem } from '../models/DeleteMessageItem'
import { LoaderComponent } from '../Items/Items-components'

export interface IModalConfirmProps {
	idToBeConfirmed: number;
	buttonLabel: any;
	buttonClassName: string;
	modalTitle: string;
	handleConfirm?: Function;
	modalBody: string;
	modalSubtitle: string;

	successCallback?: Function;
}


export interface IModalConfirmState {
	disabledDeleteButton: boolean;
	modal: boolean;

	wasError: boolean;
	message: string;
	wasInfo: boolean;
	wasSuccess: boolean;
	loaderVisibility: boolean;
}

export default class ModalConfirm extends React.Component<IModalConfirmProps, IModalConfirmState> {

	state: IModalConfirmState = {
		disabledDeleteButton: false,
		modal: false,
		wasError: false,
		message: "Error",
		wasInfo: false,
		wasSuccess: false,
		loaderVisibility: false
	}

	componentDidMount(): void {

		////////////// FUNCTIONS ////////////////
		this.toggle = this.toggle.bind(this);
		this.toggleConfirm = this.toggleConfirm.bind(this);
	}
  
	toggle(): void {
		const wasSuccess: boolean = this.state.wasSuccess;
		this.setState({
			modal: !this.state.modal,
			disabledDeleteButton: false,
			wasError: false,
			wasInfo: false,
			wasSuccess: false
		});
		wasSuccess ? this.props.successCallback ? this.props.successCallback() : "" : "";
	}
	
	toggleConfirm(): void {
		this.setState({
			disabledDeleteButton: true,
			loaderVisibility: true
		});

		const response: Promise<DeleteMessageItem> = this.props.handleConfirm ? this.props.handleConfirm(this.props.idToBeConfirmed) : {"wasError": true, "message": "Error"};

		response.then( (res: DeleteMessageItem) =>
			this.setState({
				loaderVisibility: false,
				disabledDeleteButton: true,
				wasError: res.wasError ? res.wasError : false,
				wasInfo: res.wasInfo ? res.wasInfo : false,
				wasSuccess: res.wasSuccess ? res.wasSuccess : false,
				message: res['message'] ? res['message'] : "-"
			})
		);
	};

    render() {
		const translate = new MyTranslator("ModalConfirm");

		// Dupa ce se apasa pe Delete -> apare response de succes -> cautarea veche dispare -> apare loading bar -> se face apel pentru o noua cautare -> afisez noul rezultat
	return (
		<div>
			<Button 
				color="danger" 
				className={this.props.buttonClassName}
				disabled={this.state.disabledDeleteButton} 
				onClick={() => this.toggle()}>{this.props.buttonLabel}</Button>{' '}
			
			<Modal isOpen={this.state.modal} toggle={() => this.toggle()} contentClassName="modal-content" size="lg">
			<ModalHeader toggle={() => this.toggle()} className="modal-title modal-delete-border">{this.props.modalTitle}</ModalHeader>
				<ModalBody>
					<Row>
						<Col>
							{this.props.modalBody}
						</Col>
					</Row>
					<Row>
						<Col className="bold">
							{this.props.modalSubtitle}
						</Col>
					</Row>
					<Row className={this.state.wasError ? "" : "display-none"}>
						<Col>
							<Alert color="danger" className="text-align-center">
								{this.state.message}
							</Alert>
						</Col>
					</Row>

					<Row className={this.state.wasInfo ? "" : "display-none"}>
						<Col>
							<Alert color="info" className="text-align-center">
								{this.state.message}
							</Alert>
						</Col>
					</Row>

					<Row className={this.state.wasSuccess ? "" : "display-none"}>
						<Col>
							<Alert color="success" className="text-align-center">
								{this.state.message}
							</Alert>
						</Col>
					</Row>
				</ModalBody>
				<ModalFooter>  
					<Button color="secondary" className="margin-right-10 border-radius-20" onClick={() => this.toggle()}><div className="padding-right-5 padding-left-5">{translate.useTranslation("Back")}</div></Button>
					{' '}
					<Button color="primary" disabled={this.state.disabledDeleteButton} className="border-radius-20" onClick={this.toggleConfirm}>
						{/* FA LOADERUL ASTA SA FIE CAT BUTONUL MEREU */}
						{/* {this.state.loaderVisibility ? <LoaderComponent visible={this.state.loaderVisibility}/> : */}
							<div className="padding-right-5 padding-left-5">{translate.useTranslation("delete")}</div>
						{/* } */}
					</Button>	
				</ModalFooter>
			</Modal>
		</div>
	);}
  }