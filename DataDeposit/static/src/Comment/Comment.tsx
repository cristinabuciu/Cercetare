
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

// VARIANTA CU REPLY
// export const MyComment = ({ comment, allComments, createComment, user_id, post_id, parent_id }) => {

//   const childComments = () => allComments.filter(c => c.parent_id === comment.id)

//   return (
//     <Comment
//       author={
//         <Link to={`/profile/${comment.user.id}`}>
//           {comment.user.name}
//         </Link>
//       }
//       avatar={
//         <Link to={`/profile/${comment.user.id}`}>
//           <Avatar
//             src={comment.user.avatar}
//             alt={`${comment.user.name}-avatar`}
//           />
//         </Link>
//       }
//       content={
//         <p>{`${comment.id} - ${comment.text}`}</p>
//       }
//     //   datetime={displayPostDate(comment.created_at)}
//     >
//     {
//       childComments().map(c => (
//         <MyComment 
//           key={c.id} 
//           comment={c} 
//           allComments={allComments}
//           createComment={createComment}
//           user_id={user_id}
//           post_id={post_id}
//           parent_id={c.id}
//         />
//       ))
//     }
//     </Comment>
//   )
// }

export interface ICommentProps {
    id: number;
    datasetID: number;
    value: number;
    author: String;
    title: String;
    body: String;
    date: String;
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

    handleClickDelete(): void {
        const token = localStorage.getItem('login_user_token');
        const translate = new MyTranslator("Error-codes");
        let errorMessage: string = "";

        this.setState({
            disabledDeleteButton: true
        });
        // AICI AM RAMAS 10.01.2021
        // TODO BACKEND
        axios.delete( '/dataset/' + this.props.datasetID + '/comment/' + this.props.id)
          .then(response => {
            console.log("Carolina ");
            console.log(response.data);
            console.log("Jambala");

            if (response.data['statusCode'] === 200) {
                // this.props.onReceiveAnswerFromPost(false);
            } else {
                errorMessage = translate.useTranslation(response.data['data']);
                // this.props.onReceiveAnswerFromPost(true, errorMessage);
            }

            this.props.updateComments();
          })
          .catch(function (error) {
            console.log(error);
            errorMessage = translate.useTranslation("DELETE_DATASET_COMMENT_ERROR");
          })
          .finally(function () {
            // always executed
          }); 
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
                            <Button 
                                color="danger" 
                                className="delete-comment-btn" 
                                onClick={this.handleClickDelete}
                                disabled={this.state.disabledDeleteButton} ><FontAwesomeIcon icon={faTimesCircle}/></Button>
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