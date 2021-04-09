import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'

import {LOGIN_ROUTE, HOME_ROUTE} from './config/routes';

import Login from './components/login/login'
import Home from './components/home/home';

const App = () => {

  return (
    <div className="App">
      <Router>
            <Switch>
              <Route path={LOGIN_ROUTE} component={Login}/>
              <Route path={HOME_ROUTE} exact component={Home}/>
              <Redirect to={HOME_ROUTE} />
            </Switch>
      </Router>  
    </div>
  );
}

export default App;
