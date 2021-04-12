import * as React from 'react';
import axios from 'axios';

import {
    Card, Label, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Input, Row, Col, Tooltip
  } from 'reactstrap';
import ReactStars from "react-rating-stars-component";
import Rating from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LoaderComponent, HorizontalList } from '../Items/Items-components'
import { AboutBody } from './Dataset-components'
import DatasetUpdate from './DatasetUpdate'
import CommentTabs from "./CommentTabs"

import { faEdit } from "@fortawesome/free-solid-svg-icons";

import { ImageTitle, Title } from '../Items/Title/Title';

import './DatasetView.scss';

export interface IDatasetViewLoadingProps {
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
}

export default class DatasetViewLoading extends React.Component<IDatasetViewLoadingProps, IDatasetViewLoadingState> {
    state = {
        rating: 0,
        shouldGiveRating: true,
        shouldDisplayLoading: true,
        userID: "0"
    }

    componentDidMount () {
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
    }

    goBack = () =>{
        window.history.back();
      }

    render() {  
        
        return (
            <>
            <Row>
                <Col>
                <a onClick={this.goBack} href="">Back</a>
                </Col>
                <Col md={{ size: 12, offset: 0 }}>
                    <ImageTitle 
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
                            <Col md="3"> </Col>
                            <Title titleSet="About" md={6} /> 
                            <Col md="3" className="text-align-right edit-button"> <FontAwesomeIcon icon={faEdit}/> </Col>
                        </Row>
                    </CardTitle>
                    {/* <AboutBody 
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
                        
                            downloadPath={this.props.downloadPath}
                            shouldHaveDownloadButton={this.props.shouldHaveDownloadButton}
                            shouldHaveDownloadLink={this.props.shouldHaveDownloadLink}
                    /> */}

                        <DatasetUpdate 
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
                            dataReuse={this.props.dataReuse} />
                    
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