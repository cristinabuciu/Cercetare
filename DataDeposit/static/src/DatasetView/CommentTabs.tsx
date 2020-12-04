import * as React from 'react';
import axios from 'axios';

import classnames from 'classnames';
import AddComment from "../Comment/AddComment";
import Comment from "../Comment/Comment";
import ReactStars from "react-rating-stars-component";
import { faStarHalf, faHatWizard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Row, Col, TabContent, TabPane, Nav, NavItem, Button, CardBody, Card, NavLink, Alert } from 'reactstrap';
import NumericInput from 'react-numeric-input';
import {InputText, LoaderComponent} from '../Items/Items-components'

export interface ICommentTabsProps {
    id: number;
}

export interface ICommentTabsState {
    activeTab: string;
    currentPage: number;
    numberOfCards: number;
    shouldDisplayPagination: boolean;
    wasInfo: boolean;
    sortBy: String;
    sortByList: Array<String>;
    loaderVisibility: boolean;
    resultsPerPage: number | null;
    wasError: boolean;
}

export default class CommentTabs extends React.Component<ICommentTabsProps, ICommentTabsState> {

    state = {
        activeTab: '1',
        currentPage: 1,
        numberOfCards: 0,
        resultsPerPage: 5,
        shouldDisplayPagination: false,
        wasInfo: false,
        wasError: false,
        sortBy: "Sort By  ",
        sortByList: ['Dataset_title ASC', 'Dataset_title DESC', 'Avg_Rating_Value ASC', 'Avg_Rating_Value DESC'],
        loaderVisibility: false,

        comments: []
            // {id: 1, value: 3.5, author: "landiggity", title: "Hatz", body: "This is my first comment on this forum so don't be rude", date: "20-10-2020"},
            // {id: 2, value: 1, author: "scarlett-jo", title: "Inoanta Chelutu", body: "That's a mighty fine comment you've got there my good looking fellow...", date: "20-10-2020"},
            // {id: 3, value: 4, author: "rosco", title: "Swalala", body: "What is the meaning of all of this 'React' mumbo-jumbo?", date: "20-10-2020"}
    }

    componentDidMount() {
        const numberOfCardsLen = this.state.comments.length;
        this.updateComments();
        
    }

    switchLoader () {
        this.setState(prevState => ({
            loaderVisibility: !prevState.loaderVisibility
          }));
    }

    updateComments() {
        this.switchLoader();
        axios.get( '/getComments', {
            params: {
                datasetId: this.props.id,
                currentPage: this.state.currentPage,
                resultsPerPage: this.state.resultsPerPage
            }
        })
          .then(response => {
            const numberOfCardsLen = response.data.length;
            if (numberOfCardsLen > 0) {
                this.state.comments = response.data['results']
                debugger;
                this.setState({
                    numberOfCards: response.data['length'],
                    shouldDisplayPagination: true,
                    wasInfo: false,
                    wasError: false
                });
            } else {
                this.setState({
                    wasInfo: true
                });
            }
          })
          .catch((error) => {
            console.log(error);
            this.setState({
                wasError: true
            });
          })
          .finally(() => {
            // always executed
            this.switchLoader();
        });
    }

    handleClickArrowLeft = (event) => {
        let nextPage = this.state.currentPage - 1;
        if(nextPage < 1) {
            nextPage = 1;
        }
        this.setState({
            currentPage: nextPage
        }, () => {
            this.updateComments();
        });
    }

    handleClickArrowRight = (event) => {
        let nextPage = this.state.currentPage + 1;
        if(nextPage > Math.ceil(this.state.numberOfCards / this.state.resultsPerPage)) {
            nextPage = Math.ceil(this.state.numberOfCards / this.state.resultsPerPage);
        }
        this.setState({
            currentPage: nextPage
        }, () => {
            this.updateComments();
        });
    }

    handleClick = (event) => {
        this.setState({
            currentPage: Number(event.target.id)
        }, () => {
            this.updateComments();
        });
      }
    
