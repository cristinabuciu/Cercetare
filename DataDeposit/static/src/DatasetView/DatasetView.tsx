import * as React from 'react';
import axios from 'axios';

import { Row, Col, Alert } from 'reactstrap';
import LeftBar from "../LeftBar/LeftBar";
import DatasetViewLoading from "./DatasetViewLoading"
import DatasetViewItem from "./DatasetViewItem"
import { Container } from 'semantic-ui-react';
import { RouteComponentProps } from 'react-router';

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DatasetMetadata } from '../models/DatasetMetadata'
import { ResponseStatus } from '../models/ResponseStatus'
import MyTranslator from '../assets/MyTranslator'

import './DatasetView.scss';

export interface IDatasetViewProps extends RouteComponentProps {
    color: String;
    id: number;
}

export interface IDatasetViewState {
    searchResult: DatasetMetadata;
    shoudLoad: boolean;
    responseStatus: ResponseStatus;
}

export default class DatasetView extends React.Component<IDatasetViewProps, IDatasetViewState> {

    state: IDatasetViewState = {
        searchResult: {
            article_title: "",
            authors: [],
            avg_rating_value: -1,
            continuityAccess: "",
            country: "",
            dataIntegrity: "",
            dataReuse: "",
            data_format: "",
            dataset_title: "",
            date: "",
            deleted: false,
            deletedAt: -1,
            domain: "",
            downloadPath: "",
            downloads_number: -1,
            elapsedTime: "",
            full_desc: "",
            geo_coord: "",
            gitlink: "",
            hasPhoto: false,
            id: -1,
            lastUpdatedAt: "",
            owner: "",
            ownerId: -1,
            private: false,
            ratings_number: -1,
            resourceType: "",
            short_desc: "",
            tags: [],
            updates_number: -1,
            views: -1,
            year: "",
            checksum: "-"
        },
        shoudLoad: true,
        responseStatus: {
			wasError: false,
			wasSuccess: false,
			responseMessage: ""
		}
    }
    componentDidMount(): void {
        console.log("Spencer");
        const profileID = this.props.match.params['id'];
        console.log(profileID);

        let responseStatus: ResponseStatus = {};
		const translate = new MyTranslator("Response-codes");

        axios.get( '/dataset/' + profileID)
        .then(response => {
            console.log("AVA MAX");
            console.log(response.data);
            console.log("KINGS & QUEENS");

            if (response.data['statusCode'] === 200) {
                responseStatus.wasSuccess = true;
                this.setState({
                    searchResult:response.data['data'],
                });
            } else {
                responseStatus.wasError = true;
                responseStatus.responseMessage = translate.useTranslation(response.data['data']);
            }
        })
        .catch(function (error) {
            console.log(error);
            responseStatus.wasError = true;
            responseStatus.responseMessage = translate.useTranslation("GET_DATASET_ERROR");
        })
        .finally(() => {
            // always executed
            this.setState({
                responseStatus: responseStatus,
                shoudLoad: false
            });
        });
        
        ////////// FUNCTIONS ///////////
          this.goBack = this.goBack.bind(this);
    }

    goBack(): void {
        window.history.back();
    }

    render() {  
        return (
            <Container className="themed-container" fluid={true}>
                <Row className="container-inside">
                    
                    <LeftBar className='resizable-1050' modeSearch={false}/>
                    <Col sm="2" className="text-align-right">
                        <FontAwesomeIcon className="about-edit-button" icon={faArrowLeft} onClick={this.goBack} size="3x" />
                    </Col>
                    <Col md="10">
                    {this.state.shoudLoad ? <DatasetViewLoading />
                    :
                    this.state.responseStatus.wasError ? 
                    <Row className={this.state.responseStatus.wasError ? "" : "display-none"}>
                        <Col>
                            <Alert color="danger" className="text-align-center">
                                {this.state.responseStatus.responseMessage}
                            </Alert>
                        </Col>
                    </Row>
                    :
                    <DatasetViewItem 
                        private={this.state.searchResult['private']}
                        id={this.state.searchResult['id']}
                        domain={this.state.searchResult['domain']} 
                        subdomain={this.state.searchResult['tags']} 
                        country={this.state.searchResult['country']} 
                        data_format={this.state.searchResult['data_format']} 
                        authors={this.state.searchResult['authors']} 
                        year={this.state.searchResult['year']} 
                        dataset_title={this.state.searchResult['dataset_title']}
                        article_title={this.state.searchResult['article_title']} 
                        short_desc={this.state.searchResult['short_desc']}
                        avg_rating={this.state.searchResult['avg_rating_value']}
                        gitlink={this.state.searchResult['gitlink']}
                        owner={this.state.searchResult['owner']}
                        downloadType={''}
                        lastUpdatedAt={this.state.searchResult['elapsedTime']}

                        shouldHaveDownloadButton={this.state.searchResult['resourceType'] === 'EXTERNAL' || this.state.searchResult['resourceType'] === 'INTERNAL' }
                        shouldHaveDownloadLink={this.state.searchResult['resourceType'] === 'EXTERNAL'}
                        downloadPath={this.state.searchResult['downloadPath']}

                        dataIntegrity={this.state.searchResult['dataIntegrity']}
                        continuityAccess={this.state.searchResult['continuityAccess']}
                        dataReuse={this.state.searchResult['dataReuse']}

                        views={this.state.searchResult['views']}
                        ratings={this.state.searchResult['ratings_number']}
                        updates={this.state.searchResult['updates_number']}
                        downloads={this.state.searchResult['downloads_number']}
                        hasPhoto={this.state.searchResult['hasPhoto']}
                        checksum={this.state.searchResult['checksum'] ? this.state.searchResult['checksum'] : "-"}
                    />
                    }
                    </Col>
                        
                    
                </Row>
            </Container>
        )
    }
}