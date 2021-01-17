import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Strings from '../../utils/strings';
import { toast } from "../../utils/utils";
import { push } from 'connected-react-router';
import { API, Endpoints } from '../../utils/api';
import './styles.scss';

export class Person extends Component {
    constructor(props) {
		super(props);

		this.state = {
			person: {}
		};
    }

    componentDidMount() {
		this.getPerson();
	}

    getPerson = async () => {
		const { match } = this.props;

        try {
			const response = await API.get({
				url: Endpoints.uriPeople(match.params.id),
			});

			if (response.status >= 200 && response.status < 400) {
				const person = response.data.results
				this.setState({ person });
			}
		} catch (err) {
			toast.error(Strings.errors.somethingWentWrong);
		}
    }

    render () {
        const { dispatch } = this.props;
        const { person } = this.state;

        return (
            <React.Fragment>
                <Helmet>
                    <title>{Strings.people.singleHeader}</title>
                    <meta name="description" content="Description of Users" />
                </Helmet>
                <div className="page">
                    <div className="MovieHeader">
                        {person?.profile_path ? <img
                            src={`https://image.tmdb.org/t/p/original/${person?.profile_path}`}
                            alt={person.name}/> :
                            <div></div>}
                        <div className="MovieInfo">
                            <h2>{person.name}</h2>
                            <p>{person.overview}</p>
                            {person.genres && person.genres.length ?
                                <div className="row">
                                    <h4>{`${Strings.people.genres}: `}</h4>
                                    <p>
                                        {person.genres.map((elem, i) => 
                                            `${elem.name}${i === person.genres.length-1 ? '.' : ','} `)}
                                    </p>
                                </div> :
                                <div></div>
                            }
                        </div>
                    </div>
                    {person.cast && person.cast.length ?
                        <div styles={{ margin: 0 }}>
                            <h4>{`${Strings.people.cast}: `}</h4>
                            <div className="Slider_People">
                                <div className="People">
                                    {person.cast.map((elem, i) =>
                                        <div className="PersonCard" onClick={() => dispatch(push(`/movie/${elem.id}`))}>
                                            {elem?.poster_path || elem?.backdrop_path ?
                                                <img
                                                    src={`https://image.tmdb.org/t/p/original${elem?.poster_path || elem?.backdrop_path}`} />:
                                                    <div className="DetailScreenVideoCard">
                                                        <span>{Strings.errors.whitoutImage}</span>
                                                    </div>}
                                            <span>{elem.Title || elem.title || elem.original_title || elem.name || elem.original_name}</span>
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
                    {person.crew && person.crew.length ?
                        <div styles={{ margin: 0 }}>
                            <h4>{`${Strings.people.crew}: `}</h4>
                            <div className="Slider_People">
                                <div className="People">
                                    {person.crew.map((elem, i) =>
                                        <div className="PersonCard" onClick={() => dispatch(push(`/movie/${elem.id}`))}>
                                            {elem?.poster_path || elem?.backdrop_path ?
                                                <img
                                                    src={`https://image.tmdb.org/t/p/original${elem?.poster_path || elem?.backdrop_path}`} />:
                                                    <div className="DetailScreenVideoCard">
                                                        <span>{Strings.errors.whitoutImage}</span>
                                                    </div>}
                                            <span>{elem.Title || elem.title || elem.original_title || elem.name || elem.original_name}</span>
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

export default connect(mapStateToProps)(Person);
