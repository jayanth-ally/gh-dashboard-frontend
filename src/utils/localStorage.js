const isUserLoggedIn = () => {
    const logged = localStorage.getItem('logged');
    if(logged) return true;
    return false;
}

const getUserLogin = () => {
    const logged = localStorage.getItem('logged');
    const user = localStorage.getItem('user');
    if(logged) return JSON.parse(user);
    return {};
}

const setUserLogin = (user) => {
    localStorage.setItem('logged',true);
    localStorage.setItem('user',JSON.stringify(user));
}

const logoutUser = () => {
    localStorage.removeItem('logged');
    localStorage.removeItem('user');
}

export {
    isUserLoggedIn,
    getUserLogin,
    setUserLogin,
    logoutUser
}