import * as React from 'react';

import {
    Card, Label, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Input, Row, Col, Tooltip
  } from 'reactstrap';
import ReactStars from "react-rating-stars-component";
import StarRatings from 'react-star-ratings';
import { faStar, faStarHalf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {LoaderComponent} from '../Items/Items-components'

import Title from '../Items/Title/Title';

import './DatasetView.scss';

export interface IDatasetViewLoadingProps {
    id: number;
    domain: string;
    subdomain: Array<String> 
    country: string;
    data_format: string; 
    authors: Array<String>;
    year: string;
    dataset_title: string;
    article_title: string; 
    short_desc: string;
    avg_rating: number;
    gitlink: string;
}

export interface IDatasetViewLoadingState {
    rating: number;
    shouldGiveRating: boolean;
    shouldDisplayLoading: boolean;
}

export default class DatasetViewLoading extends React.Component<IDatasetViewLoadingProps, IDatasetViewLoadingState> {
    state = {
        rating: 0,
        shouldGiveRating: true,
        shouldDisplayLoading: true
    }

    onStarClick(newRating) {
        console.log("EMINEM");
        if (this.state.shouldGiveRating) {
            this.setState({
                rating: newRating
            });
            console.log(newRating);
        }
    }

    onSubmitRating = () => {
        console.log("GTA V");
        this.setState({
            shouldGiveRating: false
        });
        
    }

    render() {  

        return (
            <Col md={{ size: 9, offset: 0 }}>
                <Title className="margin-top-50 margin-bottom-10p" titleSet={this.props.dataset_title}/>
                
                <Col className="text-align-center">
                    <Card style={{ width: '18rem' }}>
                        <CardBody>
                            <Row><Col>
                            <div>
                            <ReactStars
                                count={5}
                                classNames="star-size"
                                onChange={this.onStarClick.bind(this)}
                                size={35}
                                edit={this.state.shouldGiveRating}
                                isHalf={true}
                                emptyIcon={<i className="far fa-star"></i>}
                                halfIcon={<FontAwesomeIcon icon={faStarHalf} />}
                                fullIcon={<FontAwesomeIcon icon={faStar} />}
                                activeColor="#ffd700"
                                a11y={true}
                            />
                            
                            </div>
                            {this.state.shouldGiveRating ? <Button color="primary" outline className="rating-button-size" onClick={() => this.onSubmitRating()}>
                                <FontAwesomeIcon className="margin-right-5" icon={faStar} />
                                Send Rating
                            </Button> :
                            this.state.shouldDisplayLoading ? 
                                <LoaderComponent 
                                    visible={this.state.shouldDisplayLoading}
                                    height="30"
                                    width="30" /> :
                            "Thank you ! :)"
                            }
                            </Col></Row>
                        </CardBody>
                    </Card>
                </Col>

            </Col>
        )
    }
}