import React, { useState } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Collapse, Card, CardBody } from 'reactstrap';
import "./items.scss";
import Loader from 'react-loader-spinner';

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