import * as React from 'react';
import axios from 'axios';
import MyTranslator from '../assets/MyTranslator'

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
    comments: any;
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
        sortByList: ['# TODO'],
        loaderVisibility: false,

        comments: []
            // {id: 1, value: 3.5, author: "landiggity", title: "Hatz", body: "This is my first comment on this forum so don't be rude", date: "20-10-2020"},
            // {id: 2, value: 1, author: "scarlett-jo", title: "Inoanta Chelutu", body: "That's a mighty fine comment you've got there my good looking fellow...", date: "20-10-2020"},
            // {id: 3, value: 4, author: "rosco", title: "Swalala", body: "What is the meaning of all of this 'React' mumbo-jumbo?", date: "20-10-2020"}
    }

    componentDidMount() {
        this.updateComments = this.updateComments.bind(this);
        this.updateComments();
    }

    setLoader (value = true) {
        this.setState({
            loaderVisibility: value,
        });
    }

    setPagination (value = true) {
        this.setState({
            shouldDisplayPagination: value,
        });
    }

    setNewPage (nextPage : number) {
        this.setState({
            currentPage: nextPage
        }, () => {
            this.updateComments();
        });
    }

    updateComments() {
        this.setLoader();
        this.setPagination(false);
        axios.get( '/dataset/' + this.props.id + '/comments', {
            params: {
                currentPage: this.state.currentPage,
                resultsPerPage: this.state.resultsPerPage
            }
        })
          .then(response => {
            const numberOfCardsLen = response.data.length;
            if (numberOfCardsLen > 0) {
                this.state.comments = response.data['results']
                this.setState({
                    numberOfCards: response.data['length'],
                    wasInfo: false,
                    wasError: false
                });
                this.setPagination();
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
            this.setLoader(false);
        });
    }

    handleClickArrowLeft = (event) => {
        let nextPage = this.state.currentPage - 1;
        if(nextPage < 1) {
            nextPage = 1;
            return;
        } else {
            this.setNewPage(nextPage);
        }
    }

    handleClickArrowRight = (event) => {
        let nextPage = this.state.currentPage + 1;
        if(nextPage > Math.ceil(this.state.numberOfCards / this.state.resultsPerPage)) {
            nextPage = Math.ceil(this.state.numberOfCards / this.state.resultsPerPage);
            return;
        } else {
            this.setNewPage(nextPage);
        }
    }

    handleClick = (event) => {
        if (this.state.currentPage === Number(event.target.id)) {
            return;
        }

        this.setNewPage(Number(event.target.id));
    }
    
    switchTabs = (tab) => {
        if(this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });

            if (tab === '1') {
                this.setNewPage(1);
            }
        }
    }

    showSearchCards() {
        console.log("JOHNULE!!!");
        console.log(this.state.comments);
        let cards = this.state.comments.map(item => (
            <Comment 
                id={item['id']}
                datasetID={item['datasetID']}
                value={item['rating']}
                author={item['username']}
                title={item['commentTitle']}
                body={item['commentBody']}
                date={new Date(item['createdAt'] * 1000).toLocaleDateString('en-GB')}
                updateComments={this.updateComments} />
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

        const translate = new MyTranslator("Comment");

        return (
        <Card>
            <Nav tabs className="margin-top-5 margin-bottom-5">
                <NavItem>
                    <NavLink
                        className={classnames({ active: this.state.activeTab === '1' })}
                        onClick={ () => this.switchTabs('1') }>
                        {translate.useTranslation("all-comments")}
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: this.state.activeTab === '2' })}
                        onClick={ () => this.switchTabs('2') }>
                        {translate.useTranslation("add-comment")}
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

                        {this.state.shouldDisplayPagination ? searchResult : <></>}
                        <LoaderComponent visible={this.state.loaderVisibility}/>
                        <Row className={this.state.wasInfo ? "" : "display-none"}>
                            <Col>
                                <Alert color="info" className="text-align-center">
                                    {translate.useTranslation("no-reviews")}
                                </Alert>
                            </Col>
                        </Row>

                        <Row className={this.state.wasError ? "" : "display-none"}>
                            <Col>
                                <Alert color="danger" className="text-align-center">
                                    {translate.useTranslation("error-reviews")}
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