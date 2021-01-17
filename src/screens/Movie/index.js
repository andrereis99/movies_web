import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Strings from '../../utils/strings';
import { toast } from "../../utils/utils";
import { push } from 'connected-react-router';
import { API, Endpoints } from '../../utils/api';
import './styles.scss';

export class Movie extends Component {
    constructor(props) {
		super(props);

		this.state = {
			movie: {}
		};
    }

    componentDidMount() {
		this.getMovie();
	}

    getMovie = async () => {
		const { match } = this.props;

        try {
			const response = await API.get({
				url: Endpoints.uriMovies(match.params.id),
			});

			if (response.status >= 200 && response.status < 400) {
				const movie = response.data.results
				this.setState({ movie });
			}
		} catch (err) {
			toast.error(Strings.errors.somethingWentWrong);
		}
    }

    render () {
        const { dispatch } = this.props;
        const { movie } = this.state;
        const title = movie?.Title || movie?.title || movie?.original_title || movie?.name || movie?.original_name;

        return (
            <React.Fragment>
                <Helmet>
                    <title>{Strings.movies.singleHeader}</title>
                    <meta name="description" content="Description of Users" />
                </Helmet>
                <div className="page">
                    <div className="MovieHeader">
                        <img
                            src={movie?.poster_path ? `https://image.tmdb.org/t/p/original/${movie?.poster_path || movie?.backdrop_path}` : movie?.Poster}
                            alt={title}/>
                        <div className="MovieInfo">
                            <h2>{title}</h2>
                            <p>{movie.overview}</p>
                            {movie.genres && movie.genres.length ?
                                <div className="row">
                                    <h4>{`${Strings.movies.genres}: `}</h4>
                                    <p>
                                        {movie.genres.map((elem, i) => 
                                            `${elem.name}${i === movie.genres.length-1 ? '.' : ','} `)}
                                    </p>
                                </div> :
                                <div></div>
                            }
                            {movie.production_companies && movie.production_companies.length ?
                                <div className="row">
                                    <h4>{`${Strings.movies.companies}: `}</h4>
                                    <p>
                                        {movie.production_companies.map((elem, i) =>
                                            `${elem.name}${i === movie.production_companies.length-1 ? '.' : ','} `)}
                                    </p>
                                </div> :
                                <div></div>
                            }
                        </div>
                    </div>
                    {movie.cast && movie.cast.length ?
                        <div styles={{ margin: 0 }}>
                            <h4>{`${Strings.people.cast}: `}</h4>
                            <div className="Slider_People">
                                <div className="People">
                                    {movie.cast.map((elem, i) =>
                                        <div className="PersonCard" onClick={() => dispatch(push(`/person/${elem.id}`))}>
                                            <span>{elem.name}</span>
                                            <span style={{ fontWeight: 'bold' }}>
                                                {`${Strings.people.character}: `}
                                            </span>
                                            <span>{elem.character}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div> :
                        <div></div>
                    }
                    {movie.crew && movie.crew.length ?
                        <div styles={{ margin: 0 }}>
                            <h4>{`${Strings.people.crew}: `}</h4>
                            <div className="Slider_People">
                                <div className="People">
                                    {movie.crew.map((elem, i) =>
                                        <div className="PersonCard" onClick={() => dispatch(push(`/person/${elem.id}`))}>
                                            <span>{elem.name}</span>
                                            <span style={{ fontWeight: 'bold' }}>
                                                {`${Strings.people.department}: `}
                                            </span>
                                            <span>{elem.department}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div> :
                        <div></div>
                    }
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Movie);