    switchTabs = (tab) => {
        if(this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });

            if (tab === '1') {
                this.updateComments();
            }
        }
    }

    showSearchCards() {
        console.log("JOHNULE!!!");
        console.log(this.state.comments);
        let cards = this.state.comments.map(item => (
            // {id: 1, value: 3.5, author: "landiggity", title: "Hatz", body: "This is my first comment on this forum so don't be a dick"},
//             commentBody: "body"
// commentTitle: "title"
// createdAt: "1132507830"
// datasetID: 6
// rating: 1.5
// username: "admin"
            <Comment 
                value={item['rating']}
                author={item['username']}
                title={item['commentTitle']}
                body={item['commentBody']}
                date={new Date(item['createdAt'] * 1000).toLocaleDateString('en-GB')} />
          )
        )

        return cards;
    }

    changeValueSort = (e) => {
        debugger;
    }

    render() {
        const searchResult = this.showSearchCards();
        const resultsPerPage = this.state.resultsPerPage;

        // Logic for displaying page numbers
        const pageNumbers = new Array();
        for (let i = 1; i <= Math.ceil(this.state.numberOfCards / resultsPerPage); i++) {
          pageNumbers.push(i);
        }
    
        const renderPageNumbers = pageNumbers.map(number => {
          return (
            <li
              key={number}
              id={number}
              className={this.state.currentPage === number ? "active" : ""}
              onClick={this.handleClick}
            >
              {number}
            </li>
          );
        });

        return (
        <Card>
            <Nav tabs className="margin-top-5 margin-bottom-5">
                <NavItem>
                    <NavLink
                        className={classnames({ active: this.state.activeTab === '1' })}
                        onClick={ () => this.switchTabs('1') }
                    >
                    All comments
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: this.state.activeTab === '2' })}
                        onClick={ () => this.switchTabs('2') }
                    >
                    Add comment
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                    <Row>
                    <Col sm="12">
                    <Row>
                        <Col md="12">
                            <div className="review-body text-align-center">
                                <hr className="hr-style-review" />
                                <NumericInput 
                                    className="width-numeric-input" 
                                    step={1} 
                                    min={3} 
                                    max={50} 
                                    value={this.state.resultsPerPage}
                                    onChange={value => this.setState({resultsPerPage: value })} />
                                    <InputText 
                                        nameOfDropdown="sortBy" 
                                        titleDropdown={this.state.sortBy} 
                                        listOfItems={this.state.sortByList} 
                                        className="button-style-sort"
                                        changeValue={this.changeValueSort} 
                                        />
                                <Button color="link"><FontAwesomeIcon icon={faHatWizard}/></Button>
                            </div>
                        </Col>
                    
                    </Row>

                        {this.state.shouldDisplayPagination ? searchResult : <LoaderComponent visible={this.state.loaderVisibility}/>}

                        <Row className={this.state.wasInfo ? "" : "display-none"}>
                            <Col>
                                <Alert color="info" className="text-align-center">
                                    No comments found !
                                </Alert>
                            </Col>
                        </Row>

                        <Row className={this.state.wasError ? "" : "display-none"}>
                            <Col>
                                <Alert color="danger" className="text-align-center">
                                    There was an error when getting the reviews !
                                </Alert>
                            </Col>
                        </Row>

                        <Row className={this.state.shouldDisplayPagination ? "" : "display-none"}>
                            <Col className="text-align-center">
                            <hr className="hr-style" />
                                <div className="pagination" unselectable="on">
                                <li onClick={this.handleClickArrowLeft} className="paginationButton">&laquo;</li>
                                    {renderPageNumbers}
                                <li onClick={this.handleClickArrowRight} className="paginationButton">&raquo;</li>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    </Row>
                </TabPane>
                
                <TabPane tabId="2">
                    <Row>
                    <Col>
                        <AddComment 
                            id={this.props.id} />
                    </Col>
                    </Row>
                </TabPane>
            </TabContent>
        </Card>
        );
    }
  }