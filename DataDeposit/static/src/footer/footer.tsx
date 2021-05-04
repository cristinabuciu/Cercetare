import React from 'react';
import MyTranslator from '../assets/MyTranslator'
import { FooterBody } from './footer-components';

export interface IFooterProps {}
export interface IFooterState {
	isAuthenticated: boolean;
}

export class Footer extends React.Component<IFooterProps, IFooterState> {

	state: IFooterState = {
		isAuthenticated: false
	}

	componentDidMount(): void {
		this.state.isAuthenticated = false;
        const token = localStorage.getItem('login_user_token');
        if(token) {
            this.setState({
                isAuthenticated: true
            })
        }
	}

	render() {
		const translate = new MyTranslator("Footer");
		return (
			<FooterBody translate={translate} isAuthenticated={this.state.isAuthenticated}/>
		);
	}
}

export default Footer;
