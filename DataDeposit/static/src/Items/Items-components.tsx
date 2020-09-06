import React, { useState } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Collapse, Card, CardBody,
  Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Input, Alert } from 'reactstrap';
import { NavLink } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import "./items.scss";
import Loader from 'react-loader-spinner';
import { faLink, faStar, faPortrait, faCalendar, faUser, faFile, faFileDownload, faGlobe, faDatabase, faEye, faTags, faFemale, faFlag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const InputText = (props) => {
  const [dropdownOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);

  let changeValueBind = props.changeValue.bind();

  return (
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={props.className ? props.className : "button-style"}>
      <DropdownToggle caret>
        {props.titleDropdown}
      </DropdownToggle>
      <DropdownMenu >
          {/* {hatz(props.listOfItems)} */}
          {props.listOfItems && props.listOfItems.length ? <></> : <DropdownItem disabled>Nothing to show</DropdownItem> }
          { props.listOfItems.map(item => (
              <DropdownItem onClick={(e) => changeValueBind(e.target.textContent, props.nameOfDropdown, true)}>{item}</DropdownItem>
            )
        )}
      </DropdownMenu>
    </ButtonDropdown>
  );
}

export const LoaderComponent = (props) => {

  return (
    <div className="loader-style">
      <Loader type="TailSpin" color="#007BFF" height={props.height ? props.height : 100} width={props.width ? props.width : 100} visible={props.visible}/>
  </div>
  );
}

export const Switch = ({ isOn, handleToggle, onColor }) => {
  return (
    <>
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id={'react-switch-new'}
        type="checkbox"
      />
      <label
        style={{ background: isOn && onColor }}
        className="react-switch-label"
        htmlFor={'react-switch-new'}
      >
        <span className={'react-switch-button'} />
      </label>
    </>
  );
};

export const TooltipButton = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className={props.className ? props.className : ""}>
      <Button color="primary" onClick={toggle} style={{ marginBottom: '1rem' }}>{props.ButtonName}</Button>
      <Collapse isOpen={isOpen}>
          <Card>
          <CardBody>
            {props.body}
          </CardBody>
          </Card>
      </Collapse>
    </div>
  );
}

export const ModalQuickView = (props) => {
  const {
    buttonLabel,
    className,
    buttonClassName,
    modalTitle,
    authors,
    year,
    owner,
    subdomain,
    short_desc,
    country,
    data_format,
    downloadType,
    avg_rating,
    privateItem
  } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button color="primary" onClick={toggle} className={buttonClassName}>
        <span className="quick-view-span">
        <span className="padding-right-10">
          <FontAwesomeIcon icon={faEye}/>
          </span> <span className="resizable-1350">{buttonLabel}</span> </span></Button>
      <Modal isOpen={modal} toggle={toggle} className={className} size="lg">
      <ModalHeader toggle={toggle} className="modal-title">{modalTitle}</ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <div className="column-section">
                <div className="overflow-hidden">
                  <div className="column-title">
                    Metadata
                  </div>
                  <span className="column-item">
                    <span className="column-data">
                    <FontAwesomeIcon icon={faCalendar}/> Created:
                    </span>
                    {year ? year : "-"}
                  </span>

                  <span className="column-item">
                    <span className="column-data">
                      <FontAwesomeIcon icon={faUser}/> Uploaded by:
                    </span>
                    {owner ? owner : "-"}
                  </span>

                  <span className="column-item">
                    <span className="column-data">
                      <FontAwesomeIcon icon={faTags}/> Tags:
                    </span>
                    <div className="overflow-hidden">
                      {subdomain ? subdomain.map(txt => <div className="column-list">{txt}</div>) : "-"}
                    </div>
                  </span>

                  <span className="column-item">
                    <span className="column-data">
                      <FontAwesomeIcon icon={faPortrait}/> Authors:
                    </span>
                    <div className="overflow-hidden">
                      {authors ? authors.map(txt => <div className="column-list">{txt}</div>) : "-"}
                    </div>
                  </span>
                  <span className="column-item">
                    <span className="column-data">
                      <FontAwesomeIcon icon={faGlobe}/> Country:
                    </span>
                    {country ? country : "-"}
                  </span>
                </div>
                <div className="overflow-hidden">
                  <div className="column-title">
                    Files
                  </div>
                  <span className="column-item">
                    <span className="column-data">
                    <FontAwesomeIcon icon={faStar}/> Files rating:
                    </span>
                      {avg_rating ? avg_rating : "0"}
                  </span>
                  <span className="column-item">
                    <span className="column-data">
                    <FontAwesomeIcon icon={faFile}/> Data format:
                    </span>
                      {data_format ? data_format : "-"}
                  </span>
                  <span className="column-item">
                    <span className="column-data">
                    <FontAwesomeIcon icon={faFileDownload}/> Download Type:
                    </span>
                      {downloadType ? downloadType : "No download"}
                  </span>
                </div>

              </div>
            </Col>
          </Row>
          <Row className={privateItem ? "" : "display-none"}>
            <Col>
                <Alert color="warning" className="text-align-center">
                    Warning: This dataset is private !
                </Alert>
            </Col>
          </Row>
          <Row>
              <Col>
                  <Input type="textarea" name="text" id="description" placeholder="Short Description" className="margin-top-10" disabled={true} value={short_desc}/>
              </Col>
          </Row>
        </ModalBody>
        <ModalFooter><NavLink tag={Link} to={'/datasetView/' + props.id}><Button color="primary">Go to Dataset</Button></NavLink>
          {' '}
          <Button color="secondary" onClick={toggle}>Cancel</Button>
          <NavLink tag={Link} to={'/datasetView/' + props.id}><Button color="link"><FontAwesomeIcon icon={faFlag}/></Button></NavLink>
          {' '}
        </ModalFooter>
      </Modal>
    </div>
  );
}

// export default class CurrencySelector extends Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             currency: DEFAULT_CURRENCY
//         }
//     }

//     updateState(newCurrency) {
//         this.setState({
//             currency: newCurrency.value
//         });
//     }

//     render() {
//         return (
//             <ReactSelect
//                 value={this.state.currency}
//                 onChange={this.updateState}>
//             </ReactSelect>
//         );
//     }
// }