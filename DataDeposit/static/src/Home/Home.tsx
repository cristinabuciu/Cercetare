import * as React from 'react';
import MyTranslator from '../assets/MyTranslator'

import './Home.scss';
import LeftBar from "../LeftBar/LeftBar";
import { Row, Col, Alert } from 'reactstrap';
import { Container } from 'semantic-ui-react';
import { Title } from '../Items/Title/Title';
import Search from '../Items/Search/Search';
import SearchCard from '../Items/SearchCard';
import {LoaderComponent} from '../Items/Items-components'

export interface IHomeProps {
    greeting: string;
}

export interface IHomeState {
    wasError: boolean;
    wasInfo: boolean;
}

export default class Home extends React.Component<IHomeProps, IHomeState> {
    state: IHomeState = {
        wasError: false,
        wasInfo: false
    };

    componentDidMount() {

    }

    render() {
        const translate = new MyTranslator("Home");
        return (

            <Container className="themed-container" fluid={true}>
                <Row lg="12">
                    <Title titleSet={this.props.greeting}/>
                </Row>
                <Row md="4">
                    
                    <LeftBar 
                        className='resizable-1050' 
                        modeSearch={false}/>
                    <Col md={{ size: 2, offset: 0 }}>
                        .
                    </Col>
                    <Col md={{ size: 10, offset: 0 }}>
                        <Row>
                            <Col>
                            HATZ
                            </Col>

                            <Col>
                            dsfs
                            </Col>
                        </Row>
                        
                    </Col>
                    
                </Row>
            </Container>
            
        );
    }
}