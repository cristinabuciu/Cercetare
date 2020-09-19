import * as React from 'react';
import axios from 'axios';

import {
    Card, Label, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Input, Row, Col, Tooltip
} from 'reactstrap';
import LeftBar from "../LeftBar/LeftBar";
import DatasetViewLoading from "./DatasetViewLoading"
import DatasetViewItem from "./DatasetViewItem"
import { Container } from 'semantic-ui-react';
import { RouteComponentProps } from 'react-router';

import './DatasetView.scss';

export interface IDatasetViewProps extends RouteComponentProps {
    color: String;
    id: number;
}

export interface IDatasetViewState {
    searchResult:Array<string>;
    shoudLoad: boolean;
}

export default class DatasetView extends React.Component<IDatasetViewProps, IDatasetViewState> {

    state = {
        searchResult: [],
        shoudLoad: true
    }
    componentDidMount(): void {
        console.log("Spencer");
        const profileID = this.props.match.params['id'];
        console.log(profileID);

        axios.get( '/getItem', {
            params: {
                id: profileID
            }
        })
          .then(response => {
            console.log("AVA MAX");
            console.log(response.data);
            console.log("KINGS & QUEENS");
            
            this.setState({
                searchResult:response.data[0],
                shoudLoad: false
            });
            console.log(this.state.searchResult[7]);
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(function () {
            // always executed
          });
          this.props.history
    }

    render() {  
        return (
            <Container className="themed-container" fluid={true}>
                    <Row md="4">
                        
                        <LeftBar className='resizable-1050' modeSearch={false}/>
                        <Col md={{ size: 3, offset: 0 }}>
                            .
                        </Col>
                        <Col md="9">
                        {this.state.shoudLoad ? <DatasetViewLoading />
                        :
                        <DatasetViewItem 
                            id={this.state.searchResult[0]}
                            domain={this.state.searchResult[1]} 
                            subdomain={this.state.searchResult[2]} 
                            country={this.state.searchResult[3]} 
                            data_format={this.state.searchResult[4]} 
                            authors={this.state.searchResult[5]} 
                            year={this.state.searchResult[6]} 
                            dataset_title={this.state.searchResult[7]}
                            article_title={this.state.searchResult[8]} 
                            short_desc={this.state.searchResult[9]}
                            avg_rating={this.state.searchResult[10]}
                            gitlink={this.state.searchResult[11]}
                        />
                        }
                        </Col>
                            
                        
                    </Row>
                </Container>
        )
    }
}