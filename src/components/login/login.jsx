import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {loginUser} from '../../store/users/actions';
import{BASE_ROUTE} from '../../config/routes';

const Login = (props) => {
    const dispatch = useDispatch();
    const current = useSelector(state => state.users.current);

    useEffect(()=>{
        if(current.isLogged){
            props.history.replace(BASE_ROUTE);
        }
    },[dispatch])

    const onClickLogin = () => {
        const user = {
            name:'Jayanth',
            jwt:'sample JWT'
        }
        dispatch(loginUser(user));
        props.history.replace(BASE_ROUTE);
    }
    return <div>
        <button onClick={onClickLogin}>Login</button>
    </div>
}

export default Login;