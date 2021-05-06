import * as React from 'react';
import axios from 'axios';

import {
    Card, Label, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Input, Row, Col, Tooltip, Alert
} from 'reactstrap';
import LeftBar from "../LeftBar/LeftBar";
import { Container } from 'semantic-ui-react';
import { RouteComponentProps } from 'react-router';

import { Title } from '../Items/Title/Title';
import Search from '../Items/Search/Search';
import SearchCard from '../Items/SearchCard';

import { LoaderComponent, PaginationItem } from '../Items/Items-components'
import { SearchCardItems } from '../models/SearchCardItems'
import MyTranslator from '../assets/MyTranslator'
import { DeleteMessageItem } from '../models/DeleteMessageItem'

import './userpage.scss';

export interface IDatasetViewProps extends RouteComponentProps {
    color: String;
    userId: number;
}

export interface IDatasetViewState {
    searchResult:Array<string>;
    shoudLoad: boolean;

    numberOfCards: number;
    isAuthenticated: boolean;
    shouldDisplayPagination: boolean;
    currentPage: number;
    todosPerPage: number;
    loaderVisibility: boolean;
    wasError: boolean;
    wasInfo: boolean;

    userInfo: {
        username: string;
        country: string;
        email: string;
        privDatasets: number;
        pubDatasets: number;
        hasPhoto: boolean;
    }
}

export default class DatasetView extends React.Component<IDatasetViewProps, IDatasetViewState> {

    state = {
        searchResult: [],
        shoudLoad: true,

        numberOfCards: 0,
        isAuthenticated: false,
        shouldDisplayPagination: false,
        
        currentPage: 1,
        todosPerPage: 3,
        loaderVisibility: false,
        wasError: false,
        wasInfo: false,

        userInfo: {
            username: "",
            country: "",
            email: "",
            privDatasets: 0,
            pubDatasets: 0,
            hasPhoto: false
        }
    }
      
    componentDidMount(): void {
        axios.get( '/user/' + this.props.userId)
          .then(response => {
            this.setState({
                userInfo: response.data
            });

          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            // always executed
        });

        //////////// FUNCTIONS //////////////
        this.handleDelete = this.handleDelete.bind(this);
        this.handleClickOnNumber = this.handleClickOnNumber.bind(this);
        this.createPageNumberArray = this.createPageNumberArray.bind(this);
        this.handleClickDots = this.handleClickDots.bind(this);
    }

    handleClickDots(event): void {}

    async handleDelete(id: number): Promise<DeleteMessageItem> {
        let returnMessage: DeleteMessageItem = {};
        const translate = new MyTranslator("Error-codes");

        await axios.delete( '/dataset/' + id)
        .then(response => {
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
            returnMessage.message = translate.useTranslation("DELETE_DATASET_ERROR");
        })
        .finally(() => {
            // always executed
        });
        debugger;
        return returnMessage;
    }


    setItemsForShow = (numberOfCards, numberOfCardsPerPage, searchResultItems, searchWasPressed = false, itWasAnError = false, itWasAnInfo = false) => {
        console.log("CEL MAI MARE HATZ");

        if (searchWasPressed) {
            this.setState({
                numberOfCards: numberOfCards,
                searchResult: searchResultItems,
                todosPerPage: numberOfCardsPerPage,
                currentPage: 1,
                shouldDisplayPagination: true,
                loaderVisibility: false
            });
        } else {
            this.setState({
                numberOfCards: numberOfCards,
                searchResult: searchResultItems,
                todosPerPage: numberOfCardsPerPage,
                shouldDisplayPagination: true,
                loaderVisibility: false
            });
        }

        if (itWasAnInfo) {
            this.setState({
                shouldDisplayPagination: false,
                wasInfo: true
            });

            // return;
        }

        if (itWasAnError) {
            this.setState({
                shouldDisplayPagination: false,
                wasError: true
            });
        }
        
        console.log(this.state)
    }

    showSearchCards(): JSX.Element[]  {
        console.log("JOHNULE!!!");
        console.log(this.state.searchResult);
        let cards: JSX.Element[] = this.state.searchResult.map((item: Array<SearchCardItems>) => (
            <Row>
                <Col>
                    <SearchCard
                        id={item['id']}
                        domain={item['domain']} 
                        subdomain={item['tags']} 
                        country={item['country']} 
                        data_format={item['data_format']} 
                        authors={item['authors']} 
                        year={item['year']} 
                        dataset_title={item['dataset_title']}
                        article_title={item['article_title']} 
                        short_desc={item['short_desc']}
                        avg_rating={item['avg_rating_value']}
                        gitlink={item['gitlink']}
                        downloadPath={item['downloadPath']}
                        shouldHaveDownloadButton={item['resourceType'] === 'EXTERNAL' || item['resourceType'] === 'INTERNAL' }
                        shouldHaveDownloadLink={item['resourceType'] === 'EXTERNAL'}
                        owner={item['owner']}
                        privateItem={item['private']}
                        shouldHaveDelete={true}
                        handleDelete={this.handleDelete}
                    />
                </Col>
            </Row>
          )
        )
        return cards;
    }

