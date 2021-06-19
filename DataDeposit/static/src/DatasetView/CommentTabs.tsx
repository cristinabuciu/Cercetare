import axios from 'axios';
import classnames from 'classnames';
import * as React from 'react';
import { Alert, Card, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import MyTranslator from '../assets/MyTranslator';
import AddComment from "../Comment/AddComment";
import Comment from "../Comment/Comment";
import { LoaderComponent } from '../Items/Items-components';
import { SearchComments } from '../Items/Search/SearchComments';
import { CommentItem } from '../models/CommentItem';
import { SelectList } from '../models/FormItems';
import { ResponseStatus } from '../models/ResponseStatus';


export interface ICommentTabsProps {
    id: number;
}

export interface ICommentTabsState {
    activeTab: string;
    currentPage: number;
    numberOfCards: number;
    shouldDisplayPagination: boolean;
    sortBy: SelectList;
    loaderVisibility: boolean;
    resultsPerPage: number;
    comments: CommentItem[];
    responseGetStatus: ResponseStatus;
    isAuthenticated: boolean;
}

export default class CommentTabs extends React.Component<ICommentTabsProps, ICommentTabsState> {

    state = {
        activeTab: '1',
        currentPage: 1,
        numberOfCards: 0,
        resultsPerPage: 5,
        shouldDisplayPagination: false,
        sortBy: {label: "Sort By  ", value: "*"},
        loaderVisibility: false,
        responseGetStatus: {
			wasError: false,
            wasInfo: false,
			wasSuccess: false,
			responseMessage: ""
		},

        comments: [],
        isAuthenticated: false
    }

    componentDidMount(): void {
        this.state.isAuthenticated = false;
        const token = localStorage.getItem('login_user_token');
        if (token) {
            this.setState({
                isAuthenticated: true
            })
        }

        //////////// FUNCTIONS //////////////
        this.updateComments = this.updateComments.bind(this);
        this.showSearchCards = this.showSearchCards.bind(this);
        this.changeValueSort = this.changeValueSort.bind(this);
        this.receiveSearchParams = this.receiveSearchParams.bind(this);
        this.splitSort = this.splitSort.bind(this);
        this.splitSortName = this.splitSortName.bind(this);
        /////////////////////////////////////

        this.updateComments();
    }

    receiveSearchParams(resultsPerPage: number, sortBy: SelectList): void {
        this.setState({
            resultsPerPage: resultsPerPage,
            currentPage: 1,
            sortBy: sortBy
        }, () => {
            this.updateComments();
        });
    }

    setLoader (value: boolean = true): void {
        this.setState({
            loaderVisibility: value,
        });
    }

    setPagination (value: boolean = true): void {
        this.setState({
            shouldDisplayPagination: value,
        });
    }

    setNewPage(nextPage : number): void {
        this.setState({
            currentPage: nextPage
        }, () => {
            this.updateComments();
        });
    }

    splitSort(words: string): string {
        const n: Array<string> = words.split(" ");
        return n[n.length - 1];
    }

    splitSortName(words: string): string {
        const n: Array<string>  = words.split(" ");
        return n[0];
    }

    updateComments(): void {
        let responseGetStatus: ResponseStatus = {};
		const translate = new MyTranslator("Response-codes");

        this.setLoader();
        this.setPagination(false);
        axios.get( '/dataset/' + this.props.id + '/comments', {
            params: {
                currentPage: this.state.currentPage,
                resultsPerPage: this.state.resultsPerPage,
                sortBy: this.state.sortBy.value === '*' ? 'None' : this.splitSort(this.state.sortBy.value),
                sortByField: this.state.sortBy.value === '*' ? 'None' : this.splitSortName(this.state.sortBy.value),
            }
        })
        .then(response => {
            if (response.data['statusCode'] === 200) {
                responseGetStatus.wasSuccess = true;
                const numberOfCardsLen = response.data['data']['result'].length;
                responseGetStatus.wasInfo = numberOfCardsLen <= 0;
                responseGetStatus.responseMessage = translate.useTranslation("NO_REVIEWS");
                this.state.comments = response.data['data']['result'];
                this.setState({
                    numberOfCards: response.data['data']['total']
                });

                this.setPagination(!responseGetStatus.wasInfo);
            } else {
                responseGetStatus.wasError = true;
                responseGetStatus.responseMessage = translate.useTranslation(response.data['data']);
            }
        })
        .catch((error) => {
            console.log(error);
            responseGetStatus.wasError = true;
            responseGetStatus.responseMessage = translate.useTranslation("GET_DATASET_COMMENTS_ERROR");
        })
        .finally(() => {
            // always executed
            this.setState({
                responseGetStatus: responseGetStatus
            });
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

    showSearchCards(): JSX.Element[] {
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

    changeValueSort(e, comboBoxTitle, shouldUpdateNumber): void {
        this.state[comboBoxTitle] = e;
        this.forceUpdate();
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
                <NavItem className={this.state.isAuthenticated ? "" : "display-none"}>
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
                    <SearchComments receiveSearchParams={this.receiveSearchParams} />
                        {this.state.shouldDisplayPagination ? searchResult : <></>}
                        <LoaderComponent visible={this.state.loaderVisibility}/>
                        <Row className={this.state.responseGetStatus.wasInfo ? "" : "display-none"}>
                            <Col>
                                <Alert color="info" className="text-align-center">
                                    {this.state.responseGetStatus.responseMessage}
                                </Alert>
                            </Col>
                        </Row>

                        <Row className={this.state.responseGetStatus.wasError ? "" : "display-none"}>
                            <Col>
                                <Alert color="danger" className="text-align-center">
                                    {this.state.responseGetStatus.responseMessage}
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