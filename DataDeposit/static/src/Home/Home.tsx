
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './Home.scss';
import LeftBar from "../LeftBar/LeftBar";
import { Row, Col, Alert } from 'reactstrap';
import { Container } from 'semantic-ui-react';
import Title from '../Items/Title/Title';
import Search from '../Items/Search/Search';
import SearchCard from '../Items/SearchCard';
import {LoaderComponent} from '../Items/Items-components'

export interface IHomeProps {
    greeting: string;
}

export interface IHomeState {
    searchResult:Array<Array<string>>;
    numberOfCards: number;
    isAuthenticated: boolean;
    shouldDisplayPagination: boolean;
    currentPage: number;
    todosPerPage: number;
    loaderVisibility: boolean;
    wasError: boolean;
    wasInfo: boolean;
}

export default class Home extends React.Component<IHomeProps, IHomeState> {
    state = {
        searchResult: [],
        numberOfCards: 0,
        isAuthenticated: false,
        shouldDisplayPagination: false,
        
        currentPage: 1,
        todosPerPage: 3,
        loaderVisibility: false,
        wasError: false,
        wasInfo: false
    };

    componentDidMount() {
        this.state.isAuthenticated = false;
        const token = localStorage.getItem('login_user_token');
        console.log(token);
        
        if(token) {
            console.log("INTRA PE AICI");
            this.state.isAuthenticated = true;
        }
    }


    setItemsForShow = (numberOfCards, numberOfCardsPerPage, searchResultItems, searchWasPressed = false, itWasAnError = false, itWasAnInfo = false) => {
        console.log("CEL MAI MARE HATZ");
        if (itWasAnError) {
            this.setState({
                shouldDisplayPagination: false,
                wasError: true
            });

            return;
        }
        // debugger;
        if (itWasAnInfo) {
            this.setState({
                shouldDisplayPagination: false,
                wasInfo: true
            });

            return;
        }

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
        
        console.log(this.state)
    }

    showSearchCards() {
        console.log("JOHNULE!!!");
        console.log(this.state.searchResult);
        let cards = this.state.searchResult.map(item => (
            <Row>
                <Col>
                    <SearchCard
                        id={item[0]}
                        domain={item[1]} 
                        subdomain={item[2]} 
                        country={item[3]} 
                        data_format={item[4]} 
                        authors={item[5]} 
                        year={item[6]} 
                        dataset_title={item[7]}
                        article_title={item[8]} 
                        short_desc={item[9]}
                        avg_rating={item[10]}
                        gitlink={item[11]}
                        downloadPath={item[13]}
                        shouldHaveDownloadButton={item[12] === 1 || item[12] === 3 }
                        shouldHaveDownloadLink={item[12] === 1}
                        owner={item[14]}
                        privateItem={item[15]}
                    />
                </Col>
            </Row>
          )
        )

        return cards;
    }

    handleClick = (event) => {
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
        }
        this.setState({
            currentPage: nextPage
        });
    }

    handleClickArrowRight = (event) => {
        let nextPage = this.state.currentPage + 1;
        if(nextPage > Math.ceil(this.state.numberOfCards / this.state.todosPerPage)) {
            nextPage = Math.ceil(this.state.numberOfCards / this.state.todosPerPage);
        }
        this.setState({
            currentPage: nextPage
        });
    }

    render() {
        const paddingTop = '60px';
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
        const pageNumbers = new Array();
        for (let i = 1; i <= Math.ceil(this.state.numberOfCards / todosPerPage); i++) {
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
                        <Col md={{ size: 3, offset: 0 }}>
                            .
                        </Col>
                        <Col md={{ size: 9, offset: 0 }}>
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