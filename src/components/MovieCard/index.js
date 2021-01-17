/**
 *
 * MovieCard
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Input, Button } from 'antd';
import logo from '../../assets/images/logo.png';
import Strings from '../../utils/strings';
import './styles.scss';

export class MovieCard extends React.PureComponent {
    constructor(props) {
		super(props);

		this.state = {};
    }

    getVoreClass = (vote) => {
        if (vote >= 7) return 'good';
        if (vote >= 5) return 'average';
        else return 'bad';
    }

    render() {
        const { movie, dispatch } = this.props;
        const title = movie?.Title || movie?.title || movie?.original_title || movie?.name || movie?.original_name;
        const voteClass = this.getVoreClass(movie.vote_average);

        return (
            <div className="MovieCard" onClick={() => dispatch(push(`/movie/${movie.id}`))}>
                <img
                    src={`https://image.tmdb.org/t/p/original/${movie?.poster_path || movie?.backdrop_path}`}
                    alt={title}/>
                <div className="MovieCard_info">
                    <h3>{title}</h3>
                    <span className={voteClass}>
                        {movie.vote_average}
                        <div className="separator"></div>
                    </span>
                </div>
                <div className="MovieCard_overview">
                    <h3>{`${Strings.movies.overview}: `}</h3>
                    <p>{movie.overview}</p>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(MovieCard);
