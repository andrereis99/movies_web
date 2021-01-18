import { toast as Toast } from 'react-toastify';
import pptxgen from "pptxgenjs";
import Strings from './strings';

const TOAST_CLOSETIME = 5000;

class Popup {
	warning(message) {
		if (!message) throw new Error(Strings.errors.invalidArgs);

		if (Toast.isActive(`warning_${message}`)) {
			Toast.update(`warning_${message}`, { autoClose: TOAST_CLOSETIME })
		} else {
			Toast.warning(message, { toastId: `warning_${message}` });
		}
	}

	warn(message) {
		this.warning(message);
	}

	success(message) {
		if (!message) throw new Error(Strings.errors.invalidArgs);

		if (Toast.isActive(`success_${message}`)) {
			Toast.update(`success_${message}`, { autoClose: TOAST_CLOSETIME })
		} else {
			Toast.success(message, { toastId: `success_${message}` });
		}
	}

	error(message) {
		if (!message) throw new Error(Strings.errors.invalidArgs);

		if (Toast.isActive(`error_${message}`)) {
			Toast.update(`error_${message}`, { autoClose: TOAST_CLOSETIME })
		} else {
			Toast.error(message, { toastId: `error_${message}` });
		}
	}
}

export const toast = new Popup();


export const downloadPPT = (movies, title) => {
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

		pptx.writeFile(title);
}
