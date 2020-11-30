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

import { faStarHalf, faStar, faPortrait, faCalendar, faUser, faFile, faFileDownload, faGlobe, faDatabase, faEye, faTags, faFemale, faFlag } from "@fortawesome/free-solid-svg-icons";

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
}

export interface IDatasetViewLoadingState {
    rating: number;
    shouldGiveRating: boolean;
    shouldDisplayLoading: boolean;
}

export default class DatasetViewLoading extends React.Component<IDatasetViewLoadingProps, IDatasetViewLoadingState> {
    state = {
        rating: 0,
        shouldGiveRating: true,
        shouldDisplayLoading: true
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
                        image={this.props.domain + "_domain.jpg"} />
                </Col>
            </Row>
            <Row>
                <Col>
                <Card className="margin-top-20">
                    <CardTitle><Title titleSet="Description" /></CardTitle>
                    <CardBody>
                    <Row >
                        <Col>
                            {this.props.short_desc}

                            <Row>
                                <Col>
                                <div className="column-section">
                                    <div className="overflow-hidden">
                                    <div className="column-title">
                                        Metadata
                                    </div>
                                    <span className="column-item">
                                        <span className="column-data">
                                        <FontAwesomeIcon icon={faCalendar}/> Created:
                                        </span>
                                        {this.props.year ? this.props.year : "-"}
                                    </span>

                                    <span className="column-item">
                                        <span className="column-data">
                                        <FontAwesomeIcon icon={faUser}/> Uploaded by:
                                        </span>
                                        {this.props.owner ? this.props.owner : "-"}
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
                                        <FontAwesomeIcon icon={faGlobe}/> Country:
                                        </span>
                                        {this.props.country ? this.props.country : "-"}
                                    </span>
                                    </div>

                                </div>
                                </Col>
                            </Row>
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