import getters from './getters.js';
import actions from './actions.js';
import mutations from './mutations.js';

import host from '../../host.js';

export default {
    namespaced: true,
    state() {
        return {
            endpoints: {
                login: `${host}/carry/login`,
                orders: `${host}/carry/order`,
                products: `${host}/carry/product`,
                image: `${host}/stocks/images_gen`,
            },
            user: null,
            token: null,
            products: [],
            stockRecords: [],
            orders: [],
            selectedOrder: null,
        }
    },
    getters,
    actions,
    mutations,
}