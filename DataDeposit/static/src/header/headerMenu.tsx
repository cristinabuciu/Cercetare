import './header.scss';

// import axios from 'axios';
import React from 'react';
import { Storage, translate } from 'react-jhipster';
import { Collapse, Nav, Navbar, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import LoadingBar from 'react-redux-loading-bar';
// import { getSession } from 'app/shared/reducers/authentication';
import { Brand, Logo, Home } from './header-components';
import { connect } from 'react-redux';
// import { IRootState } from 'app/shared/reducers';
// import { AccountMenu, LocaleMenu } from 'app/shared/layout/header/menus';
// import { setActiveEntry } from 'app/shared/reducers/profile/profile.reducer';
// import { withRouter } from 'react-router';
import { triggerAsyncId } from 'async_hooks';
// import { AppNotificationActions } from 'app/shared/ui/AppNotificationsContext/NotificationsActions';

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
}

export class HeaderMenu extends React.Component<IHeaderProps, IHeaderState> {
  state: IHeaderState = {
    menuOpen: false
  };

  toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  };

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
            <Nav id="header-tabs" className="ml-auto" navbar>
              <Home toggleMenu={this.toggleMenu} />
              
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