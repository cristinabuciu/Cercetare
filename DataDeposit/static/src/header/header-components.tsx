import React from 'react';
import { NavLink as Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DropdownMenu, DropdownToggle, NavbarBrand, NavItem, NavLink, UncontrolledDropdown } from 'reactstrap';
// import styles from './header-component.module.scss';
// import ReactTooltip from 'react-tooltip';

export const NavDropdown = props => (
  <UncontrolledDropdown nav inNavbar id={props.id}>
    <DropdownToggle nav caret className="d-flex align-items-center">
      {props.avatar && props.menu === 'account' ? (
        <img src={props.avatar} className="NavbarAvatar" />
      ) : ((props.menu === 'account') ?
        <img src={'static/dist/content/images/default-profile-photo.jpg'} className="NavbarAvatar" /> : null
        )}
      <span>{props.name}</span>
    </DropdownToggle>
    <DropdownMenu right style={props.style}>
      {props.children}
    </DropdownMenu>
  </UncontrolledDropdown>
);

export const BrandIcon = props => (
  <div {...props} className="BrandIcon">
    <img src={'static/dist/content/images/logo-normal.png'} alt="Logo" width="45" height="45" />
  </div>
);

export const Brand = props => (
  <NavbarBrand tag={Link} to="/" className="BrandLogo">
    <BrandIcon />
    <span className="BrandTitle" style={{ fontSize: 'large' }}>
      {props.translate.useTranslation("brand")}
    </span>
  </NavbarBrand>
);
export const Logo = props => (
  <NavItem className="LogoCRESCDI" >
    <NavLink tag={Link}
      className="d-flex align-items-center"
      style={{ color: 'white', textDecoration: 'none', cursor: 'default' }} to="/">
      <embed src={'static/dist/content/images/logo.png'} style={{ height: '45px', verticalAlign: 'middle', objectFit: 'cover' }} />
    </NavLink>
  </NavItem>
);

// export const Search = props => (
//   <NavItem>
//     <span className="tooltiptext">
//       <Translate contentKey="global.menu.search.main" />
//     </span>
//     <NavLink
//       tag={Link}
//       to="/search"
//       onClick={() => props.toggleMenu()}
//       className="d-flex align-items-center"
//       style={{ color: 'white', textDecoration: 'none' }}
//     >
//       <FontAwesomeIcon icon="search" />
//       <Translate contentKey="global.menu.search.main">Search</Translate>
//     </NavLink>
//   </NavItem>
// );

// export const LoggedInAs = props => (
//   <NavItem>
//     <span className="tooltiptext">
//       <Translate contentKey="global.menu.account.main" />
//     </span>
//     <NavLink
//       tag={Link}
//       to={'/profile/' + props.id}
//       className="d-flex align-items-center"
//       onClick={() => props.toggleMenu()}
//       style={{ color: 'white', textDecoration: 'none', marginLeft: '25px' }}
//     >
//       {props.avatar ? (
//         <img src={props.avatar} className="NavbarAvatar" />
//       ) : (
//           <img src={'static/dist/content/images/default-profile-photo.jpg'} className="NavbarAvatar" />
//         )}
//       <span>{props.username}</span>
//     </NavLink>
//   </NavItem>
// );

// export const Forms = props => (
//   <NavItem>
//     <span className="tooltiptext">
//       <Translate contentKey="global.menu.forms" />
//     </span>
//     <NavLink
//       tag={Link}
//       to="/forms"
//       className="d-flex align-items-center"
//       onClick={() => props.toggleMenu()}
//       style={{ color: 'white', textDecoration: 'none' }}
//     >
//       <FontAwesomeIcon icon={faFileAlt} />
//       <Translate contentKey="global.menu.forms" />
//     </NavLink>
//   </NavItem>
// );

// export const Admin = props => (
//   <NavItem>
//     <span className="tooltiptext">
//       <Translate contentKey="profile.menu.entries.admin" />
//     </span>
//     <NavLink
//       tag={Link}
//       to="/admin"
//       className="d-flex align-items-center"
//       onClick={() => props.toggleMenu()}
//       style={{ color: 'white', textDecoration: 'none' }}
//     >
//       <FontAwesomeIcon icon={faUserCog} />
//       <Translate contentKey="profile.menu.entries.admin" />
//     </NavLink>
//   </NavItem>
// );

export const Logout = props => (
  <NavItem>
    <span className="tooltiptext">
      {/* <Translate contentKey="global.menu.account.logout" /> */}
    </span>
    <NavLink
      tag={Link}
      to="/"
      className="d-flex align-items-center"
      onClick={() => props.handleLogout()}
      style={{ color: 'white', textDecoration: 'none' }}
    >
      <FontAwesomeIcon icon="sign-out-alt" />
      {props.translate.useTranslation("logout")}
    </NavLink>
  </NavItem>
);

export const Profile = props => (
  <NavItem>
    <span className="tooltiptext">
      {/* <Translate contentKey="global.menu.account.logout" /> */}
    </span>
    <NavLink
      tag={Link}
      to={'/userpage/' + props.userId}
      className="d-flex align-items-center"
      // onClick={() => props.handleLogout()}
      style={{ color: 'white', textDecoration: 'none' }}
    >
      <FontAwesomeIcon icon="sign-out-alt" />
      {props.username}
    </NavLink>
  </NavItem>
);


export const Home = props => (
  <NavItem>
    <span className="tooltiptext">
      {/* <Translate contentKey="global.menu.account.login" /> */}
    </span>
    <NavLink
      tag={Link}
      to="/LoginForm"
      className="d-flex align-items-center"
      onClick={() => props.toggleMenu()}
      style={{ color: 'white', textDecoration: 'none' }}
    >
      <FontAwesomeIcon icon="user" />
      <span>
        {props.translate.useTranslation("login")}
      </span>
    </NavLink>
  </NavItem>
);

// export const Notifications = props => (
//   <>
//     <ReactTooltip />
//     <NavItem>
//       <div
//         style={{
//           cursor: 'pointer'
//         }}
//         data-tip={translate('profile.menu.entries.notifications')}
//         className={`${styles.notificationsGlobeLink} d-flex align-items-center nav-link`}
//       >
//         {props.count > 0 && <Badge
//           count={props.count}
//           overflowCount={99}
//           style={{
//             left: 8,
//             bottom: 10
//           }}
//         />
//         }
//         <FontAwesomeIcon
//           icon={faGlobeEurope}
//           className={styles.icon}
//         />
//       </div>
//     </NavItem>
//   </>
// );
