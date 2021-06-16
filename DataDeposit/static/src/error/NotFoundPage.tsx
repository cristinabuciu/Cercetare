import React from 'react';
import { Link } from 'react-router-dom';
import MyTranslator from '../assets/MyTranslator';

class NotFoundPage extends React.Component{
    render(){ 
        const translate = new MyTranslator("common");
        return (
          <div>
            <p style={{textAlign:"center"}}>
            <img src={'static/dist/content/images/404.png'}  />
            <br />
              <Link to="/">{translate.useTranslation('Go-Home')}</Link>
            </p>
          </div>
        );
    }
}
export default NotFoundPage;