import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import '../styles/App.css';

import Header from "./Header"
import LinkList from "./Link/LinkList"
import CreateLink from "./Link/CreateLink"
import Login from "./Authentication/Login"
import Search from './Search/Search';

function App() {
  return (
    <div className="center w85">
      <Header />
      <div className="ph3 pv1 background-gray">
        <Switch>
          <Route exact path="/" render={() => <Redirect to='/new/1' />} />
          <Route exact path="/create" component={CreateLink} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/search" component={Search} />
          <Route exact path="/top" component={LinkList} />
          <Route exact path="/new/:page" component={LinkList} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
