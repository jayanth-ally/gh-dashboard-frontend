import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';

import reducer from './reducer';

const Store = function () {
    return configureStore({
        reducer,
        devTools:true,
        middleware:[...getDefaultMiddleware()],
    })
}

export default Store;