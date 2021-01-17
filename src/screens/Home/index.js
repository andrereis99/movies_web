import React, { Component } from 'react'
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { API, Endpoints } from '../../utils/api';
import logo from '../../assets/images/logo.png';
import Strings from '../../utils/strings';
import './styles.scss';

export class Home extends Component {
    render () {
        const { movies } = this.props;

        console.log('movies', movies)

        return (
            <React.Fragment>
                <Helmet>
                    <title>{Strings.movies.header}</title>
                    <meta name="description" content="Description of Users" />
                </Helmet>
                <div className="HomeSection1">
                    <img className="S1Image" src={logo}></img>
                    <span className="Section1Text">
                        {Strings.generic.homeSection1Text}
                    </span>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Home);
