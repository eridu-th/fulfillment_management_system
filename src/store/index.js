import { createStore } from 'vuex';

import authModule from './modules/auth/index.js';
import carryModule from './modules/carry/index.js';

const store = createStore({
    modules: {
        auth: authModule,
        carry: carryModule,
    },
});

export default store;