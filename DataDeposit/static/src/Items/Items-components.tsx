import React, { useState } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import "./items.scss";

export const InputText = (props) => {
  const [dropdownOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);

  let changeValueBind = props.changeValue.bind();

  return (
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className="button-style">
      <DropdownToggle caret>
        {props.titleDropdown}
      </DropdownToggle>
      <DropdownMenu >
          {/* {hatz(props.listOfItems)} */}
          { props.listOfItems.map(item => (
              <DropdownItem onClick={(e) => changeValueBind(e.target.textContent, props.nameOfDropdown)}>{item}</DropdownItem>
            )
        )}
      </DropdownMenu>
    </ButtonDropdown>
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