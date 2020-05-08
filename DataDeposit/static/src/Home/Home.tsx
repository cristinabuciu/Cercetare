
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './Home.scss';
import LeftBar from "../LeftBar/LeftBar";
import { Row, Col } from 'reactstrap';
import { Container } from 'semantic-ui-react';

export interface IHomeProps {
    greeting: string;
}

export interface IHomeState {
    count:number;
}

export default class Home extends React.Component<IHomeProps, IHomeState> {
    state = {count: 0};

    render() {
        const paddingTop = '60px';
        return (
            <div>
                <h2>{this.props.greeting}</h2>
                {/* <button onClick={() => this.setState({count: this.state.count+1})}>
                    This button has been clicked {this.state.count} times.
                </button> */}
                <Container>
                    <Row>
                        <LeftBar color='black'/>
                        <Col md={{ size: 9, offset: 0 }}>

                        </Col>
                    </Row>
                </Container>
            </div>
            
        );
    }
}