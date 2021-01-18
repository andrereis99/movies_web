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
			param: null,
			page: 1,
			totalPages: 1,
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
				url: Endpoints.uriMovies(`sorted/${match.params.sorter}/${page || 1}/${language || ''}`),
			});

			if (response.status >= 200 && response.status < 400) {
				const results = response.data.results
				this.setState({
					movies: results.results,
					page: results.page,
					totalPages: results.total_pages,
				});
			}
		} catch (err) {
			toast.error(Strings.errors.somethingWentWrong);
		}
	}

	searchMovies = async pageChanged => {
		const { language, search } = this.props;
		const { page } = this.state;

		if (search === this.state.search && !pageChanged) return;

		this.setState({ search, page: 1 }, async () => {
			try {
				const response = await API.get({
					url: Endpoints.uriMovies(`search/${search}/${page}/${language || ''}`),
				});
	
				if (response.status >= 200 && response.status < 400) {
					const results = response.data.results
					this.setState({
						movies: results.results,
						page: results.page,
						totalPages: results.total_pages,
					});
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

	changePage = (page) => {
		const { totalPages } = this.state;
		const { match } = this.props;

		if (page > totalPages || page < 1 || page === this.state.page) return;

		this.setState({ page }, () => {
			if (match.params.sorter === 'search') {
				this.searchMovies(true);
			} else {
				this.getMovies();
			}
		})
	}

	renderPagination() {
		const { page, totalPages } = this.state;

		let pages = [];
		if (totalPages < 9) {
			for (let i = 1; i < totalPages; i++) {
				pages.push(<div
					className={`PageNumber ${page === i ? '__active' : ''}`}
					onClick={() => this.changePage(i)}>
					{i}
				</div>);
			}
		} else {
			const start = page > 5 ? page - 4 : 1;
			const range = totalPages - page > 5 ? page + 3 : totalPages+1;
			for (let i = start; i < range; i++) {
				pages.push(<div
					className={`PageNumber ${page === i ? '__active' : ''}`}
					onClick={() => this.changePage(i)}>
					{i}
				</div>);
			}
		}

		return (
			<div className="Pagination" key={`${page}_${totalPages}`}>
				<div
					className="PageNumber"
					onClick={() => this.changePage(1)}>
					&#8810;
				</div>
				<div
					className="PageNumber"
					onClick={() => this.changePage(this.state.page-1)}>
					&#x3c;
				</div>
				{page > 5 && <div className="PageNumber">...</div>}
				{pages}
				{page < totalPages - 5 && <div className="PageNumber">...</div>}
				<div
					className="PageNumber"
					onClick={() => this.changePage(this.state.page+1)}>
					&#x3e;
				</div>
				<div
					className="PageNumber"
					onClick={() => this.changePage(totalPages)}>
					&#x226B;
				</div>
			</div>
		)
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
						{this.renderPagination()}
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
