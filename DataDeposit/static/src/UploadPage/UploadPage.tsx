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
        const a = "Guidance: \
        This Requirement covers the governance related to continued operation of the repository over time and \
        during disasters, as well as evidence in relation to succession planning; namely, the measures in place to \
        ensure access to and availability of data holdings, both currently and in the future. Reviewers are seeking \
        evidence that preparations are in place to address the risks inherent in changing circumstances, including \
        in mission and/or scope. " + <br/> + <br/> + "  \
        For this Requirement, please describe: \
            • The level of responsibility undertaken for data holdings, including any guaranteed preservation periods.\
            • The medium-term (three- to five-year) and long-term (> five years) plans in place to ensure the continued availability and accessibility of the data. In particular, both the response to rapid \
        changes of circumstance and long-term planning should be described, indicating options for \
        relocation or transition of the activity to another body or return of the data holdings to their owners \
        (i.e., data producers). For example, what will happen in the case of cessation of funding, which \
        could be through an unexpected withdrawal of funding, a planned ending of funding for a time- \
        limited project repository, or a shift of host institution interests? \
        Evidence for this Requirement should relate specifically to governance. The technical aspects of business \
        continuity, and disaster and succession planning should be covered in R15 (Technical infrastructure)."
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
                authorsTooltip="If there are multi authors you need to use ; for them to be separati"
                contAccess={a}
                />}
            </>
      )
    }

}





