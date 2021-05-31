import * as React from 'react';
import MyTranslator from '../assets/MyTranslator'

import './Home.scss';
import LeftBar from "../LeftBar/LeftBar";
import { Row, Col, Alert } from 'reactstrap';
import { Container } from 'semantic-ui-react';
import { Title, HomeTitle } from '../Items/Title/Title';
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

    public componentDidMount(): void {}

    onChange = (value) => {
        debugger;
        this.setState({value: value});
    };

    render() {
        const translate = new MyTranslator("Home");
        return (

            <Container className="themed-container" fluid={true}>
                <Row lg="12">
                    <Title className="HomeTitle" titleSet={this.props.greeting}/>
                </Row>
                <Row md="4">
                    
                    <LeftBar 
                        className='resizable-1050' 
                        modeSearch={false}/>
                    <Col md={{ size: 2, offset: 0 }}>
                        .
                    </Col>
                    <Col md={{ size: 10, offset: 0 }}>
                        <HomeTitle className="HomeTitle" titleSet={translate.useTranslation("home-title")}/>

                        {/* <Row>
                            <Col>
                                <RichTextEditor
                                    value={this.state.value}
                                    onChange={this.onChange}
                                />
                            </Col>
                        </Row> */}
                        
                        <Row>
                            <Col>
                                <iframe src="http://64.227.44.190:5601/app/kibana#/visualize/edit/2ca8b0a0-b3d9-11eb-b5e9-07749e65781a?embed=true&_g=(refreshInterval%3A('%24%24hashKey'%3A'object%3A1073'%2Cdisplay%3A'1%20minute'%2Cpause%3A!f%2Csection%3A2%2Cvalue%3A60000)%2Ctime%3A(from%3Anow-15m%2Cmode%3Aquick%2Cto%3Anow))&_a=(uiState:(mapCenter:!(39.90973623453719,18.281250000000004),mapZoom:3))" height="600" width="100%"></iframe>
                            </Col>
                        </Row>
                    </Col>
                    
                </Row>
            </Container>
            
        );
    }
}