import './footer.scss';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags } from '@fortawesome/free-solid-svg-icons';

import { NavLink } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';

export const FooterBody = props => (
  <div className="Footer">
    <hr />
    <div style={{ display: 'flex', justifyContent: 'space-between' }} >
       <span className="column-list">
        <ul>
        {props.isAuthenticated ? <li className="column-list"><NavLink tag={Link} to="/uploadPage">{props.translate.useTranslation("upload")}</NavLink></li> : <></>}
        <li className="column-list" onClick={props.resetSearch}><NavLink tag={Link} to="/search">{props.translate.useTranslation("search")}</NavLink></li></ul>
      </span>
      
      <span style={{ fontWeight: 'normal', marginLeft: '20px', marginRight: ' 20px' }}>Made with ❤️ at UPB</span>
      <span>
        <a href="http://support.crescdi.pub.ro"
           target="_blank"
           className="Support">
          <FontAwesomeIcon icon={faTags} />
          {props.translate.useTranslation("support")}
        </a>
      </span>
    </div>
  </div>
);
