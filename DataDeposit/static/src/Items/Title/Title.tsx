import * as React from 'react';

import { Col, Button } from 'reactstrap';

import './title.scss';


export interface ITitleProps {
    titleSet: string;
    className?: string;
}

export interface ITitleState {}

export default class Title extends React.Component<ITitleProps, ITitleState> {
  
    render() {  
      const propsClassName = this.props.className ? " " + this.props.className : "";
      return (
        <Col md={{ size: 12, offset: 0 }} className="text-align-center quick-title">
            <h3 className={"sellGear-title" + propsClassName}>{this.props.titleSet}</h3>
        </Col>
      )
    }

}