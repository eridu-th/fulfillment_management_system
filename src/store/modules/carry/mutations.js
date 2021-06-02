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
    stockRecords(state, payload) {
        state.stockRecords = payload.stockRecords;
    },
    orders(state, payload) {
        state.orders = payload.orders;
    },
    selectedOrder(state, payload) {
        state.selectedOrder = payload.selectedOrder;
    },
    error(state, payload) {
        state.error = payload.message || 'something went wrong during login';
    },
    reset(state) {
        state.user = null;
    },
}