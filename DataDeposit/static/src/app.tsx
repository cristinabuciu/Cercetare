import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {HeaderMenu} from './header/headerMenu';
import Footer from './footer/footer';
import { AppContainer } from 'react-hot-loader';
import { Card } from 'reactstrap';
import ErrorBoundary from './error/error-boundary';
import { HashRouter as Router } from 'react-router-dom';
import ScrollUpButton from "react-scroll-up-button";

import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import 'antd/dist/antd.css';

import AppRoutes from './appRoutes';

export class App extends React.Component<{greeting: string}, {count:number}> {
  state = {count: 0};

  render() {
    const paddingTop = '60px';
    return (
        <div>
          <Router>
            <div className="app-container" style={{ paddingTop }}>
              <ErrorBoundary>
                <AppContainer>
                    <HeaderMenu  />
                </AppContainer>
              </ErrorBoundary>

              <div className="container-fluid view-container" id="app-view-container">
                <Card className="jh-card card-ala-prost">
                  <ErrorBoundary>
                    <AppRoutes />
                    <ScrollUpButton
                        StopPosition={0}
                        ShowAtPosition={150}
                        EasingType='easeOutCubic'
                        AnimationDuration={500}
                        ContainerClassName='ScrollUpButton__Container'
                        TransitionClassName='ScrollUpButton__Toggled'
                        style={{}}
                        ToggledStyle={{}}
                        />
                  </ErrorBoundary>
                </Card>
                <ErrorBoundary>
                  <Footer />
                </ErrorBoundary>
              </div>
              
            </div>
          </Router>
        </div>
      );
  }
} 


ReactDOM.render(
  <App greeting="Hello, world!"/>,
  document.getElementById('app')
);
