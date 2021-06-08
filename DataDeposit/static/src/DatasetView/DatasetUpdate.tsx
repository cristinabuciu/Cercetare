import './DatasetView.scss';
import MyTranslator from '../assets/MyTranslator'
import React from 'react';
import classnames from 'classnames';

import { TabContent, TabPane, NavLink, Nav, NavItem } from 'reactstrap';
import MetadataEdit from './EditDataset/MetadataEdit'
import ResourceEdit from './EditDataset/ResourceEdit'

export interface IDatasetUpdateProps {
    private: boolean;
	id: number;
    domain: string;
    subdomain: Array<string> 
    country: string;
    authors: Array<string>;
    year: string;
    dataset_title: string;
    article_title: string; 
    short_desc: string;
    avg_rating: number;
    gitlink: string;
    dataIntegrity: string;
    continuityAccess: string;
	dataReuse: string;
	switchPage: Function;
    handleDownload: Function;
}

export interface IDatasetUpdateState {
	activeTab: string;
	currentPage: number;
}

export default class DatasetUpdate extends React.Component<IDatasetUpdateProps, IDatasetUpdateState> {
    state = {
		activeTab: '1',
		currentPage: 1
    }

    componentDidMount (): void {
		this.setNewPage = this.setNewPage.bind(this);
		this.switchTabs = this.switchTabs.bind(this);
	}

	setNewPage (nextPage : number): void {
        this.setState({
            currentPage: nextPage
        });
    }

	switchTabs(tab): void {
        if(this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });

            if (tab === '1') {
                this.setNewPage(1);
            }
        }
    }

    render() {  
        const translate = new MyTranslator("Upload");
        return (
		<>
			<Nav tabs className="margin-top-5 margin-bottom-5">
                <NavItem>
                    <NavLink
                        className={classnames({ active: this.state.activeTab === '1' })}
                        onClick={ () => this.switchTabs('1') }>
                        {translate.useTranslation("metadata-edit")}
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: this.state.activeTab === '2' })}
                        onClick={ () => this.switchTabs('2') }>
                        {translate.useTranslation("resource-edit")}
                    </NavLink>
                </NavItem>
            </Nav>

			<TabContent activeTab={this.state.activeTab}>
				<TabPane tabId="1">
					<MetadataEdit
                        private={this.props.private}
						id={this.props.id}
						domain={this.props.domain}
						subdomain={this.props.subdomain} 
						country={this.props.country}
						authors={this.props.authors}
						year={this.props.year}
						dataset_title={this.props.dataset_title}
						article_title={this.props.article_title}
						short_desc={this.props.short_desc}
						avg_rating={this.props.avg_rating}
						gitlink={this.props.gitlink}
						dataIntegrity={this.props.dataIntegrity}
						continuityAccess={this.props.continuityAccess}
						dataReuse={this.props.dataReuse}
						switchPage={this.props.switchPage}
					/>
				</TabPane>
				<TabPane tabId="2">
					<ResourceEdit 
						id={this.props.id}
						switchPage={this.props.switchPage}
                        handleDownload={this.props.handleDownload}
					/>
				</TabPane>
			</TabContent>
		</>
		)
    }
}