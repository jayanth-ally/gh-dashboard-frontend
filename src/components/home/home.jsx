import { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {BrowserRouter as Router, Link, Route, Switch, Redirect} from 'react-router-dom'

import { 
    BASE_ROUTE,
    LOGIN_ROUTE,
    HOME_ROUTE,
    PR_ROUTE,
    USER_ROUTE,
    ALL_USERS_ROUTE,
    CREATE_TEAM_ROUTE,
    EDIT_TEAM_ROUTE,
    TEAMS_ROUTE,
    TEAM_ROUTE
} from '../../config/routes';

import HomeDashboard from '../dashboards/homeDashboard';
import PrDashboard from '../dashboards/prDashboard';
import UserDashboard from '../dashboards/userDashboard';
import TeamDashboard from '../dashboards/teamDashboard';
import PR from '../pr/pr';
import User from '../user/user';
import EditTeam from '../team/editTeam';
import Team from '../team/team';

import {logoutUser} from '../../store/users/actions';

import './home.css';
import '../dashboards/dashboards.css';

const Home = (props) => {
    const dispatch = useDispatch();
    const current = useSelector(state => state.users.current);
    const [selectedLink,setSelectedLink] = useState('home');
    
    const links = {
        home:HOME_ROUTE,
        pr:PR_ROUTE,
        users:ALL_USERS_ROUTE,
        manageTeam:TEAMS_ROUTE,
        createTeam:CREATE_TEAM_ROUTE,
        editTeam:EDIT_TEAM_ROUTE
    }

    useEffect(()=>{
        if(!current.isLogged){
            props.history.replace(LOGIN_ROUTE);
        }else{
            const keys = Object.keys(links);
            keys.map((key)=>{
                if(links[key] === props.location.pathname){
                    setSelectedLink(key);
                }
                return key;
            })
        }
    },[])

    const onLinkClicked = (key) => {
        setSelectedLink(key);
    }

    const onClickLogin = () => {
        props.history.push(LOGIN_ROUTE);
    }

    const onClickLogout = () => {
        dispatch(logoutUser());
        props.history.replace(BASE_ROUTE);
        window.location.reload();
    }

    return (
    <Router>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <Link className="navbar-brand col-sm-3 col-md-2 mr-0" to={BASE_ROUTE}>GH Dashboard</Link>
            <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap">
                    {!current.isLogged && <div className="nav-link" onClick={onClickLogin}>Login</div>}
                    {current.isLogged && <div className="nav-link" onClick={onClickLogout}>Logout</div>}
                </li>
            </ul>
        </nav>
        <div className="container-fluid">
            <div className="row">
                <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                    <div className="sidebar-sticky">
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <Link 
                                    className={selectedLink==="home"?"nav-link active":"nav-link"} 
                                    to={links.home} 
                                    onClick={()=>onLinkClicked('home')}
                                    >
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link 
                                    className={selectedLink==="pr"?"nav-link active":"nav-link"} 
                                    to={links.pr}
                                    onClick={()=>onLinkClicked('pr')}
                                    >
                                    Pull Requests
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link 
                                    className={selectedLink==="users"?"nav-link active":"nav-link"} 
                                    to={links.users}
                                    onClick={()=>onLinkClicked('users')}
                                    >
                                    Users
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link 
                                    className={selectedLink==="manageTeam"?"nav-link active":"nav-link"} 
                                    to={links.manageTeam}
                                    onClick={()=>onLinkClicked('manageTeam')}
                                    >
                                    Teams
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">                    
                    {current.isLogged && <Switch>
                        <Route path={PR_ROUTE+'/:owner/:name'} component={PR}/>
                        <Route path={PR_ROUTE} component={PrDashboard}/>
                        <Route path={USER_ROUTE} component={User}/>
                        <Route path={ALL_USERS_ROUTE} component={UserDashboard}/>
                        <Route path={CREATE_TEAM_ROUTE} component={EditTeam}/>
                        <Route path={EDIT_TEAM_ROUTE} component={EditTeam}/>
                        <Route path={TEAMS_ROUTE} component={TeamDashboard}/>
                        <Route path={TEAM_ROUTE} component={Team}/>
                        <Route path={HOME_ROUTE} exact component={HomeDashboard}/>
                        <Redirect to={HOME_ROUTE} />
                    </Switch>}
                </main>
            </div>
        </div>
    </Router> 
    );
}

export default Home;