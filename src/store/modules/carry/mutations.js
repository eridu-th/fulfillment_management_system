export default {
    user(state, payload) {
        state.user = payload.user;
    },
    token(state, payload) {
        state.token = payload.token;
    },
    products(state, payload) {
        state.products = payload.products;
    },
    orders(state, payload) {
        state.orders = payload.orders;
    },
    stockRecords(state, payload) {
        state.stockRecords = payload.stockRecords;
    },
    error(state, payload) {
        state.error = payload.message || 'something went wrong during login';
    },
    reset(state) {
        state.user = null;
    },
}