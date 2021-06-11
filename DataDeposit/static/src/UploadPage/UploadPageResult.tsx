import * as React from 'react';

import {
    Card, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Row, Col, Alert
  } from 'reactstrap';
import "../style_home.scss";
import "./upload.scss";
import LeftBar from "../LeftBar/LeftBar";
import { Container } from 'semantic-ui-react';
import { NavLink } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import MyTranslator from '../assets/MyTranslator'
 


export interface IUploadPageResultProps {
    color: string;
    handleRepairUpload: Function;
    wasSuccess: boolean;
    errorCode: string;
    newDatasetId: number;
}

export interface IUploadPageResultState {}

export default class UploadPageResult extends React.Component<IUploadPageResultProps, IUploadPageResultState> {

    state: IUploadPageResultState = {}

    componentDidMount(): void {}
  
    render() {
        const translate: MyTranslator = new MyTranslator("Response-codes");
      return (
        <Container className="themed-container" fluid={true}>
            <Row lg="12">

            </Row>
            <Row md="4">
                
                <LeftBar className='resizable-1050' modeSearch={false}/>
                <Col md={{ size: 2, offset: 0 }}>
                    .
                </Col>
                <Col md={{ size: 10, offset: 0 }}>
                <Card>
                    <CardBody>
                    <CardTitle className="UploadResultPage">
                        {this.props.wasSuccess ? 
                        <Alert color="success">
                            {translate.useTranslation("UPLOAD_DATASET_SUCCESS")}
                        </Alert>
                        :
                        <><Alert color="danger">
                            {this.props.errorCode}
                        </Alert>
                        <Alert color="warning">
                            {translate.useTranslation("UPLOAD_DATASET_WARNING")}
                        </Alert></>
                        }
                        
                    </CardTitle>
                    <CardSubtitle></CardSubtitle>
                    <CardText>
                        <Row><Col className="text-align-center">
                            {this.props.wasSuccess ? 
                            <NavLink tag={Link} className="dataset-padding" to={'/datasetView/' + this.props.newDatasetId}>
                                <Button 
                                color="primary" 
                                outline className="upload-button-size finish-button">
                                    {translate.useTranslation("go-to-button")}
                                </Button></NavLink>
                             : <></>}
                        </Col></Row>
                        <Row><Col className="text-align-center">
                            <Button 
                                color="primary" 
                                outline className="upload-button-size finish-button" 
                                onClick={() => this.props.handleRepairUpload()}>
                                    {translate.useTranslation("upload-another-button")}
                            </Button>
                        </Col></Row>
                    </CardText>
                    
                    </CardBody>
                </Card>
                </Col>
                
            </Row>
    </Container>
      )
    }

}





