
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
    count:number;
    searchResult:Array<Array<string>>;
    numberOfCards: number;
}

export default class Home extends React.Component<IHomeProps, IHomeState> {
    state = {
        count: 0,
        searchResult: [],
        numberOfCards: 0
    };


    setItemsForShow = (numberOfCards, numberOfCardsPerPage, searchResultItems) => {
        console.log("MARE HATZ");
        this.setState({
            numberOfCards: numberOfCards,
            searchResult: searchResultItems
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
                    />
                </Col>
            </Row>
          )
        )

        return cards;
    }

    render() {
        const paddingTop = '60px';
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
                            {this.showSearchCards()}
                        </Col>
                        
                    </Row>
                </Container>
            
        );
    }
}