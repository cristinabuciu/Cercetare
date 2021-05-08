import * as React from 'react';
import axios from 'axios';
import "./AddComment.scss"
import MyTranslator from '../assets/MyTranslator'

import { faStarHalf, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactStars from "react-rating-stars-component";
import { Card, CardTitle, CardText, Form, Row, Col, Alert } from 'reactstrap';
import { LoaderComponent } from '../Items/Items-components'

export interface IAddCommentProps {
  id: number;
}

export interface IAddCommentState {
    showComments: boolean;
    rating: number;
    itWasPosted: boolean;
    hasError: boolean;
    errorMessage: string;
}

export default class AddComment extends React.Component<IAddCommentProps, IAddCommentState> {

    state = {
        showComments: false,
        rating: 0,
        itWasPosted: false,
        hasError: false,
        errorMessage: "",
        comments: [
            {id: 1, author: "landiggity", body: "This is my first comment on this forum so don't be rude"},
            {id: 2, author: "scarlett-jo", body: "That's a mighty fine comment you've got there my good looking fellow..."},
            {id: 3, author: "rosco", body: "What is the meaning of all of this 'React' mumbo-jumbo?"}
        ]
    }

    onStarClick = (newRating) => {
      console.log("EMINEM");
      if (newRating !== this.state.rating) {
          this.setState({
              rating: newRating
          });
  
          console.log(newRating);
      }
  }

    onReceiveAnswerFromPost(hasError: boolean, errorMessage: string = ""): void {
      this.setState({
        itWasPosted: true,
        hasError: hasError,
        errorMessage: errorMessage
      });
    }
    
    
    render () {
      const comments = this._getComments();
      let commentNodes;
      let buttonText = 'Show Comments';
      
      if (this.state.showComments) {
        buttonText = 'Hide Comments';
        commentNodes = <div className="comment-list">{comments}</div>;
      }

      const translate = new MyTranslator("AddComment");
      
      return(
        <Card className="border-0">
            <CardTitle><h2>Join the Discussion!</h2></CardTitle>
                <CardText>
                {this.state.itWasPosted ? this.state.hasError ?
                    <Row>
                      <Col>
                        <Alert color="danger">
                            {this.state.errorMessage}
                          </Alert>
                      </Col>
                  </Row>    
                  :
                <Row>
                    <Col>
                      <Alert color="success">
                        {this.state.errorMessage}
                        </Alert>
                    </Col>
                </Row>   
                : <>
                  <Row>
                    <Col className="rating-lg">
                    
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
                    
                      </Col>
                    </Row>
                    <CommentForm addComment={this._addComment.bind(this)} id={this.props.id} rating={this.state.rating} onReceiveAnswerFromPost={this.onReceiveAnswerFromPost.bind(this)}/></>
                }
                  
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
    onReceiveAnswerFromPost: Function;
}

export interface ICommentFormState {
    title: string;
    body: string;

    // COMMENTS WARNINGS
    noRatingWarning: boolean; 
    noTitleAndBodyWarning: boolean;
    loaderVisibility: boolean;
}
  
  class CommentForm extends React.Component<ICommentFormProps, ICommentFormState> {

    state: ICommentFormState = {
      title: '',
      body: '',
      noRatingWarning: false,
      noTitleAndBodyWarning: false,
      loaderVisibility: false
    }

    componentDidMount(): void {
      //////////////// FUNCTIONS //////////////////
      this.changeLoader = this.changeLoader.bind(this);
    }

    changeValue = (e, comboBoxTitle) => {
      this.state[comboBoxTitle] = '' + e;
      this.forceUpdate();
    }

    changeLoader(value: boolean = false): void {
      this.setState({
        loaderVisibility: value
      });
    }


    render() {
      const translate = new MyTranslator("Response-codes");
      return (
        <Form className="comment-form" onSubmit={this._handleSubmit.bind(this)}>
          <div className="comment-form-fields">
            <input placeholder="Title" onChange={e => this.changeValue(e.target.value, 'title')}></input><br />
            <textarea placeholder="Comment" onChange={e => this.changeValue(e.target.value, 'body')}></textarea>
          </div>
          <div className="comment-form-actions">
            {this.state.loaderVisibility ? <LoaderComponent visible={this.state.loaderVisibility}/> : <button type="submit" className="button-add-comment">Post Comment</button>}
            <Row className={this.state.noRatingWarning ? "" : "display-none"}>
              <Col className="margin-top-10">
                  <Alert color="danger" className="text-align-center">
                      {translate.useTranslation("ADD_DATASET_COMMENT_ERROR_MISSING_RATING")}
                  </Alert>
              </Col>
          </Row>
          <Row className={this.state.noTitleAndBodyWarning ? "" : "display-none"}>
              <Col className="margin-top-10">
                  <Alert color="danger" className="text-align-center">
                      {translate.useTranslation("ADD_DATASET_COMMENT_ERROR_MISSING_TITLE_OR_COMMENT")}
                  </Alert>
              </Col>
          </Row>
          </div>
        </Form>


      );
    } // end render
    
    _handleSubmit(event): void { 
      this.changeLoader(true);
      const translate = new MyTranslator("Response-codes");
      event.preventDefault();   // prevents page from reloading on submit

      const token = localStorage.getItem('login_user_token');
      let errorMessage: string = "";

      const rating = this.props.rating;
      const title = this.state.title;
      const comment = this.state.body;

      if (rating > 0) {
        if ((title === '' && comment === '') || (title !== '' && comment !== '')) {
          axios.post( '/dataset/' + this.props.id + '/comments', {
            comment: {
                username: token,
                rating: this.props.rating,
                commentBody: this.state.body,
                commentTitle: this.state.title
            }
        })
          .then(response => {
            debugger;
            console.log(response.data);
            if (response.data['statusCode'] === 200) {
              errorMessage = translate.useTranslation(response.data['data']);
              this.props.onReceiveAnswerFromPost(false, errorMessage);
            } else {
              errorMessage = translate.useTranslation(response.data['data']);
              this.props.onReceiveAnswerFromPost(true, errorMessage);
            }
          })
          .catch((error) => {
            console.log(error);
            errorMessage = translate.useTranslation("ADD_DATASET_COMMENT_ERROR");
            this.props.onReceiveAnswerFromPost(true, errorMessage);
          })
          .finally(() => {
            // always executed
            debugger;
            this.changeLoader(false);
            this.setState({
              noTitleAndBodyWarning: false,
              noRatingWarning: false
            });
          });
        }
        else {
          this.changeLoader(false);
          this.setState({
            noTitleAndBodyWarning: true
          });
        }
      }
      else {
        this.changeLoader(false);
        this.setState({
          noRatingWarning: true
        });
      }
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
  
  
  