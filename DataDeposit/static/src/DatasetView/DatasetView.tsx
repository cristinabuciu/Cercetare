import * as React from 'react';
import axios from 'axios';

import { Row, Col } from 'reactstrap';
import LeftBar from "../LeftBar/LeftBar";
import DatasetViewLoading from "./DatasetViewLoading"
import DatasetViewItem from "./DatasetViewItem"
import { Container } from 'semantic-ui-react';
import { RouteComponentProps } from 'react-router';

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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

        axios.get( '/dataset/' + profileID)
          .then(response => {
            console.log("AVA MAX");
            console.log(response.data);
            console.log("KINGS & QUEENS");
            this.setState({
                searchResult:response.data[0],
                shoudLoad: false
            });
            debugger;
            console.log(this.state.searchResult[7]);
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(function () {
            // always executed
          });

          this.goBack = this.goBack.bind(this);

    }

    goBack(): void {
        window.history.back();
    }

    render() {  
        return (
            <Container className="themed-container" fluid={true}>
                    <Row className="container-inside">
                        
                        <LeftBar className='resizable-1050' modeSearch={false}/>
                        <Col sm="2" className="text-align-right">
                            <FontAwesomeIcon className="about-edit-button" icon={faArrowLeft} onClick={this.goBack} size="3x" />
                        </Col>
                        <Col md="10">
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
                            owner={this.state.searchResult[12]}
                            downloadType={''}
                            lastUpdatedAt={this.state.searchResult[13]}

                            shouldHaveDownloadButton={this.state.searchResult[14] === 1 || this.state.searchResult[14] === 3 }
                            shouldHaveDownloadLink={this.state.searchResult[14] === 1}
                            downloadPath={this.state.searchResult[15]}

                            dataIntegrity={this.state.searchResult[16]}
                            continuityAccess={this.state.searchResult[17]}
                            dataReuse={this.state.searchResult[18]}

                            views={this.state.searchResult[19]}
                            ratings={this.state.searchResult[20]}
                            updates={this.state.searchResult[21]}
                            downloads={this.state.searchResult[22]}
                            hasPhoto={this.state.searchResult[23]}
                        />
                        }
                        </Col>
                            
                        
                    </Row>
                </Container>
        )
    }
}