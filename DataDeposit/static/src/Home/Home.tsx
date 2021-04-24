import * as React from 'react';
import MyTranslator from '../assets/MyTranslator'

import './Home.scss';
import LeftBar from "../LeftBar/LeftBar";
import { Row, Col, Alert } from 'reactstrap';
import { Container } from 'semantic-ui-react';
import { Title } from '../Items/Title/Title';
import ReactTextFormat from 'react-text-format';
import RichTextEditor from 'react-rte';

export interface IHomeProps {
    greeting: string;
}

export interface IHomeState {
    wasError: boolean;
    wasInfo: boolean;
    value: any;
}

export default class Home extends React.Component<IHomeProps, IHomeState> {
    state: IHomeState = {
        wasError: false,
        wasInfo: false,
        value: RichTextEditor.createEmptyValue()
    };

    public componentDidMount(): void {

    }

    onChange = (value) => {
        debugger;
        this.setState({value: value});
        
      };

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

                        <Row>
                            <Col>
                                <ReactTextFormat>
                                    This is demo link http://www.google.com
                                    This is demo email <span data-email="miller@yahoo.com">miller@yahoo.com</span>
                                
                                    This is demo image https://preview.ibb.co/hqhoyA/lexie-barnhorn-1114350-unsplash.jpg
                                
                                    This is demo credit Card 5555555555554444
                                    This is demo phone Number 123.456.7890
                                    This is demo phone Number (212) 555 1212
                                    This is demo phone Number (212) 555-1212
                                    This is demo phone Number 212-555-1212 ext. 101
                                    This is demo phone Number 212 555 1212 x101
                                
                                    This is an anchor <a href="http://formatter.com">http://formatter.com</a>;
                                    </ReactTextFormat>

                            </Col>
                        </Row>

                        <Row>
                            <Col>

                                <RichTextEditor
                                    value={this.state.value}
                                    onChange={this.onChange}
                                />
                            </Col>
                        </Row>
                        
                    </Col>
                    
                </Row>
            </Container>
            
        );
    }
}