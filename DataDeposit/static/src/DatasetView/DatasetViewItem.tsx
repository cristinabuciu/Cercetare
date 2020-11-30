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
import CommentTabs from "./CommentTabs"

import { faLink, faStar, faPortrait, faCalendar, faUser, faFile, faFileDownload, faGlobe, faDatabase, faEye, faTags, faFemale, faFlag } from "@fortawesome/free-solid-svg-icons";

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
        axios.get( '/getUserID', {
            params: {
                user: this.props.owner
            }
        })
          .then(response => {
            this.setState({
                userID: response.data
            });
            debugger;
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
                        className="margin-top-50 margin-bottom-10p" 
                        titleSet={this.props.dataset_title}
                        image={this.props.domain + "_domain.jpg"}
                        subtitle={"Last updated " + this.props.lastUpdatedAt}
                        profileID={this.state.userID} />
                </Col>
            </Row>
            <Row>
                <Col>
                <Card className="margin-top-20">
                    <CardTitle><Title titleSet="About" /></CardTitle>
                    <CardBody>
                    <Row >
                        <Col>
                            
                                <div className="column-section">
                                    <div className="overflow-hidden">
                                    <span className="column-item">
                                        <span className="column-data">
                                        <FontAwesomeIcon icon={faCalendar}/> Domain:
                                        </span>
                                        {this.props.domain ? this.props.domain : "-"}
                                    </span>

                                    <span className="column-item">
                                        <span className="column-data">
                                        <FontAwesomeIcon icon={faTags}/> Tags:
                                        </span>
                                        <div className="overflow-hidden">
                                        {this.props.subdomain ? this.props.subdomain.map(txt => <div className="column-list">{txt}</div>) : "-"}
                                        </div>
                                    </span>

                                    <span className="column-item">
                                        <span className="column-data">
                                        <FontAwesomeIcon icon={faPortrait}/> Authors:
                                        </span>
                                        <div className="overflow-hidden">
                                        {this.props.authors ? this.props.authors.map(txt => <div className="column-list">{txt}</div>) : "-"}
                                        </div>
                                    </span>

                                    <span className="column-item">
                                        <span className="column-data">
                                        <FontAwesomeIcon icon={faPortrait}/> Article title:
                                        </span>
                                        {this.props.article_title ? this.props.article_title : "-"}
                                    </span>

                                    <span className="column-item">
                                        <span className="column-data">
                                        <FontAwesomeIcon icon={faGlobe}/> Country:
                                        </span>
                                        {this.props.country ? this.props.country : "-"}
                                    </span>
                                    
                                    <span className="column-item">
                                        <span className="column-data">
                                        <FontAwesomeIcon icon={faCalendar}/> Created:
                                        </span>
                                        {this.props.year ? this.props.year : "-"}
                                    </span>

                                    </div>

                                    <div className="overflow-hidden">
                                        <span className="column-item">
                                            <span className="column-data">
                                            <FontAwesomeIcon icon={faStar}/> Rating:
                                            </span>
                                            {this.props.avg_rating ? this.props.avg_rating : "0"}
                                        </span>
                                        <span className="column-item">
                                            <span className="column-data">
                                            <FontAwesomeIcon icon={faFile}/> Data format:
                                            </span>
                                            {this.props.data_format ? this.props.data_format : "-"}
                                        </span>
                                        <span className="column-item">
                                            <span className="column-data">
                                            <FontAwesomeIcon icon={faFileDownload}/> Download Type:
                                            </span>
                                            {this.props.shouldHaveDownloadButton ? 
                                                <>{
                                                    this.props.shouldHaveDownloadLink ? 
                                                    <><a target="_blank" href={this.props.downloadPath}><FontAwesomeIcon icon={faLink} />Download Link</a></>
                                                    :
                                                    <span><FontAwesomeIcon icon={faDatabase} />  Download File</span>
                                                }</>
                                                :
                                                <>No download!</>
                                                }
                                        </span>
                                        <span className="column-item">
                                            <span className="column-data">
                                            <FontAwesomeIcon icon={faGlobe}/> Gitlink:
                                            </span>
                                            {this.props.gitlink ? this.props.gitlink : "-"}
                                        </span>

                                        <span className="column-item">
                                            <span className="column-data">
                                            <FontAwesomeIcon icon={faUser}/> Uploaded by:
                                            </span>
                                            {this.props.owner ? this.props.owner : "-"}
                                        </span>
                                    </div>

                                </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {this.props.short_desc}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="column-title margin-top-10">
                                Data integrity and authenticity
                            </div>
                            <div>
                                *add integrity and authenticity*
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="column-title margin-top-10">
                                Continuity of access
                            </div>
                            <div>
                                *add continuity*
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="column-title margin-top-10">
                                Data reuse
                            </div>
                            <div>
                                *add data reuse*
                            </div>
                        </Col>
                    </Row>
                    </CardBody>
                    
                </Card>
                </Col>

                <Col md="12" className="margin-top-20">
                    <CommentTabs
                        id={this.props.id} />
                </Col>


                <Card className="margin-top-20">
                {/* <CardBody> */}
                <Row >
                    <HorizontalList itemList={['a', 'b']} />
                </Row>
                {/* </CardBody> */}
                    
                </Card>
            </Row>
            </>
        )
    }
}