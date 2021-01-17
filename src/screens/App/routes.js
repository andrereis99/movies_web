import React from "react";
import { connect } from "react-redux";
import { Route, Redirect, Switch } from "react-router-dom";
import { Movies, Movie, Home, Person } from "../";
// import { Movie } from "../Movie";
  
export class Routes extends React.Component {

    render() {
        const { router } = this.props;
        const { location } = router;

        return (
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/movies/:sorter" component={Movies} />
              <Route
                exact
                path="/movie/:id"
                component={Movie}
              />
              <Route exact path="/person/:id" component={Person} />
              <Redirect to="/" />
            </Switch>
          );
    }
}

const mapStateToProps = state => ({
  router: state.router,
});

export default connect(mapStateToProps)(Routes);