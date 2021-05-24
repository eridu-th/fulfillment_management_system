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
    },
    user(state, payload) {
        state.user.name = payload.name;
        state.user.phone = payload.phone;
        state.user.email = payload.email;
        state.user.role = payload.role;
    },
    reset(state) {
        state.auth = false;
        state.token = null;
        state.headers = null;
        state.error = null;
        state.user = {
            name: '',
            phone: '',
            email: '',
            role: '',
        };
    },
}