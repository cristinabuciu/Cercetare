import React from 'react';
import MyTranslator from '../assets/MyTranslator'
import { FooterBody } from './footer-components';

export interface IFooterProps {}
export interface IFooterState {}

export class Footer extends React.Component<IFooterProps, IFooterState> {

	render() {
		const translate = new MyTranslator("Footer");
		return (
			<FooterBody translate={translate}/>
		);
	}
}

export default Footer;
