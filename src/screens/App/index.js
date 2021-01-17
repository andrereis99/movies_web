import React, { Component } from 'react'
import { ToastContainer, toast } from "react-toastify";
import { Navbar, RouteContent } from "../../components";
import { ErrorBoundary } from "../";
import { connect } from 'react-redux';
import Routes from "./routes";

import '../../styles/styles.scss';
import 'react-toastify/dist/ReactToastify.css';

export class App extends Component {
  constructor(props) {
		super(props);

		this.state = {
			sidebarOpen: window.innerWidth >= 992,
			sidebarHidden: false,
		};

		window.addEventListener('resize', this.handleResize);
	}

  
  	handleResize = () => {
		const isMobile = window.innerWidth < 992;
		this.setState((state) => ({ isMobile, sidebarOpen: !isMobile }));
  	}
  
  	openSidebar = () => {
		this.setState({ sidebarOpen: true });
	}

	closeSidebar = () => {
		if (document.body.clientWidth < 992) {
			this.setState({ sidebarHidden: true, sidebarOpen: false });
		} else {
			this.setState({ sidebarOpen: false });
		}
	}

  	render () {
		return (
		<div className='App'>
			<ToastContainer
						toastClassName='BBToast'
						bodyClassName='BBToastBody'
						hideProgressBar={false}
						closeButton={<></>}
						position={toast.POSITION.BOTTOM_RIGHT}
						autoClose={5000}
					/>
			<Navbar
				open={this.state.sidebarOpen}
				onMobile={(status) =>
					status && this.closeSidebar()
				}
				openSidebar={() => this.openSidebar()}
				closeSidebar={() => this.closeSidebar()}
			/>
			<RouteContent>
			<ErrorBoundary>
				<Routes />
			</ErrorBoundary>
			</RouteContent>

		</div>
		)
	}
}

const mapStateToProps = state => ({});


export default connect(mapStateToProps)(App);
