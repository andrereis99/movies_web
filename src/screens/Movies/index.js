import React, { Component } from 'react'
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { push } from 'connected-react-router';
import pptxgen from "pptxgenjs";
import { MovieCard } from '../../components';
import { toast } from "../../utils/utils";
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

		console.log('here1')
		this.setState({ param: match.params.sorter }, this.getMovies);
	}

	componentDidUpdate() {
		const { param } = this.state;
		const { match } = this.props;
		
		if (param !== match.params.sorter) {
			console.log('here2')
			this.setState({ param: match.params.sorter }, this.getMovies);
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
	
	getTitle = () => {
		const { match } = this.props;
		
		if (match.params.sorter === 'popular') return Strings.movies.popular;
		else if (match.params.sorter === 'top_rated') return Strings.movies.top_rated;
		else if (match.params.sorter === 'upcoming') return Strings.movies.upcoming;
		else return Strings.movies.header;
	}

	downloadPPT = () => {
		const { movies } = this.state;
		const pptx = new pptxgen();

            for(const movie of movies) {
                var slide = pptx.addSlide();
                
                slide.addText(
                    movie.Title || movie.title || movie.original_title || movie.name || movie.original_name,
                    { x:0.25, y:0.25, w:'100%', h:1.5, fontSize:24, color:'0088CC' }
                );

                {movie.Director && slide.addText(
                   movie.Director,
                   { x:0.25, y:1.5, w:'100%', h:0.5, fontSize:14, color:'878787' }
                )}

                slide.addText(
                   movie.release_date || movie.first_air_date,
                   { x:1.25, y:1.5, w:'100%', h:0.5, fontSize:14, color:'878787' }
                )

                slide.addText(
                    movie.overview,
                    { x:0.0, y:2.45, w:'100%', h:3.1, align:'center', justifyContent:'start' , fontSize:16, color:'878787' }
                )

                const poster = movie.poster_path || movie.backdrop_path

                {poster && slide.addImage({ path:`https://image.tmdb.org/t/p/original/${poster}`, x:7.5, y:0.25, w:1.6, h:2.2 })}
            }

            pptx.writeFile(this.getTitle());
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
									this.downloadPPT()
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

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Movies);
