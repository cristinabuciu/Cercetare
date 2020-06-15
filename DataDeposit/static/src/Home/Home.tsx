
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './Home.scss';
import LeftBar from "../LeftBar/LeftBar";
import { Row, Col } from 'reactstrap';
import { Container } from 'semantic-ui-react';
import Title from '../Items/Title/Title';
import Search from '../Items/Search/Search';
import SearchCard from '../Items/SearchCard';

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
}

export default class Home extends React.Component<IHomeProps, IHomeState> {
    state = {
        searchResult: [],
        numberOfCards: 0,
        isAuthenticated: false,
        shouldDisplayPagination: false,
        
        currentPage: 1,
        todosPerPage: 3
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


    setItemsForShow = (numberOfCards, numberOfCardsPerPage, searchResultItems) => {
        console.log("MARE HATZ");
        this.setState({
            numberOfCards: numberOfCards,
            searchResult: searchResultItems,
            todosPerPage: numberOfCardsPerPage,
            currentPage: 1,
            shouldDisplayPagination: true
        });
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
        if(nextPage > Math.ceil(this.state.searchResult.length / this.state.todosPerPage)) {
            nextPage = Math.ceil(this.state.searchResult.length / this.state.todosPerPage);
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
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = searchResult.slice(indexOfFirstTodo, indexOfLastTodo);

        const renderTodos = currentTodos.map((card, index) => {
          return <div key={index}>{card}</div>;
        });
    
        // Logic for displaying page numbers
        const pageNumbers = new Array();
        for (let i = 1; i <= Math.ceil(searchResult.length / todosPerPage); i++) {
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
                        
                        <LeftBar color='black' modeSearch={true}/>
                        <Col md={{ size: 3, offset: 0 }}>
                            .
                        </Col>
                        <Col md={{ size: 9, offset: 0 }}>
                            <Search setItemsForShow={this.setItemsForShow}/>
                            <hr className="hr-style" />
                            {renderTodos}
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
                </Container>
            
        );
    }
}