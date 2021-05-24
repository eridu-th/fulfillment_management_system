import getters from './getters.js';
import actions from './actions.js';
import mutations from './mutations.js';

// const host = 'http://localhost:3000';
const host = "https://eridu-app.herokuapp.com";

export default {
    namespaced: true,
    state() {
        return {
            endpoints: {
                login: `${host}/users/login`,
                header: `${host}/header`,
                checkToken: `${host}/checkToken`,
                resetToken: `${host}/resetToken`,
                verifyResetToken: `${host}/resetToken/verify`,
                resetPassword: `${host}/resetToken/resetpassword`,
                checkExistEmail: `${host}/users/exist/email`,
                checkExistPhone: `${host}/users/exist/phone`,
                createUser: `${host}/users`,
            },
            auth: false,
            token: null,
            headers: null,
            error: null,
        }
    },
    getters,
    actions,
    mutations,
}