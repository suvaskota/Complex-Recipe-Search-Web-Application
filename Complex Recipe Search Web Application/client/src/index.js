import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import HomePage from "./pages/HomePage";
import PlayersPage from "./pages/PlayersPage";
import IngredientsPage from "./pages/IngredientsPage";
import "antd/dist/antd.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import MatchesPage from "./pages/MatchesPage";
import RecipesPage from "./pages/RecipesPage";
import RecipePage from "./pages/RecipePage";
import MapRecipesPage from "./pages/MapRecipesPage";

ReactDOM.render(
  <div>
    <Router>
      <Switch>
        <Route exact path="/" render={() => <HomePage />} />
        <Route exact path="/recipes" render={() => <RecipesPage />} />
        <Route exact path="/players" render={() => <PlayersPage />} />
        <Route exact path="/matches" render={() => <MatchesPage />} />
        <Route exact path="/ingredients" render={() => <IngredientsPage />} />
        <Route exact path="/recipe" render={() => <RecipePage />} />
		<Route exact path="/globe" render={() => <MapRecipesPage />} />
      </Switch>
    </Router>
  </div>,
  document.getElementById("root")
);
