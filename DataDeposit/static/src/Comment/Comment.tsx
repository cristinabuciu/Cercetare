
import React, { PureComponent } from 'react'
import axios from 'axios';
import "./AddComment.scss"

import { Link } from 'react-router-dom'
import StarRatings from 'react-star-ratings';
import {
    Card, CardBody,
    CardTitle, Button, Row, Col
  } from 'reactstrap';

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
    value: number;
    author: String;
    title: String;
    body: String;
    date: String;
}

export interface ICommentState {}

export default class Comment extends React.Component<ICommentProps, ICommentState> {

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
                        <h3 className="review-title">{this.props.title}</h3>
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
                            {this.props.body}
                        </div>
                    </div>
                </Col>
            
            </Row>
        );
    }
}