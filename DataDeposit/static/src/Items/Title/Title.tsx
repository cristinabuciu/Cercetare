import React, { useState } from 'react';

import { Col, Button } from 'reactstrap';

import './title.scss';


export interface ITitleProps {
    titleSet: string;
    className?: string;
}

export interface ITitleState {}

export const Title = (props) => {

    const propsClassName = props.className ? " " + props.className : "";
    return (
      <Col md={props.md ? props.md : 12} className="text-align-center quick-title">
          <h3 className={"sellGear-title" + propsClassName}>{props.titleSet}</h3>
      </Col>
    );
}



export const ImageTitle = (props) => {

  const propsClassName = props.className ? " " + props.className : "";
  const profileID = props.profileID ? props.profileID : "1";
  const listaMea= ['IT_domain.jpg', 'MEDICINE_domain.jpg', 'BIOLOGY_domain.jpg', 'CHEMISTRY_domain.jpg', 'ARCHITECTURE_domain.jpg', 'PHYSICS_domain.jpg', 'BUSINESS_domain.jpg']

  let src = listaMea.includes(props.image) ? `static/dist/content/images/${props.image}` : 'static/dist/content/images/0_domain.jpg';

    return (
      <Col md={{ size: 12, offset: 0 }} className="text-align-center pageHeader-Title">
          <div className="pageHeader-Title-Image">
            <div>
              <img
                src={src}
                className="image-title"
              />
            </div>
            <div className="image-box">
              <div className="ala-de-sus-din-dr text-align-left">
              {props.hasProfilePhoto 
                  ? <img src={'static/dist/content/images/profilePicture/' + profileID + "_avatar.jpg"} />
                  : <img src={'static/dist/content/images/profilePicture/default.png'} />}
              </div>
              <div className="title-box">
              <div className="ala-de-sus text-align-left">
                <p> <span>{props.status ? props.status : ""}</span> </p>
              </div>
                <div className="title-in-image text-align-left">
                  <h3 className={"sellGear-title" + propsClassName}>{props.titleSet}</h3>
                </div>
                <div className="subtitle-image">
                      {props.subtitle ? props.subtitle : ""}
                </div>
              </div>
            </div>
          </div>
      </Col>
    );
}