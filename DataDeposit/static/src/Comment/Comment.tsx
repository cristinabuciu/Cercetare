
import React, { PureComponent } from 'react'
import axios from 'axios';
import "./AddComment.scss"
import MyTranslator from '../assets/MyTranslator'

import StarRatings from 'react-star-ratings';
import {
    Card, CardBody,
    CardTitle, Button, Row, Col
  } from 'reactstrap';

import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModalConfirm from '../common/ModalConfirm'
import { DeleteMessageItem } from '../models/DeleteMessageItem'

export interface ICommentProps {
    id: number;
    datasetID: number;
    value: number;
    author: string;
    title: string;
    body: string;
    date: string;
    updateComments: Function;
}

export interface ICommentState {
    disabledDeleteButton: boolean;
    shouldDisplayDeleteButton: boolean;
}

export default class Comment extends React.Component<ICommentProps, ICommentState> {

    state: ICommentState = {
        disabledDeleteButton: false,
        shouldDisplayDeleteButton: false
    }

    componentDidMount(): void {
        this.handleClickDelete = this.handleClickDelete.bind(this);

        const token = localStorage.getItem('login_user_token');
        if (this.props.author === token) {
            this.setState({
                shouldDisplayDeleteButton: true
            });
        }
    }

    async handleClickDelete(): Promise<DeleteMessageItem> {
        const token = localStorage.getItem('login_user_token');
        let returnMessage: DeleteMessageItem = {};
        const translate = new MyTranslator("Response-codes");

        this.setState({
            disabledDeleteButton: true
        });

        await axios.delete( 'http://localhost:41338/dataset/' + this.props.datasetID + '/comment/' + this.props.id)
        .then(response => {
            console.log("Carolina ");
            console.log(response.data);
            console.log("Jambala");

            if (response.data['statusCode'] === 200) {
                returnMessage.wasSuccess = true;
                returnMessage.message = translate.useTranslation(response.data['data']);
            } else {
                returnMessage.wasError = true;
                returnMessage.message = translate.useTranslation(response.data['data']);
            }
        })
        .catch(function (error) {
            console.log(error);
            returnMessage.wasError = true;
            returnMessage.message = translate.useTranslation("DELETE_DATASET_COMMENT_ERROR");
        })
        .finally(function () {
            // always executed
        });

        return returnMessage;
    }

    render () {

        
        return(
            <Row>
                <Col md="2">
                    <div className="review-head">
                        <div className="review-user-meta">
                            <p className="review-author">{this.props.author}</p>
                            <p className="review-date">{this.props.date}</p></div>
                        </div>
                </Col>
                <Col md="10">
                    <div className="review-body">
                        <hr className="hr-style-review" />
                        <Row>
                        <Col>
                        <h3 className="review-title">{this.props.title}</h3>
                        </Col>
                        {this.state.shouldDisplayDeleteButton ? <Col className="text-align-center">
                            <ModalConfirm
                                idToBeConfirmed={this.props.id}
                                buttonLabel={<FontAwesomeIcon icon={faTimesCircle}/>}
                                buttonClassName="delete-comment-btn" 
                                modalTitle="Delete Comment"
                                modalBody="You have requested to delete the following comment:"
                                modalSubtitle={this.props.title}
                                handleConfirm={this.handleClickDelete}
                                successCallback={this.props.updateComments} /> 
                        </Col> : <></>}
                        </Row>
                        <div className="star-rating-container">
                        <StarRatings
                                rating={this.props.value}
                                starDimension="19px"
                                starSpacing="3px"
                                numberOfStars={5}
                                starRatedColor="gold"
                                name='rating'
                            />
                        </div>
                        <div className="mrg-btm-xs js-review-body review-container">
                            <p className="comment-format">
                                {this.props.body}
                            </p>
                        </div>
                    </div>
                </Col>
            
            </Row>
        );
    }
}