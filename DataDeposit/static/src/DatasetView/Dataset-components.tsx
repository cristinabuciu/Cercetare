import './DatasetView.scss';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faStar, faPortrait, faCalendar, faUser, faFile, faFileDownload, faGlobe, faDatabase, faEye, faTags, faFemale, faFlag } from "@fortawesome/free-solid-svg-icons";

import { CardBody, Row, Col, Button } from 'reactstrap';

export const AboutBody = props => (
    <CardBody>
    <Row >
        <Col>
                <div className="column-section">
                    <div className="overflow-hidden">
                    <span className="column-item">
                        <span className="column-data">
                        <FontAwesomeIcon icon={faCalendar}/> Domain:
                        </span>
                        {props.domain ? props.domain : "-"}
                    </span>

                    <span className="column-item">
                        <span className="column-data">
                        <FontAwesomeIcon icon={faTags}/> Tags:
                        </span>
                        <div className="overflow-hidden">
                        {props.subdomain ? props.subdomain.map(txt => <div className="column-list">{txt}</div>) : "-"}
                        </div>
                    </span>

                    <span className="column-item">
                        <span className="column-data">
                        <FontAwesomeIcon icon={faPortrait}/> Authors:
                        </span>
                        <div className="overflow-hidden">
                        {props.authors ? props.authors.map(txt => <div className="column-list">{txt}</div>) : "-"}
                        </div>
                    </span>

                    <span className="column-item">
                        <span className="column-data">
                        <FontAwesomeIcon icon={faPortrait}/> Article title:
                        </span>
                        {props.article_title ? props.article_title : "-"}
                    </span>

                    <span className="column-item">
                        <span className="column-data">
                        <FontAwesomeIcon icon={faGlobe}/> Country:
                        </span>
                        {props.country ? props.country : "-"}
                    </span>
                    
                    <span className="column-item">
                        <span className="column-data">
                        <FontAwesomeIcon icon={faCalendar}/> Created:
                        </span>
                        {props.year ? props.year : "-"}
                    </span>

                    </div>

                    <div className="overflow-hidden">
                        <span className="column-item">
                            <span className="column-data">
                            <FontAwesomeIcon icon={faStar}/> Rating:
                            </span>
                            {props.avg_rating ? props.avg_rating : "0"}
                        </span>
                        <span className="column-item">
                            <span className="column-data">
                            <FontAwesomeIcon icon={faFile}/> Data format:
                            </span>
                            {props.data_format ? props.data_format : "-"}
                        </span>
                        <span className="column-item">
                            <span className="column-data">
                            <FontAwesomeIcon icon={faFileDownload}/> Resource Type:
                            </span>
                            {props.shouldHaveDownloadButton ? 
                                <>{
                                    props.shouldHaveDownloadLink ? 
                                    <><a target="_blank" href={props.downloadPath}><FontAwesomeIcon icon={faLink} />Download Link</a></>
                                    :
                                    <span><FontAwesomeIcon icon={faDatabase} />  Download File</span>
                                }</>
                                :
                                <>None</>
                                }
                        </span>
                        <span className="column-item">
                            <span className="column-data">
                            <FontAwesomeIcon icon={faGlobe}/> Gitlink:
                            </span>
                            {props.gitlink ? props.gitlink : "-"}
                        </span>

                        <span className="column-item">
                            <span className="column-data">
                            <FontAwesomeIcon icon={faUser}/> Uploaded by:
                            </span>
                            {props.owner ? props.owner : "-"}
                        </span>
                    </div>

                </div>
        </Col>
    </Row>
    <Row>
        <Col>
            {props.short_desc}
        </Col>
    </Row>
    <Row>
        <Col>
            <div className="column-title margin-top-10">
                Data integrity and authenticity
            </div>
            <div>
                {props.dataIntegrity ? props.dataIntegrity : "Not specified"}
            </div>
        </Col>
    </Row>
    <Row>
        <Col>
            <div className="column-title margin-top-10">
                Continuity of access
            </div>
            <div>
                {props.continuityAccess ? props.continuityAccess : "Not specified"}
            </div>
        </Col>
    </Row>
    <Row>
        <Col>
            <div className="column-title margin-top-10">
                Data reuse
            </div>
            <div>
                {props.dataReuse ? props.dataReuse : "Not specified"}
            </div>
        </Col>
    </Row>

    <Row>
        <Col className="text-align-center">
            <Button
                color="primary" 
                outline className="upload-button-size" 
                onClick={() => props.handleDownload()}>
                Download
            </Button>
        </Col>
    </Row>
    </CardBody>
);



