import './footer.scss';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags } from '@fortawesome/free-solid-svg-icons';

const Footer = props => (
  <div className="Footer">
    <hr />
    <div style={{ display: 'flex', justifyContent: 'space-between' }} >
       <span className="column-list">
        <ul><li className="column-list">Upload dataset</li>
        <li className="column-list">Search dataset</li>
        <li className="column-list">About project</li>
        <li className="column-list">Privacy Policy</li>
        <li className="column-list">Sponsors</li>
        <li className="column-list">Develpoers</li></ul>
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
