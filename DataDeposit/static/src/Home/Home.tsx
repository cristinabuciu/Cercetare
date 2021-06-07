import * as React from 'react';
import MyTranslator from '../assets/MyTranslator'
import axios from 'axios';

import './Home.scss';
import LeftBar from "../LeftBar/LeftBar";
import { Row, Col, Alert, Card, CardBody } from 'reactstrap';
import { Container } from 'semantic-ui-react';
import { Title, HomeTitle } from '../Items/Title/Title';
import RichTextEditor from 'react-rte';
import { ResponseStatus } from '../models/ResponseStatus';
import { IStatistics } from './IHomeModels';
import { LoaderComponent } from '../Items/Items-components'


export interface IHomeProps {
    greeting: string;
}

export interface IHomeState {
    value: any;

    responseGetStatus: ResponseStatus;
    statistics: IStatistics;
    loaderVisibility: boolean;
}

export default class Home extends React.Component<IHomeProps, IHomeState> {
    state: IHomeState = {
        loaderVisibility: true,
        value: RichTextEditor.createEmptyValue(),

        responseGetStatus: {
			wasError: false,
			wasSuccess: false,
			responseMessage: ""
		},
        statistics: {
            datasets: 0,
            domains: 0,
            internal_resources: 0,
            external_resources: 0,
        }
    };

    public componentDidMount(): void {
        let responseGetStatus: ResponseStatus = {};
		const translate = new MyTranslator("Response-codes");

        axios.get( '/statistics')
		.then(response => {
			if (response.data['statusCode'] === 200) {
                responseGetStatus.wasSuccess = true;
                debugger;
                this.setState({
                    statistics: response.data['data']
                });

            } else {
                responseGetStatus.wasError = true;
                responseGetStatus.responseMessage = translate.useTranslation(response.data['data']);
            }
		})
		.catch(function (error) {
			console.log(error);
			responseGetStatus.wasError = true;
			responseGetStatus.responseMessage = translate.useTranslation("GET_STATISTICS_ERROR");
		})
		.finally( () => {
			// always executed
            this.setState({
                responseGetStatus: responseGetStatus,
                loaderVisibility: false
            })
		});
    }

    render() {
        const translate = new MyTranslator("Home");
        return (

            <Container className="themed-container" fluid={true}>
                <Row lg="12">
                    <Title className="HomeTitle" titleSet={this.props.greeting}/>
                </Row>
                <Row md="4">
                    
                    <LeftBar 
                        className='resizable-1050' 
                        modeSearch={false}/>
                    <Col md={{ size: 2, offset: 0 }}>
                        .
                    </Col>
                    <Col md={{ size: 10, offset: 0 }}>
                        <HomeTitle className="HomeTitle" titleSet={translate.useTranslation("home-title")}/>
                        
                        <Row>
                            <Col>
                                <iframe src="http://localhost:5601/app/kibana#/visualize/edit/c325a2e0-c6c6-11eb-ac1c-bde289732919?embed=true&_g=(refreshInterval%3A('%24%24hashKey'%3A'object%3A1073'%2Cdisplay%3A'1%20minute'%2Cpause%3A!f%2Csection%3A2%2Cvalue%3A60000)%2Ctime%3A(from%3Anow-15m%2Cmode%3Aquick%2Cto%3Anow))&_a=(uiState:(mapCenter:!(39.90973623453719,18.281250000000004),mapZoom:3))" height="600" width="100%"></iframe>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <LoaderComponent visible={this.state.loaderVisibility}/> 
                                <Row className={this.state.responseGetStatus.wasError ? "margin-top-20" : "display-none"}>
                                    <Col>
                                        <Alert color="danger" className="text-align-center">
                                            {this.state.responseGetStatus.responseMessage}
                                        </Alert>
                                    </Col>
                                </Row>
                                {this.state.loaderVisibility ? <></>
                                :
                                <Card className="margin-top-20">
                                    <CardBody className="text-align-center">
                                        <Row className="container-inside">
                                            <Col className="statistics-card" md="3">
                                                <div className="statistics-card-item margin-bottom-5 text-align-center">
                                                    <Title titleSet={this.state.statistics.datasets} className="statistics-card-title" />
                                                    <Title titleSet={translate.useTranslation("datasets")} className="statistics-card-details"/> 
                                                </div>
                                            </Col>
                                            <Col className="statistics-card" md="3">
                                                <div className="statistics-card-item margin-bottom-5 text-align-center">
                                                    <Title titleSet={this.state.statistics.domains} className="statistics-card-title" />
                                                    <Title titleSet={translate.useTranslation("domains")} className="statistics-card-details"/> 
                                                </div>
                                            </Col>
                                            <Col className="statistics-card" md="3">
                                                <div className="statistics-card-item margin-bottom-5 text-align-center">
                                                    <Title titleSet={this.state.statistics.internal_resources} className="statistics-card-title" />
                                                    <Title titleSet={translate.useTranslation("internals")} className="statistics-card-details"/> 
                                                </div>
                                            </Col>
                                            <Col className="statistics-card" md="3">
                                                <div className="statistics-card-item margin-bottom-5 text-align-center">
                                                    <Title titleSet={this.state.statistics.external_resources} className="statistics-card-title" />
                                                    <Title titleSet={translate.useTranslation("externals")} className="statistics-card-details"/> 
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                        
                                </Card>
                                }
                            </Col>
                        </Row>


                    </Col>
                    
                </Row>
            </Container>
            
        );
    }
}