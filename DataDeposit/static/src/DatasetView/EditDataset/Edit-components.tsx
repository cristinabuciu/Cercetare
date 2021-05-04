import './Edit.scss';
import React from 'react';

import { CardBody, Row, Col, Button } from 'reactstrap';

export const ResourceToDownload = (props) => {
	let handleDownloadBind = props.handleDownload.bind();
	return (
	<>
		<span>{props.firstName}</span>
		<div className="ResourceToDownloadClass" onClick={(e) => handleDownloadBind()}>
			{props.name}
		</div>
	</>
	);
  }



