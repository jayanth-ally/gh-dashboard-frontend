import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'

import {LOGIN_ROUTE, HOME_ROUTE, PR_ROUTE, ALL_USERS_ROUTE, USER_ROUTE, TEAM_ROUTE, TEAMS_ROUTE} from './config/routes';

import Login from './components/login/login'
import Home from './components/home/home';

const App = () => {

  return (
    <div className="App">
      <Router>
            <Switch>
              <Route path={LOGIN_ROUTE} component={Login}/>
              <Route path={PR_ROUTE} component={Home}/>
              <Route path={USER_ROUTE} component={Home}/>
              <Route path={ALL_USERS_ROUTE} component={Home}/>
              <Route path={TEAMS_ROUTE} component={Home}/>
              <Route path={TEAM_ROUTE} component={Home}/>
              <Route path={HOME_ROUTE} exact component={Home}/>
              <Redirect to={HOME_ROUTE} />
            </Switch>
      </Router>  
    </div>
  );
}

export default App;
