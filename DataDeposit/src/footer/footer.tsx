import './footer.scss';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate } from 'react-jhipster';
import { faTags } from '@fortawesome/free-solid-svg-icons';

const Footer = props => (
  <div className="Footer">
    <hr />
    <div style={{ display: 'flex', justifyContent: 'space-between' }} >
       <span><a
         className="Support"
         style={{ visibility: 'hidden' }}>
        <FontAwesomeIcon icon={faTags} />
          <Translate contentKey="global.menu.support" />
      </a></span>
      <span style={{ fontWeight: 'normal', marginLeft: '20px', marginRight: ' 20px' }}>Made with ❤️ at UPB</span>
      <span>
        <a href="http://support.crescdi.pub.ro"
           target="_blank"
           className="Support">
          <FontAwesomeIcon icon={faTags} />
          <Translate contentKey="global.menu.support" />
        </a>
      </span>
    </div>
  </div>
);

export default Footer;
