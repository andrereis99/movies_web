import React, { Component } from 'react'
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { MovieCard } from '../../components';
import { toast, downloadPPT } from "../../utils/utils";
import { API, Endpoints } from '../../utils/api';
import Strings from '../../utils/strings';
import './styles.scss';

export class Movies extends Component {
    constructor(props) {
		super(props);

		this.state = {
			movies: [],
			param: null
		};
	}

	componentDidMount() {
		const { param } = this.state;
		const { match } = this.props;

		this.setState({ param: match.params.sorter }, () => {
			if (match.params.sorter === 'search') this.searchMovies();
			else this.getMovies();
		});
	}

	componentDidUpdate() {
		const { param } = this.state;
		const { match } = this.props;
		
		if (match.params.sorter === 'search') {
			this.searchMovies();
		} else if (param !== match.params.sorter) {
			this.setState({ param: match.params.sorter }, () => {
				this.getMovies();
			});
		}
	}
    
    getMovies = async () => {
		const { language, match } = this.props;
		const { page } = this.state;

        try {
			const response = await API.get({
				url: Endpoints.uriMovies(`sorted/${match.params.sorter}/${page || 1}/${language}`),
			});

			if (response.status >= 200 && response.status < 400) {
				const movies = response.data.results.results
				console.log('results', movies)
				this.setState({ movies });
			}
		} catch (err) {
			toast.error(Strings.errors.somethingWentWrong);
		}
	}

	searchMovies = async () => {
		const { language, search } = this.props;
		const { page } = this.state;

		if (search === this.state.search) return;

		this.setState({ search }, async () => {
			try {
				const response = await API.get({
					url: Endpoints.uriMovies(`search/${search}/${page || 1}/${language}`),
				});
	
				if (response.status >= 200 && response.status < 400) {
					const movies = response.data.results.results
					console.log('results', movies)
					this.setState({ movies });
				}
			} catch (err) {
				toast.error(Strings.errors.somethingWentWrong);
			}
		})
	}
	
	getTitle = () => {
		const { match } = this.props;
		
		if (match.params.sorter === 'popular') return Strings.movies.popular;
		else if (match.params.sorter === 'top_rated') return Strings.movies.top_rated;
		else if (match.params.sorter === 'upcoming') return Strings.movies.upcoming;
		else return Strings.movies.header;
	}

    render () {
        const { dispatch } = this.props;
        const { movies } = this.state;

        const title = this.getTitle();

        return (
            <React.Fragment>
                <Helmet>
                    <title>{Strings.movies.header}</title>
                    <meta name="description" content="Description of Users" />
                </Helmet>
                {movies && movies.length ?
					<div>
						<div className='Header'>
							<h1>{title}</h1>
							<Button
								className='DownloadButton'
								onClick={() => {
									downloadPPT(this.state.movies, this.getTitle())
								}}>
								<span>{`${Strings.generic.download} ${title}`}</span>
							</Button>
						</div>
						<div
							key={`moviesGrid_${movies}`}
							className="Movies_container">
								{movies.map(elem => (
									<MovieCard
										key={elem.id}
										movie={elem}
									/>
								))}
						</div>
					</div> :
					<div>
						{Strings.errors.noResultsWereFound}
					</div>}
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
	search: state?.router?.location?.state?.search,
});

export default connect(mapStateToProps)(Movies);
