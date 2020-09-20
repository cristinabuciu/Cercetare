import * as React from 'react';
import axios from 'axios';
import "./AddComment.scss"

import { faStarHalf, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactStars from "react-rating-stars-component";
import { Card, CardTitle, CardText, Form, Row, Col } from 'reactstrap';

export interface IAddCommentProps {
  id: number;
}

export interface IAddCommentState {
    showComments: boolean;
    rating: number;
}

export default class AddComment extends React.Component<IAddCommentProps, IAddCommentState> {

    state = {
        showComments: false,
        rating: 0,
        comments: [
            {id: 1, author: "landiggity", body: "This is my first comment on this forum so don't be a dick"},
            {id: 2, author: "scarlett-jo", body: "That's a mighty fine comment you've got there my good looking fellow..."},
            {id: 3, author: "rosco", body: "What is the meaning of all of this 'React' mumbo-jumbo?"}
        ]
    }

    onStarClick = (newRating) => {
      console.log("EMINEM");
      debugger;
      if (newRating !== this.state.rating) {
          this.setState({
              rating: newRating
          });
  
          console.log(newRating);
      }
  }
    
    
    render () {
      const comments = this._getComments();
      let commentNodes;
      let buttonText = 'Show Comments';
      
      if (this.state.showComments) {
        buttonText = 'Hide Comments';
        commentNodes = <div className="comment-list">{comments}</div>;
      }
      
      return(
        <Card className="border-0">
            <CardTitle><h2>Join the Discussion!</h2></CardTitle>
                <CardText>
                  <Row>
                    <Col className="rating-lg" md="2">
                      <ReactStars
                          count={5}
                          classNames="star-size padding-left-10"
                          onChange={this.onStarClick.bind(this)}
                          size={30}
                          isHalf={true}
                          emptyIcon={<i className="far fa-star"></i>}
                          halfIcon={<FontAwesomeIcon icon={faStarHalf} />}
                          fullIcon={<FontAwesomeIcon icon={faStar} />}
                          activeColor="#ffd700"
                          a11y={true}
                      />
                      </Col><Col className="rating-lg">
                      <span className="rating-text"> Acorda o nota</span>
                    </Col>
                    </Row>
                    <CommentForm addComment={this._addComment.bind(this)} id={this.props.id} rating={this.state.rating}/>
                </CardText>
        </Card>
      );
    } // end render
    
    _addComment(author, body) {
        const comment = {
            id: this.state.comments.length + 1,
            author,
            body
        };
        // this.setState({ 
        //     comments: this.state.comments.concat([comment]) 
        // }); // *new array references help React stay fast, so concat works better than push here.
    }
    
    _handleClick() {
      this.setState({
        showComments: !this.state.showComments
      });
    }
    
    _getComments() {    
      return this.state.comments.map((comment) => { 
        return (
          <Comment 
            author={comment.author} 
            body={comment.body} 
            key={comment.id} />
        ); 
      });
    }
    
    _getCommentsTitle(commentCount) {
      if (commentCount === 0) {
        return 'No comments yet';
      } else if (commentCount === 1) {
        return "1 comment";
      } else {
        return `${commentCount} comments`;
      }
    }
  } // end CommentBox component

export interface ICommentFormProps {
    addComment: Function;
    id: number;
    rating: number;
}

export interface ICommentFormState {}
  
  class CommentForm extends React.Component<ICommentFormProps, ICommentFormState> {
    render() {
      return (
        <Form className="comment-form" onSubmit={this._handleSubmit.bind(this)}>
          <div className="comment-form-fields">
            <input placeholder="Title" required ></input><br />
            <textarea placeholder="Comment" required ></textarea>
          </div>
          <div className="comment-form-actions">
            <button type="submit" className="button-add-comment">Post Comment</button>
          </div>
        </Form>
      );
    } // end render
    
    _handleSubmit(event) { 
      event.preventDefault();   // prevents page from reloading on submit
      //   let author = this._author;
      //   let body = this._body;
      //   this.props.addComment(author.value, body.value);
      debugger;
      console.log("GTA V");
      axios.post( '/updateReview', {
          params: {
              id: this.props.id,
              rating: this.props.rating
          }
      })
        .then(response => {
          console.log("Phill ");
          console.log(response.data);
          console.log("Another");
          
          this.setState({
              shouldDisplayLoading: false
          });

        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          // always executed
        }); 

    }
  } // end CommentForm component

export interface ICommentProps {
    author: string;
    body: string;
}

export interface ICommentState {}
  
  class Comment extends React.Component<ICommentProps, ICommentState> {
    render () {
      return(
        <div className="comment">
          <p className="comment-header">{this.props.author}</p>
          <p className="comment-body">- {this.props.body}</p>
          <div className="comment-footer">
            <a href="#" className="comment-footer-delete" onClick={this._deleteComment}>Delete Comment</a>
          </div>
        </div>
      );
    }
    _deleteComment() {
      alert("-- DELETE Comment Functionality COMMING SOON...");
    }
  }
  
  
  