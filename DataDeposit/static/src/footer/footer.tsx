import './footer.scss';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags } from '@fortawesome/free-solid-svg-icons';

import { Nav } from 'react-bootstrap';
import { NavLink } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';

const Footer = props => (
  <div className="Footer">
    <hr />
    <div style={{ display: 'flex', justifyContent: 'space-between' }} >
       <span className="column-list">
        <ul><li className="column-list"><Nav.Link href="/uploadPage">Upload dataset</Nav.Link></li>
        <li className="column-list"><Nav.Link href="/">Search dataset</Nav.Link></li></ul>
      </span>
      
      <span style={{ fontWeight: 'normal', marginLeft: '20px', marginRight: ' 20px' }}>Made with ❤️ at UPB</span>
      <span>
        <a href="http://support.crescdi.pub.ro"
           target="_blank"
           className="Support">
          <FontAwesomeIcon icon={faTags} />
          Support
        </a>
      </span>
    </div>
  </div>
);

export default Footer;
