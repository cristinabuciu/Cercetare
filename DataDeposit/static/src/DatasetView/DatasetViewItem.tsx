import * as React from 'react';
import axios from 'axios';

import {
    Card, Label, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Input, Row, Col, Tooltip
  } from 'reactstrap';
import ReactStars from "react-rating-stars-component";
import Rating from 'react-rating';
import { faStar, faStarHalf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LoaderComponent } from '../Items/Items-components'
import CommentTabs from "./CommentTabs"

import Title from '../Items/Title/Title';

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

    render() {  

        return (
            <Row>
            <Col md={{ size: 9, offset: 0 }}>
                <Title className="margin-top-50 margin-bottom-10p" titleSet={this.props.dataset_title}/>

            </Col>
            <Col md="12">
                <CommentTabs
                    id={this.props.id} />
            </Col>
            </Row>
        )
    }
}