
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './Home.scss';

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
            <div className="app-container" style={{ paddingTop }}>
                <h2>{this.props.greeting}</h2>
                    <button onClick={() => this.setState({count: this.state.count+1})}>
                    This button has been clicked {this.state.count} times.
                    </button>
            </div>
        );
    }
}