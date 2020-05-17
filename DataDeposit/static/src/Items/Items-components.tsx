import React, { useState } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import "./items.scss";

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