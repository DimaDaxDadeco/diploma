import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { CoordinateAxes } from "components";
import configureStore from "./store/configureStore";
import { Router, Route, browserHistory, IndexRoute } from "react-router";
import App from "./app";

(() => {
    const localStorageNames = ["favourites", "recentSearches"];
    localStorageNames.forEach(item => {
        if (!localStorage[item]) {
            localStorage[item] = JSON.stringify([]);
        }
    });
})();

const store = configureStore();

render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={CoordinateAxes} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById("container")
);