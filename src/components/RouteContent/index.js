/*
 * Content
 */

import React, { Component } from 'react';
import './styles.scss';

export class RouteContent extends Component {
	render() {
		return (
			<div id="app_content" className="RouteWrapper" style={this.props.style || {}}>
				{this.props.children}
			</div>
		);
	}
}

export default RouteContent;