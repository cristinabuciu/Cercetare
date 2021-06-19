import './DatasetView.scss';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faStar, faPortrait, faCalendar, faUser, faFile, faFileDownload, faGlobe, faDatabase, faLock, faTags, faFemale, faFlag } from "@fortawesome/free-solid-svg-icons";

import { CardBody, Row, Col, Button } from 'reactstrap';

export const AboutBody = props => (
    <CardBody>
    <Row >
        <Col>
                <div className="column-section">
                    <div className="overflow-hidden">
                    <span className="column-item">
                        <span className="column-data bold">
                        <FontAwesomeIcon icon={faCalendar}/> {props.translate.useTranslation("domain-label")}
                        </span>
                        {props.domain ? props.domain : "-"}
                    </span>

                    <span className="column-item">
                        <span className="column-data bold">
                        <FontAwesomeIcon icon={faTags}/> {props.translate.useTranslation("tags-label")}
                        </span>
                        <div className="overflow-hidden">
                        {props.subdomain ? props.subdomain.map(txt => <div className="column-list">{txt}</div>) : "-"}
                        </div>
                    </span>

                    <span className="column-item">
                        <span className="column-data bold">
                        <FontAwesomeIcon icon={faPortrait}/> {props.translate.useTranslation("author-label")}
                        </span>
                        <div className="overflow-hidden">
                        {props.authors ? props.authors.map(txt => <div className="column-list">{txt}</div>) : "-"}
                        </div>
                    </span>

                    <span className="column-item">
                        <span className="column-data bold">
                        <FontAwesomeIcon icon={faPortrait}/> {props.translate.useTranslation("article-label")}
                        </span>
                        {props.article_title ? props.article_title : "-"}
                    </span>

                    <span className="column-item">
                        <span className="column-data bold">
                        <FontAwesomeIcon icon={faGlobe}/> {props.translate.useTranslation("country-label")}
                        </span>
                        {props.country ? props.country : "-"}
                    </span>
                    
                    <span className="column-item">
                        <span className="column-data bold">
                        <FontAwesomeIcon icon={faCalendar}/> {props.translate.useTranslation("created-label")}
                        </span>
                        {props.year ? props.year : "-"}
                    </span>

                    </div>

                    <div className="overflow-hidden">
                        <span className="column-item">
                            <span className="column-data bold">
                            <FontAwesomeIcon icon={faStar}/> {props.translate.useTranslation("rating-label")}
                            </span>
                            {props.avg_rating ? props.avg_rating : "0"}
                        </span>
                        <span className="column-item">
                            <span className="column-data bold">
                            <FontAwesomeIcon icon={faFile}/> {props.translate.useTranslation("data-label")}
                            </span>
                            {props.data_format ? props.data_format : "-"}
                        </span>
                        <span className="column-item">
                            <span className="column-data bold">
                            <FontAwesomeIcon icon={faFileDownload}/> {props.translate.useTranslation("resource-label")}
                            </span>
                            {props.shouldHaveDownloadButton ? 
                                <>{
                                    props.shouldHaveDownloadLink ? 
                                    <><a target="_blank" href={props.downloadPath}><FontAwesomeIcon icon={faLink} />{props.translate.useTranslation("link-label")}</a></>
                                    :
                                    <span><FontAwesomeIcon icon={faDatabase} />  {props.translate.useTranslation("file-label")}</span>
                                }</>
                                :
                                <>{props.translate.useTranslation("None")}</>
                                }
                        </span>
                        {props.shouldHaveDownloadButton && !props.shouldHaveDownloadLink ? 
                        <span className="column-item">
                            <span className="column-data bold">
                            <FontAwesomeIcon icon={faLock}/> {props.translate.useTranslation("checksum-label")}
                            </span>
                            {props.checksum}
                        </span> : <></>
                        }
                        <span className="column-item">
                            <span className="column-data bold">
                            <FontAwesomeIcon icon={faGlobe}/> {props.translate.useTranslation("git-label")}
                            </span>
                            {props.gitlink ? props.gitlink : "-"}
                        </span>

                        <span className="column-item">
                            <span className="column-data bold">
                            <FontAwesomeIcon icon={faUser}/> {props.translate.useTranslation("owner-label")}
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
                {props.translate.useTranslation("integrity-label")}
            </div>
            <div>
                {props.dataIntegrity ? props.dataIntegrity : "Not specified"}
            </div>
        </Col>
    </Row>
    <Row>
        <Col>
            <div className="column-title margin-top-10">
                {props.translate.useTranslation("cont-label")}
            </div>
            <div>
                {props.continuityAccess ? props.continuityAccess : "Not specified"}
            </div>
        </Col>
    </Row>
    <Row>
        <Col>
            <div className="column-title margin-top-10">
                {props.translate.useTranslation("reuse-label")}
            </div>
            <div>
                {props.dataReuse ? props.dataReuse : "Not specified"}
            </div>
        </Col>
    </Row>

    <Row>
        <Col className="text-align-center">
            {props.shouldHaveDownloadButton ? 
            <Button
                color="primary" 
                outline className="upload-button-size" 
                onClick={() => props.handleDownload()}>
                {props.translate.useTranslation("download-label")}
            </Button>
            : <></>
            }
        </Col>
    </Row>
    </CardBody>
);



