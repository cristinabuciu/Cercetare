import * as React from 'react';
import MyTranslator from '../assets/MyTranslator'

import './searchpage.scss';
import LeftBar from "../LeftBar/LeftBar";
import { Row, Col, Alert } from 'reactstrap';
import { Container } from 'semantic-ui-react';
import { Title } from '../Items/Title/Title';
import Search from '../Items/Search/Search';
import SearchCard from '../Items/SearchCard';
import { LoaderComponent, PaginationItem } from '../Items/Items-components'
import { SearchCardItems } from '../models/SearchCardItems'
import { ResponseStatus } from '../models/ResponseStatus'

export interface ISearchPageProps {
    greeting: string;
}

export interface ISearchPageState {
    searchResult: Array<SearchCardItems[]>;
    numberOfCards: number;
    isAuthenticated: boolean;
    shouldDisplayPagination: boolean;
    currentPage: number;
    todosPerPage: number;
    loaderVisibility: boolean;
    responseStatus: ResponseStatus;
}

export default class SearchPage extends React.Component<ISearchPageProps, ISearchPageState> {
    state: ISearchPageState = {
        searchResult: [],
        numberOfCards: 0,
        isAuthenticated: false,
        shouldDisplayPagination: false,
        
        currentPage: 1,
        todosPerPage: 3,
        loaderVisibility: false,

        responseStatus: {
			wasError: false,
			wasSuccess: false,
			responseMessage: ""
		}
    };

    componentDidMount(): void {
        this.state.isAuthenticated = false;
        const token = localStorage.getItem('login_user_token');
        console.log(token);
        
        if(token) {
            this.state.isAuthenticated = true;
        }

        //////////////////// FUNCTIONS /////////////////////
        this.handleClickArrowLeft = this.handleClickArrowLeft.bind(this);
        this.handleClickArrowRight = this.handleClickArrowRight.bind(this);
        this.handleClickOnNumber = this.handleClickOnNumber.bind(this);
        this.setItemsForShow = this.setItemsForShow.bind(this);
        this.createPageNumberArray = this.createPageNumberArray.bind(this);
        this.handleClickOnNumber = this.handleClickOnNumber.bind(this);
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
            responseStatus: responseStatus
        });
    }

    showSearchCards(): JSX.Element[] {
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
                        shouldHaveDelete={false}
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

    handleLoaderChange = (visible: boolean) => {
        this.setState({
            loaderVisibility: visible,
            responseStatus: {
                wasError: false,
                wasInfo: false,
                wasSuccess: false,
                responseMessage: ""
            }
        });
    }

    handleClickArrowLeft(event): void {
        let nextPage = this.state.currentPage - 1;
        if(nextPage < 1) {
            return;
        }
        
        this.setState({
            currentPage: nextPage
        });
    }

    handleClickArrowRight(event): void {
        let nextPage = this.state.currentPage + 1;
        if(nextPage > Math.ceil(this.state.numberOfCards / this.state.todosPerPage)) {
            return;
        }

        this.setState({
            currentPage: nextPage
        });
    }

    handleClickDots(event): void {}

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
        const currentPage = this.state.currentPage;
        const todosPerPage = this.state.todosPerPage;
  
        // Logic for displaying todos
        // const indexOfLastTodo = currentPage * todosPerPage;
        // const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        // const currentTodos = searchResult.slice(indexOfFirstTodo, indexOfLastTodo);

        // PAGINARE IN FRONTEND
        // const renderTodos = currentTodos.map((card, index) => {
        //   return <div key={index}>{card}</div>;
        // });
    
        // Logic for displaying page numbers
        const renderPageNumbers = this.createPageNumberArray();
        const translate = new MyTranslator("SearchPage");
        
        return (
                //  <button onClick={() => this.setState({count: this.state.count+1})}>
                //     This button has been clicked {this.state.count} times.
                // </button> 
                <Container className="themed-container" fluid={true}>
                    <Row lg="12">
                        <Title titleSet={this.props.greeting}/>
                    </Row>
                    <Row md="4">
                        
                        <LeftBar 
                            className='resizable-1050' 
                            modeSearch={true}/>
                        <Col md={{ size: 2, offset: 0 }}>
                            .
                        </Col>
                        <Col md={{ size: 10, offset: 0 }}>
                            <Search 
                                setItemsForShow={this.setItemsForShow}
                                currentPage={this.state.currentPage}
                                handleLoaderChange={this.handleLoaderChange}
                            />
                            <hr className="hr-style" />
                            {this.state.loaderVisibility ? <LoaderComponent visible={this.state.loaderVisibility}/>
                            : 
                            <>
                                {searchResult}
                                <Row className={this.state.responseStatus.wasError ? "" : "display-none"}>
                                    <Col>
                                        <Alert color="danger" className="text-align-center">
                                            {this.state.responseStatus.responseMessage}
                                        </Alert>
                                    </Col>
                                </Row>
                                <Row className={this.state.responseStatus.wasInfo ? "" : "display-none"}>
                                    <Col>
                                        <Alert color="info" className="text-align-center">
                                            {this.state.responseStatus.responseMessage}
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