import * as React from 'react';

import {
    Card, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Row, Col, Alert
  } from 'reactstrap';
import "../style_home.scss";
import "./upload.scss";
import LeftBar from "../LeftBar/LeftBar";
import { Container } from 'semantic-ui-react';
 


export interface IUploadPageResultProps {
    color: string;
    handleRepairUpload: Function;
    wasSuccess: boolean;
}

export interface IUploadPageResultState {
    buttonDropDownStatus: boolean;
}

export default class UploadPageResult extends React.Component<IUploadPageResultProps, IUploadPageResultState> {

    state = {
        buttonDropDownStatus: true
    }


    componentDidMount() {

    }
  
    render() {  

      return (
        <Container className="themed-container" fluid={true}>
            <Row lg="12">

            </Row>
            <Row md="4">
                
                <LeftBar className='resizable-1050' modeSearch={false}/>
                <Col md={{ size: 3, offset: 0 }}>
                    .
                </Col>
                <Col md={{ size: 9, offset: 0 }}>
                <Card>
                    <CardBody>
                    <CardTitle className="UploadResultPage">
                        {this.props.wasSuccess ? 
                        <Alert color="success">
                            Dataset has been uploaded successfully !
                        </Alert>
                        :
                        <><Alert color="danger">
                            Error: Dataset has not been uploaded  !
                        </Alert>
                        <Alert color="warning">
                            If this didn't happend before please try again
                        </Alert></>
                        }
                        
                    </CardTitle>
                    <CardSubtitle></CardSubtitle>
                    <CardText>
                        <Row>
                        <Col className="text-align-center">
                                <Button 
                                    color="primary" 
                                    outline className="upload-button-size" 
                                    onClick={() => this.props.handleRepairUpload()}>
                                        Upload another dataset
                                    </Button>
                                </Col>
                                
                        </Row>
                    </CardText>
                    
                    </CardBody>
                </Card>
                </Col>
                
            </Row>
    </Container>
      )
    }

}





