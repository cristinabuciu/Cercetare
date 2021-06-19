import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import NumericInput from 'react-numeric-input';
import { InputText } from '../Items-components'

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SelectList } from '../../models/FormItems';

export interface ISearchCommentsProps {
	receiveSearchParams: Function;
}

export interface ISearchCommentsState {
	resultsPerPage: number;
	sortBy: SelectList;
    sortByList: Array<SelectList>;
}

export class SearchComments extends React.Component<ISearchCommentsProps, ISearchCommentsState> {

	state: ISearchCommentsState = {
		resultsPerPage: 5,
		sortBy: {label: "Sort By  ", value: "*"},
        sortByList: [{label: "Date ASC", value: 'createdAt ASC'}, {label: "Date DESC", value: 'createdAt DESC'}, {label: "Rating ASC", value: 'rating ASC'}, {label: "Rating DESC", value: 'rating DESC'}],

	}

	componentDidMount(): void {
		//////////// FUNCTIONS /////////////
		this.changeValueSort = this.changeValueSort.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	changeValueSort(e, comboBoxTitle, shouldUpdateNumber): void {
        this.state[comboBoxTitle] = e;
        this.forceUpdate();
    }

	handleSubmit(): void {
		if (this.state.resultsPerPage > 0) {
			this.props.receiveSearchParams(this.state.resultsPerPage, this.state.sortBy);
		}
	}	

	render() {
		return (
			<Row>
				<Col md="12">
					<div className="review-body text-align-center">
						<hr className="hr-style-review" />
						<NumericInput 
							className="width-numeric-input" 
							step={1} 
							min={1} 
							max={50} 
							value={this.state.resultsPerPage ? this.state.resultsPerPage : 5}
							onChange={value => this.setState({resultsPerPage: value ? value : 5 })}
							/>
							<InputText 
								nameOfDropdown="sortBy" 
								titleDropdown={this.state.sortBy.label} 
								listOfItems={this.state.sortByList} 
								className="button-style-sort"
								changeValue={this.changeValueSort} 
								/>
						<Button color="link" onClick={this.handleSubmit}><FontAwesomeIcon icon={faSearch}/></Button>
					</div>
				</Col>
				
			</Row>
		);
	}
}

export default SearchComments;
