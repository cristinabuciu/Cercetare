import * as React from 'react';
import "../style_home.scss";
 
import UploadPageForm from "./UploadPageForm"
import UploadPageResult from "./UploadPageResult"

export interface IUploadPageProps {
    color: string;
}

export interface IUploadPageState {
    isResultReady: boolean;
}

export default class UploadPage extends React.Component<IUploadPageProps, IUploadPageState> {
    state = {
        isResultReady: false
    }
    changeToSuccess = () => {
        this.setState({
            isResultReady: true
        });
    }

    handleRepairUpload = () => {
        this.setState({
            isResultReady: false
        });
    }


    render() {  

      return (
          <>
            {this.state.isResultReady ? 
            <UploadPageResult
                color={this.props.color}
                handleRepairUpload={this.handleRepairUpload}
                />
                :
            <UploadPageForm 
                color={this.props.color}
                changeToSuccess={this.changeToSuccess}
                />}
            </>
      )
    }

}





