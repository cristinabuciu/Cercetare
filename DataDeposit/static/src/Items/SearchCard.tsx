import * as React from 'react';
import axios from 'axios';

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

    shouldHaveDelete: boolean;
}


export interface ISearchCardState {
    setTooltipOpen: boolean;
    ratingAvgValue: number;
    uploadedFileLink: string;

    disabledDeleteButton: boolean;
    deleteButtonText: string;
}

export default class SearchCard extends React.Component<ISearchCardProps, ISearchCardState> {

    state: ISearchCardState = {
        setTooltipOpen: false,
        ratingAvgValue: 4.58,
        uploadedFileLink: '',

        disabledDeleteButton: false,
        deleteButtonText: "Delete"
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

        /////////////// FUNCTIONS /////////////////
        this.deleteItem = this.deleteItem.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
    }

    deleteItem () {
        this.setState({
            disabledDeleteButton: true,
            deleteButtonText: "Deleting..."
        });

        axios.delete( '/dataset/' + this.props.id)
          .then(response => {
            console.log("Carolina");
            console.log(response.data);
            console.log("Jambala");
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(function () {
            // always executed
          }); 
    }

    handleDownload(): boolean {
        debugger;
        axios.put( '/dataset/' + this.props.id + '/downloads')
        .then(response => {})
        .catch(function (error) {
            console.log(error);
            return false;
        });

        window.open(this.props.downloadPath, "_blank");
        return true;
    }
  
    render() {  

      return (
        <Card className="margin-top-20 z-depth-hoverable">
            <Row>
                <Col xs="0" md="0" lg="1" className="resizable-1050"> 
                     <Label for="titluDataset" className="label-format">Title:</Label>
                 </Col>
                 <Col xs="6" lg="8">
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
                 {this.props.shouldHaveDelete ?
                    <></>
                    :
                    <Col className="spanSpecial">
                    <FontAwesomeIcon icon={faUser} /> {this.props.owner}
                    </Col>
                 }
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
                        <div className="resource-download" onClick={this.handleDownload}><FontAwesomeIcon icon={faLink} /> Download Link</div>
                        :
                        <div className="resource-download" onClick={this.handleDownload}><FontAwesomeIcon icon={faDatabase} /> Download File</div>
                    }</>
                    :
                    <>No download</>
                    }
                    
                </Col>
                {this.props.shouldHaveDelete ?
                    <Col className="spanSpecial resizable-1350 text-align-right">
                        <Button 
                            color="danger" 
                            disabled={this.state.disabledDeleteButton} 
                            onClick={this.deleteItem}>{this.state.deleteButtonText}</Button>{' '}
                    </Col>
                    :
                    <></>
                 }
             </Row>
            </Card>
        
      )
    }

}