import React from 'react';
import { Link } from 'react-router-dom';

class NotFoundPage extends React.Component{
    render(){
        return <div>
            <p style={{textAlign:"center"}}>
            <img src={'/content/images/404.png'}  />
            <br />
              <Link to="/">Go to Home </Link>
            </p>
          </div>;
    }
}

export default NotFoundPage;