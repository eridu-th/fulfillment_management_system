export default {
    login(state, payload) {
        state.auth = true;
        state.token = payload.token;
    },
    logout(state) {
        state.auth = false;
        state.token = null;
    },
    error(state, payload) {
        state.error = payload.message || 'something went wrong during login';
    }
}