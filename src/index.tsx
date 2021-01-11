import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import HelpPage from './components/HelpPage';
import * as serviceWorker from './serviceWorker';
import $ from 'jquery';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
const hist = createBrowserHistory();

ReactDOM.render(
  <BrowserRouter history={hist}>
    <Switch>
      <Switch>
        <Route path="/index" render={(props: any) => <App {...props} />} />
        <Route
          path="/USAC-budget"
          render={(props: any) => <App {...props} />}
        />
        <Route
          path="/help-page"
          render={(props: any) => <HelpPage {...props} />}
        />
        <Redirect to="/help-page" />
        <Redirect from="/" to="/help-page" />
      </Switch>
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
