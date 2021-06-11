import * as React from 'react';

import { Col } from 'reactstrap';
import { Title } from '../Items/Title/Title';
import {LoaderComponent} from '../Items/Items-components'
import './DatasetView.scss';

export interface IDatasetViewLoadingProps {}

export interface IDatasetViewLoadingState {}

export default class DatasetViewLoading extends React.Component<IDatasetViewLoadingProps, IDatasetViewLoadingState> {
    render() {  
        return (
            <Col md={{ size: 9, offset: 0 }}>
                <Title className="margin-top-50 margin-bottom-10p" titleSet={"Dataset is Loading ..."}/>
            
                <LoaderComponent visible={true}/>
            </Col>
        )
    }
}