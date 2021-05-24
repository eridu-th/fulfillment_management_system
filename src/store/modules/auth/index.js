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
                logout: `${host}/users/logout`,
                logoutAll: `${host}/users/logoutAll`,
                userInfo: `${host}/users/me`, // get, put, delete
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
            user: {
                name: '',
                phone: '',
                email: '',
                role: '',
            },
        }
    },
    getters,
    actions,
    mutations,
}