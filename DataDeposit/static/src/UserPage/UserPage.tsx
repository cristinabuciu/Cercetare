import * as React from 'react';
import axios from 'axios';

import { Row, Col, Alert } from 'reactstrap';
import { Container } from 'semantic-ui-react';
import { RouteComponentProps } from 'react-router';

import { Title } from '../Items/Title/Title';
import Search from '../Items/Search/Search';
import SearchCard from '../Items/SearchCard';

import { LoaderComponent, PaginationItem } from '../Items/Items-components'
import { SearchCardItems } from '../models/SearchCardItems'
import MyTranslator from '../assets/MyTranslator'
import { DeleteMessageItem } from '../models/DeleteMessageItem'
import { IUserInfo } from './IUserInfo'
import { ResponseStatus } from '../models/ResponseStatus'

import './userpage.scss';

export interface IDatasetViewProps extends RouteComponentProps {
    color: String;
    userId: number;
}

export interface IDatasetViewState {
    searchResult: Array<SearchCardItems[]>;
    shoudLoad: boolean;

    numberOfCards: number;
    isAuthenticated: boolean;
    shouldDisplayPagination: boolean;
    currentPage: number;
    todosPerPage: number;
    loaderVisibility: boolean;

    userInfo: IUserInfo;
    responseStatusUser: ResponseStatus;
    responseGetStatus: ResponseStatus;
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

        userInfo: {
            username: "",
            country: "",
            email: "",
            privDatasets: 0,
            pubDatasets: 0,
            hasPhoto: false
        },
        responseStatusUser: {
			wasError: false,
			wasSuccess: false,
			responseMessage: ""
		},

        responseGetStatus: {
			wasError: false,
            wasInfo: false,
			wasSuccess: false,
			responseMessage: ""
		}
    }
      
    componentDidMount(): void {
        let responseStatus: ResponseStatus = {};
		const translate = new MyTranslator("Response-codes");

        axios.get( '/user/' + this.props.userId)
        .then(response => {
            if (response.data['statusCode'] === 200) {
                responseStatus.wasSuccess = true;
                this.setState({
                    userInfo: response.data['data']
                });
            } else {
                responseStatus.wasError = true;
                responseStatus.responseMessage = translate.useTranslation(response.data['data']);
            }
        })
        .catch((error) => {
            console.log(error);
            responseStatus.wasError = true;
            responseStatus.responseMessage = translate.useTranslation("GET_USER_INFO_ERROR");
        })
        .finally(() => {
            // always executed
            this.setState({
                responseStatusUser: responseStatus
            });
        });

        //////////// FUNCTIONS //////////////
        this.handleDelete = this.handleDelete.bind(this);
        this.handleClickOnNumber = this.handleClickOnNumber.bind(this);
        this.createPageNumberArray = this.createPageNumberArray.bind(this);
        this.handleClickDots = this.handleClickDots.bind(this);
        this.setItemsForShow = this.setItemsForShow.bind(this);
    }

    handleClickDots(event): void {}

    async handleDelete(id: number): Promise<DeleteMessageItem> {
        let returnMessage: DeleteMessageItem = {};
        const translate = new MyTranslator("Response-codes");

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


    setItemsForShow(numberOfCards: number, numberOfCardsPerPage: number, searchResultItems: Array<SearchCardItems[]>, searchWasPressed: boolean = false, responseStatus: ResponseStatus): void {
        console.log("CEL MAI MARE HATZ");

        this.setState({
            numberOfCards: numberOfCards,
            searchResult: searchResultItems,
            todosPerPage: numberOfCardsPerPage,
            currentPage: searchWasPressed ? 1 : this.state.currentPage,
            shouldDisplayPagination: responseStatus.wasError || responseStatus.wasInfo ? false : true,
            loaderVisibility: false,
            responseGetStatus: responseStatus
        });
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
            responseGetStatus: {
                wasError: false,
                wasInfo: false,
                wasSuccess: false,
                responseMessage: ""
            }
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
                            : <img src={'/content/images/profilePicture/default.png'} />}
                            
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
                                <Row className={this.state.responseGetStatus.wasError ? "" : "display-none"}>
                                    <Col>
                                        <Alert color="danger" className="text-align-center">
                                            {this.state.responseGetStatus.responseMessage}
                                        </Alert>
                                    </Col>
                                </Row>

                                <Row className={this.state.responseGetStatus.wasInfo ? "" : "display-none"}>
                                    <Col>
                                        <Alert color="info" className="text-align-center">
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
                            </>
                            }
                        </Col>
                    </Row>
                </Container>
            
        );
    }

}