    handleClickOnNumber(event): void {
        this.setState({
            currentPage: Number(event.target.id)
            
        });
    }
    
    handleLoaderChange = (visible) => {
        console.log("UNGURICA");
        this.setState({
            loaderVisibility: visible,
            wasError: false,
            wasInfo: false
        });
    }


    handleClickArrowLeft = (event) => {
        let nextPage = this.state.currentPage - 1;
        if(nextPage < 1) {
            nextPage = 1;
            return;
        }
        
        this.setState({
            currentPage: nextPage
        });
    }

    handleClickArrowRight = (event) => {
        let nextPage = this.state.currentPage + 1;
        if(nextPage > Math.ceil(this.state.numberOfCards / this.state.todosPerPage)) {
            nextPage = Math.ceil(this.state.numberOfCards / this.state.todosPerPage);
            return;
        }

        this.setState({
            currentPage: nextPage
        });
    }

    createPageNumberArray(): JSX.Element[] {
        let pageNumbers: Array<any> = new Array<any>();
        const todosPerPage: number = this.state.todosPerPage;
        const numberOfPages: number = Math.ceil(this.state.numberOfCards / todosPerPage);

        // LEFT SIDE
        pageNumbers.push(1);
        if (this.state.currentPage - 3 > 1) {
            pageNumbers.push('...');
        }

        // MIDDLE SIDE
        for (let i: number = this.state.currentPage - 2; i <= this.state.currentPage + 2; i++) {
            if (i < 2 || i > numberOfPages - 1) {
                continue;
            }
            pageNumbers.push(i);
        }

        // RIGHT SIDE
        if (this.state.currentPage + 3 < numberOfPages) {
            pageNumbers.push('...');
        }
        
        if (numberOfPages > 1) {
            pageNumbers.push(numberOfPages);
        }

        const renderPageNumbers: JSX.Element[] = pageNumbers.map((number: any) => {
            return (
            <PaginationItem
                number={number}
                disabled={number === '...'}
                active={this.state.currentPage === number}
                handleClick={number === '...' ? this.handleClickDots : this.handleClickOnNumber}
                value={number}
            />
            );
        });
        
        return renderPageNumbers;
    }

    render() {
        const searchResult = this.showSearchCards();
        const renderPageNumbers = this.createPageNumberArray();

        const translate = new MyTranslator("UserPage");
        return (
                //  <button onClick={() => this.setState({count: this.state.count+1})}>
                //     This button has been clicked {this.state.count} times.
                // </button> 
                <Container className="themed-container" >
                    <Row md="4">
                        <Col className="profile-picture text-align-left" md={{ size: 2, offset: 0 }}>
                            {this.state.userInfo.hasPhoto 
                            ? <img src={'static/dist/content/images/profilePicture/' + this.props.userId + "_avatar.jpg"} />
                            : <img src={'static/dist/content/images/profilePicture/default.png'} />}
                            
                            <Row className="user-info text-align-center padding-top-20">
                                <Col className="text-align-left"><h3>Username:</h3></Col>
                                <Col className="text-align-right"><h3>{this.state.userInfo.username}</h3></Col>
                            </Row>
                            <Row className="user-info text-align-center">
                                <Col className="text-align-left"><h3>Country:</h3></Col>
                                <Col className="text-align-right"><h3>{this.state.userInfo.country}</h3></Col>
                            </Row>
                            <Row className="user-info text-align-center">
                                <Col className="text-align-left"><h3>Email:</h3></Col>
                                <Col className="text-align-right"><h3>{this.state.userInfo.email}</h3></Col>
                            </Row>
                            <Row className="user-info text-align-center">
                                <Col className="text-align-left"><h3>Public datasets:</h3></Col>
                                <Col className="text-align-right"><h3>{this.state.userInfo.pubDatasets}</h3></Col>
                            </Row>
                            <Row className="user-info text-align-center">
                                <Col className="text-align-left"><h3>Private datasets:</h3></Col>
                                <Col className="text-align-right"><h3>{this.state.userInfo.privDatasets}</h3></Col>
                            </Row>
                        </Col>
                        
                        <Col md={{ size: 2, offset: 0 }}>
                            .
                        </Col>
                        <Col md={{ size: 10, offset: 0 }}>
                            <Title className="user-page-title margin-bottom-20" titleSet={"Welcome, " +this.state.userInfo.username} />
                            <Search 
                                setItemsForShow={this.setItemsForShow}
                                currentPage={this.state.currentPage}
                                handleLoaderChange={this.handleLoaderChange}
                                userId={this.props.userId}
                            />
                            <hr className="hr-style" />
                            {this.state.loaderVisibility ? <LoaderComponent visible={this.state.loaderVisibility}/>
                            : 
                            <>
                                {searchResult}
                                <Row className={this.state.wasError ? "" : "display-none"}>
                                    <Col>
                                        <Alert color="danger" className="text-align-center">
                                            There was an error at search !
                                        </Alert>
                                    </Col>
                                </Row>

                                <Row className={this.state.wasInfo ? "" : "display-none"}>
                                    <Col>
                                        <Alert color="info" className="text-align-center">
                                            No items found !
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
                            </>
                            }
                        </Col>
                    </Row>
                </Container>
            
        );
    }

}