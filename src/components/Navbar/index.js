/**
 *
 * Navbar
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Input, Button } from 'antd';
import logo from '../../assets/images/logo.png';
import Strings from '../../utils/strings';
import './styles.scss';

export class Navbar extends React.PureComponent {
    constructor(props) {
		super(props);

		this.state = {
            activeTab: '/',
            search: '',
        };
    }

    goTo(url) {
        const { dispatch, language } = this.props;
        console.log('language', language)
        const clientWidth = document.body.clientWidth;
        this.setState({ activeTab: url });
        this.props.onMobile(clientWidth < 992);
        dispatch(push('/'));
        dispatch(push(`/${url}`));
    }

    render() {
        const { activeTab } = this.state;
        const { dispatch } = this.props;

        return (
            <div className="NavbarWrapper" key={window.location}>
                <div className={'NavbarContainer'}>
                    <div className="NavbarHome">
                        <a className="NavbarLogoContainer" onClick={this.goToHomepage} href="/">
                            <img className="Logo" alt="Logo" src={logo} />
                        </a>
                    </div>
                    <div className="NavbarContent">
                        <a
                            className={`NavbarLink ${activeTab === 'movies/popular' ? '__active' : ''}`}
                            onClick={e => {
                                e.preventDefault();
                                if (window.location !== "/movies/popular") this.goTo('movies/popular');
                            }}
                            href="/">
                            {Strings.movies.popular}
                        </a>
                        <a
                            className={`NavbarLink ${activeTab === 'movies/top_rated' ? '__active' : ''}`}
                            onClick={e => {
                                e.preventDefault();
                                if (window.location !== "/movies/top_rated") this.goTo('movies/top_rated');
                            }}
                            href="/">
                            {Strings.movies.top_rated}
                        </a>
                        <a
                            className={`NavbarLink ${activeTab === 'movies/upcoming' ? '__active' : ''}`}
                            onClick={e => {
                                e.preventDefault();
                                if (window.location !== "/movies/upcoming") this.goTo('movies/upcoming');
                            }}
                            href="/">
                            {Strings.movies.upcoming}
                        </a>
                    </div>
                    <div className="NavbarSearch">
                        <Input className="Search"
                            placeholder={Strings.generic.search}
                            value={this.state.search}
                            onChange={e => this.setState({ search: e.target.value })}
                        />
                        <Button
                            className='SearchButton'
                            onClick={() => {
                                dispatch(push(`/search/${this.state.search}`))
                            }}>
                            <span>
                                {Strings.generic.search}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    language: state.language,
});

export default connect(mapStateToProps)(Navbar);
