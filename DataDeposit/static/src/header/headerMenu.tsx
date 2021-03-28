import './header.scss';

import axios from 'axios';
import React from 'react';
import { Storage, translate } from 'react-jhipster';
import { Collapse, Nav, Navbar, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import LoadingBar from 'react-redux-loading-bar';
// import { getSession } from 'app/shared/reducers/authentication';
import { Brand, Logo, Home, Logout, Profile } from './header-components';
import { connect } from 'react-redux';
// import { IRootState } from 'app/shared/reducers';
// import { AccountMenu, LocaleMenu } from 'app/shared/layout/header/menus';
// import { setActiveEntry } from 'app/shared/reducers/profile/profile.reducer';
// import { withRouter } from 'react-router';
import { triggerAsyncId } from 'async_hooks';
// import { AppNotificationActions } from 'app/shared/ui/AppNotificationsContext/NotificationsActions';
import ReactFlagsSelect from 'react-flags-select';

export interface IHeaderProps {
//   location: any;
//   history: any;
//   account: any;
//   realAccount: any;
//   match: any;
//   isAuthenticated: boolean;
//   isAdmin: boolean;
//   ribbonEnv: string;
//   isInProduction: boolean;
//   isSwaggerEnabled: boolean;
//   currentLocale: string;
//   onLocaleChange: Function;
}

export interface IHeaderState {
  menuOpen: boolean;
  isAuthenticated: boolean;
  tokenId: number;
  username: string;
  selected: string;
}

export class HeaderMenu extends React.Component<IHeaderProps, IHeaderState> {
  state: IHeaderState = {
    menuOpen: false,
    isAuthenticated: false,
    tokenId: 0,
    username: "",
    selected: "GB"
  };

  componentWillMount() {
    this.state.isAuthenticated = false;
    const token = localStorage.getItem('login_user_token');
    const tokenId = localStorage.getItem('login_user_token_id');
    this.setState({
      tokenId: tokenId !== null ? parseInt(tokenId) : 0,
      username: token !== null ? token : ""
    });
    console.log(token);

    if(token) {
      console.log("INTRA PE AICI");
      this.state.isAuthenticated = true;
    }
    axios.get('/getUserId', {
      params: {
        ID: 12345
      }
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      // always executed
    });  
    console.log(this.state.isAuthenticated);

    this.setSelected = this.setSelected.bind(this);
  }

  toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  };

  handleLogout = () => {
    axios.post( '/logout_post', {})
      .then(response => {
        console.log(response);
          localStorage.removeItem('login_user_token');
          this.state.isAuthenticated = false;
          window.location.reload(false);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        // always executed
      }); 
  };

  setSelected(code) {
    this.setState({
      selected: code
    });
  }

  render() {
    // const { currentLocale, isAuthenticated } = this.props;
    // const account = this.props.account.user;

    let loginName: String = 'guest';
    let photoLink: String = 'static/dist/content/images/default-profile-photo.jpg';

    // if (account && account.researchers) {
    //   loginName = account.firstName;
    //   photoLink = account.researchers.photoLink;
    // }

    return (
      <div id="app-header">
        {/* <LoadingBar className="loading-bar" /> */}
        <Navbar dark expand="md" fixed="top" className="CustomNavbar">
          <NavbarToggler aria-label="Menu" onClick={this.toggleMenu} />
          <Brand />
          <Logo />
          <Collapse isOpen={this.state.menuOpen} navbar>
            <ReactFlagsSelect
              selected={this.state.selected}
              onSelect={code => this.setSelected(code)}
              countries={["GB", "RO"]}
              showSelectedLabel={false}
              showOptionLabel={false}
              fullWidth={false}
            />
            <Nav id="header-tabs" className="ml-auto" navbar>
              {this.state.isAuthenticated ? (<><Profile userId={this.state.tokenId} username={this.state.username} /><Logout handleLogout={this.handleLogout} /> </>) : (<Home toggleMenu={this.toggleMenu} />)}
              
              
              {/* <LocaleMenu currentLocale={currentLocale} onClick={this.handleLocaleChange} /> */}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}



// const mapDispatchToProps = { getSession, setActiveEntry };
// const mapStateToProps = ({ authentication }: IRootState) => ({
//   account: authentication.account,
//   notifications: authentication.notifications.data
// });

// type StateProps = ReturnType<typeof mapStateToProps>;
// type DispatchProps = typeof mapDispatchToProps;

// export default withRouter(connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Header));