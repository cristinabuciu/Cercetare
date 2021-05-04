import * as React from 'react';
import axios from 'axios';
import MyTranslator from '../assets/MyTranslator'

import { Card, CardTitle, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LoaderComponent, HorizontalList } from '../Items/Items-components'
import { AboutBody } from './Dataset-components'
import DatasetUpdate from './DatasetUpdate'
import CommentTabs from "./CommentTabs"

import { faEdit, faTimesCircle, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { ImageTitle, Title } from '../Items/Title/Title';

import './DatasetView.scss';

export interface IDatasetViewLoadingProps {
    private: boolean;
    id: number;
    domain: string;
    subdomain: Array<String> 
    country: string;
    data_format: string; 
    authors: Array<String>;
    year: string;
    dataset_title: string;
    article_title: string; 
    short_desc: string;
    avg_rating: number;
    gitlink: string;
    owner: string;
    downloadType: string;
    lastUpdatedAt: string;
    dataIntegrity: string;
    continuityAccess: string;
    dataReuse: string;
    views: number;
    ratings: number;
    updates: number;
    downloads: number;
    hasPhoto: boolean;

    downloadPath: string;
    shouldHaveDownloadButton: boolean;
    shouldHaveDownloadLink: boolean;
}

export interface IDatasetViewLoadingState {
    rating: number;
    shouldGiveRating: boolean;
    shouldDisplayLoading: boolean;
    userID: string;
    shouldDisplayAboutAt: boolean;
    hasEditPerm: boolean;
}

export default class DatasetViewLoading extends React.Component<IDatasetViewLoadingProps, IDatasetViewLoadingState> {
    state: IDatasetViewLoadingState = {
        rating: 0,
        shouldGiveRating: true,
        shouldDisplayLoading: true,
        userID: "0",
        shouldDisplayAboutAt: true,
        hasEditPerm: false
    }

    componentDidMount(): void {
        axios.get( '/user/' + this.props.owner)
          .then(response => {
            this.setState({
                userID: response.data
            });
          })
          .catch(function (error) {
            console.log(error);
        })
          .finally( () => {
            // always executed
        });
        
        const token = localStorage.getItem('login_user_token');
        
        if (this.props.owner === token) {
            this.setState({
                hasEditPerm: true,
                shouldDisplayAboutAt: true
            });
        }

        ////////// FUNCTIONS ///////////
        this.switchPage = this.switchPage.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
    }

    goBack = () =>{
        window.history.back();
    }

    switchPage(): void {
        this.setState({
            shouldDisplayAboutAt: !this.state.shouldDisplayAboutAt
        });
    }

    handleDownload(): boolean {
        axios.put( '/dataset/' + this.props.id + '/downloads')
        .then(response => {})
        .catch(function (error) {
            console.log(error);
            return false;
        });

        window.open(this.props.downloadPath, "_blank");
        return true;
    }

    render() {  
        const translate = new MyTranslator("View");
        return (
            <>
            <Row>
                <Col md={{ size: 12, offset: 0 }}>
                    <ImageTitle 
                        status={this.props.private ? "Private" : "Public"}
                        className="margin-bottom-10p" 
                        titleSet={this.props.dataset_title}
                        image={this.props.domain + "_domain.jpg"}
                        subtitle={"Last updated " + this.props.lastUpdatedAt}
                        profileID={this.state.userID}
                        hasProfilePhoto={this.props.hasPhoto} />
                </Col>
            </Row>
            <Row>
                <Col>
                <Card className="margin-top-20">
                    <CardTitle>
                        <Row>
                            <Col md="3"></Col>
                            {this.state.shouldDisplayAboutAt ? <Title titleSet={translate.useTranslation("about")} md={6} /> : <Title titleSet={translate.useTranslation("edit")} md={6} /> }
                            <Col md="3" className="text-align-right"> 
                                {this.state.hasEditPerm ?
                                <>
                                    {this.state.shouldDisplayAboutAt ? <FontAwesomeIcon className="about-edit-button edit-button" icon={faEdit} onClick={this.switchPage}/> :
                                    <FontAwesomeIcon className="about-edit-button edit-button" icon={faTimesCircle} onClick={this.switchPage}/>  }
                                </>
                                : <></>
                                }
                            </Col>
                        </Row>
                    </CardTitle>
                    {this.state.shouldDisplayAboutAt ?
                    <AboutBody 
                            domain={this.props.domain}
                            subdomain={this.props.subdomain} 
                            country={this.props.country}
                            data_format={this.props.data_format}
                            authors={this.props.authors}
                            year={this.props.year}
                            dataset_title={this.props.dataset_title}
                            article_title={this.props.article_title}
                            short_desc={this.props.short_desc}
                            avg_rating={this.props.avg_rating}
                            gitlink={this.props.gitlink}
                            owner={this.props.owner}
                            dataIntegrity={this.props.dataIntegrity}
                            continuityAccess={this.props.continuityAccess}
                            dataReuse={this.props.dataReuse}
                            handleDownload={this.handleDownload}
                        
                            downloadPath={this.props.downloadPath}
                            shouldHaveDownloadButton={this.props.shouldHaveDownloadButton}
                            shouldHaveDownloadLink={this.props.shouldHaveDownloadLink}
                    />
                        :
                        <DatasetUpdate 
                            private={this.props.private}
                            id={this.props.id}
                            domain={this.props.domain}
                            subdomain={this.props.subdomain} 
                            country={this.props.country}
                            data_format={this.props.data_format}
                            authors={this.props.authors}
                            year={this.props.year}
                            dataset_title={this.props.dataset_title}
                            article_title={this.props.article_title}
                            short_desc={this.props.short_desc}
                            avg_rating={this.props.avg_rating}
                            gitlink={this.props.gitlink}
                            dataIntegrity={this.props.dataIntegrity}
                            continuityAccess={this.props.continuityAccess}
                            dataReuse={this.props.dataReuse}
                            switchPage={this.switchPage}
                            handleDownload={this.handleDownload} />
                    }
                    
                </Card>
                </Col>

                <Col md="12" className="margin-top-20">
                    <CommentTabs
                        id={this.props.id} />
                </Col>


                <Card className="margin-top-20">
                {/* <CardBody> */}
                <Row >
                    <HorizontalList 
                        views={this.props.views}
                        ratings={this.props.ratings}
                        updates={this.props.updates}
                        downloads={this.props.downloads} />
                </Row>
                {/* </CardBody> */}
                    
                </Card>
            </Row>
            </>
        )
    }
}