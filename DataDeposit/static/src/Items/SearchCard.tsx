import * as React from 'react';

import {
    Card, Label, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Input, Row, Col, Tooltip
  } from 'reactstrap';
import { faLink, faDownload, faPortrait, faCalendar, faUser, faFile, faNewspaper, faGlobe, faDatabase, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {ModalQuickView} from './Items-components'
import "../style_home.scss";
import StarRatings from 'react-star-ratings';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import "./items.scss"
 
import { translate, Translate } from 'react-jhipster';

export interface ISearchCardProps {
    id: number;
    privateItem: boolean;
    domain: string;
    subdomain: Array<String> 
    country: string;
    data_format: string; 
    authors: Array<String>;
    year: string;
    dataset_title: string;
    article_title?: string; 
    short_desc: string;
    avg_rating: number;
    gitlink?: string;
    downloadPath: string;
    shouldHaveDownloadButton: boolean;
    shouldHaveDownloadLink: boolean;
    owner: string;
}


export interface ISearchCardState {
    setTooltipOpen: boolean;
    ratingAvgValue: number;
    uploadedFileLink: string;
}

export default class SearchCard extends React.Component<ISearchCardProps, ISearchCardState> {

    state = {
        setTooltipOpen: false,
        ratingAvgValue: 4.58,
        uploadedFileLink: ''
    }


    tooltipOpen(value) {
        this.setState ({
            setTooltipOpen: value
        });
    }

    openPdf() {
        const user = localStorage.getItem('login_user_token');
        if(user) {
            console.log("INTRA PE AICI in SEARCH CARD");
            window.open('static/dist/uploadPdfs/' + user + '.pdf', '_blank');
        }
        
    }

    componentDidMount() {
        const user = localStorage.getItem('login_user_token');
        if(user) {
            this.setState({
                uploadedFileLink: 'static/dist/uploadDataset/' + user + '_dataset.zip'
            });
        }
    }
  
    render() {  

      return (
        <Card className="margin-top-20 z-depth-hoverable">
            <Row>
                <Col xs="0" md="0" lg="2" className="resizable-1050"> 
                     <Label for="titluDataset" className="label-format">Dataset title:</Label>
                 </Col>
                 <Col xs="6" lg="7">
                     <NavLink tag={Link} to={'/datasetView/' + this.props.id}>{this.props.dataset_title}</NavLink>
                 </Col>
                 <Col xs="2" lg="1" className="text-align-right">
                    <ModalQuickView 
                        id={this.props.id}
                        privateItem={this.props.privateItem}
                        buttonLabel="Quick"
                        domain={this.props.domain}
                        subdomain={this.props.subdomain}
                        country={this.props.country}
                        data_format={this.props.data_format}
                        year={this.props.year}
                        short_desc={this.props.short_desc}
                        avg_rating={this.props.avg_rating}
                        owner={this.props.owner}
                        modalTitle={this.props.dataset_title}
                        authors={this.props.authors}
                        downloadType={this.props.shouldHaveDownloadButton ? 
                            <>{
                                this.props.shouldHaveDownloadLink ? 
                                <><a target="_blank" href={this.props.downloadPath}><FontAwesomeIcon icon={faLink} />Download Link</a></>
                                :
                                <span><FontAwesomeIcon icon={faDatabase} />  Download File</span>
                            }</>
                            :
                            <>No download</>
                            }
                        buttonClassName="quick-view-button" />
                </Col>
                <Col xs="4" lg="2">
                <div id="TooltipStars">
                    <StarRatings
                        rating={this.props.avg_rating}
                        starDimension="19px"
                        starSpacing="3px"
                        numberOfStars={5}
                        starRatedColor="gold"
                        name='rating'
                    />
                    </div>
                </Col>
                
             </Row>
             <Row className="padding-top-10">
                 <Col className="spanSpecial resizable-1350">
                 <FontAwesomeIcon icon={faCalendar} /> {this.props.year}
                 </Col>
                 <Col className="spanSpecial">
                 <FontAwesomeIcon icon={faUser} /> {this.props.owner}
                 </Col>
                 <Col className="spanDomain">
                 <FontAwesomeIcon icon={faNewspaper} /> {this.props.domain}
                 </Col>
                 <Col className="spanSpecial resizable-1350">
                 <FontAwesomeIcon icon={faFile} /> {this.props.data_format}
                 </Col>
                 <Col className="spanSpecial resizable-1350">
                 <FontAwesomeIcon icon={faGlobe} /> {this.props.country}
                 </Col>
                <Col className="spanSpecial">
                    {this.props.shouldHaveDownloadButton ? 
                    <>{
                        this.props.shouldHaveDownloadLink ? 
                        <><FontAwesomeIcon icon={faLink} /> Download Link</>
                        :
                        <><FontAwesomeIcon icon={faDatabase} /> Download File</>
                    }</>
                    :
                    <>No download</>
                    }
                    
                </Col>
             </Row>
            </Card>
        
      )
    }

}