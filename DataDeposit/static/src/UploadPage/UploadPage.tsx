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
        const contAccess = <div>
        <b>The repository has a continuity plan to ensure ongoing access to and preservation of its holdings.</b><br/><br/>
        Guidance:<br/>
        This Requirement covers the governance related to continued operation of the repository over time and 
        during disasters, as well as evidence in relation to succession planning; namely, the measures in place to 
        ensure access to and availability of data holdings, both currently and in the future. Reviewers are seeking 
        evidence that preparations are in place to address the risks inherent in changing circumstances, including 
        in mission and/or scope.<br/><br/>
        For this Requirement, please describe: <br/><br/>
        <ul>
            <li>The level of responsibility undertaken for data holdings, including any guaranteed preservation periods.<br/><br/></li>
            <li>The medium-term (three- to five-year) and long-term (> five years) plans in place to ensure the continued availability and accessibility of the data. In particular, both the response to rapid 
        changes of circumstance and long-term planning should be described, indicating options for 
        relocation or transition of the activity to another body or return of the data holdings to their owners 
        (i.e., data producers). For example, what will happen in the case of cessation of funding, which 
        could be through an unexpected withdrawal of funding, a planned ending of funding for a time- 
        limited project repository, or a shift of host institution interests? 
        Evidence for this Requirement should relate specifically to governance. The technical aspects of business 
        continuity, and disaster and succession planning should be covered in R15 (Technical infrastructure).</li></ul></div>
        const dataInteg = <div>
            <b>The repository guarantees the integrity and authenticity of the data.</b><br/>
            Guidance:<br/>
            The repository should provide evidence to show that it operates a data and metadata management system
            suitable for ensuring integrity and authenticity during the processes of ingest, archival storage, and data
            access. This Requirement covers the entire data lifecycle within the repository.<br/>
            To protect the integrity of data and metadata any intentional changes to data and metadata should be
            documented, including the rationale and originator of the change. Measures should be in place to ensure
            that unintentional or unauthorized changes can be detected and correct versions of data and metadata
            recovered.<br/>
            Authenticity covers the degree of reliability of the original deposited data and its provenance, including the
            relationship between the original data and that disseminated, and whether or not existing relationships
            between datasets and/or metadata are maintained.<br/>
            For this Requirement, responses on data integrity should include evidence related to the following:<br/>
            <ul>
            <li>Description of checks to verify that a digital object has not been altered or corrupted (i.e., fixity
            checks) from deposit to use.</li>
            <li>Documentation of the completeness of the data and metadata.</li>
            <li>Details of how all changes to the data and metadata are logged.</li>
            <li>Description of version control strategy.</li>
            <li>Usage of appropriate international standards and conventions (which should be specified).</li></ul>
            Evidence of authenticity management should relate to the following questions:<br/>
            <ul><li>Does the repository have a strategy for data changes? Are data producers made aware of this
            strategy?</li>
            <li>Does the repository maintain provenance data and related audit trails?</li>
            <li>Does the repository maintain links to metadata and to other datasets? If so, how?</li>
            <li>Does the repository compare the essential properties of different versions of the same file? How?</li>
            <li>Does the repository check the identities of depositors?</li></ul>

        </div>
        const dataReuse = <div>
            <b>The repository enables reuse of the data over time, ensuring that appropriate metadata are available to support the understanding and use of the data.</b><br/>
            Guidance:<br/>
            Repositories must ensure that data continues to be understood and used effectively into the future despite
            changes in technology and the Designated Community’s knowledge base. This Requirement evaluates the
            measures taken to ensure that data are reusable.<br/>
            For this Requirement, responses should include evidence related to the following questions:
            <ul>
            <li>Which metadata are provided by the repository when the data are accessed?</li>
            <li>How does the repository ensure continued understandability of the data?</li>
            <li>Are data provided in formats used by the Designated Community? Which formats?</li>
            <li>Are measures taken to account for the possible evolution of formats?</li></ul>
            The concept of ‘reuse’ is critical in environments in which secondary analysis outputs are redeposited into
            a repository alongside primary data, since the provenance chain and associated rights issues may then
            become increasingly complicated.
        </div>
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
                contAccess={contAccess}
                dataInteg={dataInteg}
                dataReuse={dataReuse}
                />}
            </>
      )
    }

}





