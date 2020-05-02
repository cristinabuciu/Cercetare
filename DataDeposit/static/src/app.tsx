import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import {HeaderMenu} from './header/headerMenu';
import LoginForm from './LoginForm/LoginForm';
import Footer from './footer/footer';
import { AppContainer } from 'react-hot-loader';
import { Card } from 'reactstrap';
import { BackTop } from 'antd';
import ErrorBoundary from './error/error-boundary';

import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import 'antd/dist/antd.css';

import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './appRoutes';

class App extends React.Component<{greeting: string}, {count:number}> {
  state = {count: 0};

  render() {
    const paddingTop = '60px';
    return (
      <Router>
        <div>
          <div className="app-container" style={{ paddingTop }}>
            <ErrorBoundary>
              <AppContainer>
                  <HeaderMenu  />
              </AppContainer>
            </ErrorBoundary>

            <div className="container-fluid view-container" id="app-view-container">
              <Card className="jh-card">
                <ErrorBoundary>
                  {/* <LoginForm color="black"/> */}
                  <AppRoutes />
                </ErrorBoundary>
              </Card>
              <Footer />
            </div>
            <BackTop />
            
          </div>
        </div>
      </Router>
      );
  }
} 

function mapStateToProps(state) {
  return {
    greeting: "De ce ma intrebi?"
  };
}

function mapDispatchToProps(state) {
  return {
    greeting: "De ce ma intrebi?"
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);


ReactDOM.render(
  <App greeting="Hello, world!"/>,
  document.getElementById('app')
);
