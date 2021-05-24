export default {
    async editUserData(context, payload) {
        try {
            const headers = await fetch(context.state.endpoints.header, {
                method: 'post',
            }).then(res => res.json());

            const token = context.getters['token'];

            const response = await fetch(context.state.endpoints.userInfo, {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Authorization': token,
                    'client-token': headers['client-token'],
                    'time-stamp': headers['time-stamp'],
                    'time-signature': headers['time-signature'],
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: payload.name,
                    email: payload.email,
                    phone: payload.phone,
                }),
            }).then(res => res.json());

            if (response.resCode === 200) {
                context.state.user.name = response.user.name;
                context.state.user.email = response.user.email;
                context.state.user.phone = response.user.phone;
            }

            return response;

        } catch (err) {
            context.commit('error', err);
        }
    },
    async fetchUserData(context, payload) {
        try {
            const headers = await fetch(context.state.endpoints.header, {
                method: 'post',
            }).then(res => res.json());

            const response = await fetch(context.state.endpoints.userInfo, {
                method: 'get',
                mode: 'cors',
                headers: {
                    'Authorization': payload.token,
                    'client-token': headers['client-token'],
                    'time-stamp': headers['time-stamp'],
                    'time-signature': headers['time-signature'],
                    'Content-Type': 'application/json',
                },
            }).then(res => res.json());

            context.commit('user', {
                name: response.name,
                email: response.email,
                phone: response.phone,
                role: response.role,
            });
        } catch (err) {
            context.commit('error', err);
        }
    },
    async checkLocalToken(context, payload) {
        try {
            const headers = await fetch(context.state.endpoints.header, {
                method: 'post',
            }).then(res => res.json());

            const response = await fetch(context.state.endpoints.checkToken, {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Authorization': payload.token,
                    'client-token': headers['client-token'],
                    'time-stamp': headers['time-stamp'],
                    'time-signature': headers['time-signature'],
                    'Content-Type': 'application/json',
                },
            }).then(res => res.json());

            if (response.resCode === 200) {
                context.commit('login', {
                    token: payload.token,
                });
            }
        } catch (err) {
            context.commit('error', err);
        }
    },
    async validatePhone(context, payload) {
        const endpoints = context.getters["endpoints"];
        const headers = await context.dispatch('createHeaders');
        const response = await fetch(endpoints.checkExistPhone, {
            method: "post",
            headers: {
                "client-token": headers["client-token"],
                "time-stamp": headers["time-stamp"],
                "time-signature": headers["time-signature"],
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                phone: payload.phone,
            }),
        }).then((res) => res.json());

        return response;
    },
    async validateEmail(context, payload) {
        const endpoints = context.getters["endpoints"];
        const headers = await context.dispatch('createHeaders');
        const response = await fetch(endpoints.checkExistEmail, {
            method: "post",
            headers: {
                "client-token": headers["client-token"],
                "time-stamp": headers["time-stamp"],
                "time-signature": headers["time-signature"],
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: payload.email,
            }),
        }).then((res) => res.json());

        return response;
    },
    async login(context, payload) {
        try {
            const { email, password } = payload;
            const headers = await fetch(context.state.endpoints.header, {
                method: 'post',
            }).then(res => res.json());

            const response = await fetch(context.state.endpoints.login, {
                method: 'post',
                mode: 'cors',
                headers: {
                    'client-token': headers['client-token'],
                    'time-stamp': headers['time-stamp'],
                    'time-signature': headers['time-signature'],
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                })
            }).then(res => res.json());

            if (response.resCode === 200) {
                if (payload.remember) {
                    localStorage.setItem('token', response.token);
                } else {
                    sessionStorage.setItem('token', response.token);
                }
                context.commit('login', {
                    token: response.token,
                });
            } else {
                context.commit('error', response);
            }
        } catch (err) {
            context.commit('error', err);
        }
    },
    async logout(context) {
        try {
            const headers = await fetch(context.state.endpoints.header, {
                method: 'post',
            }).then(res => res.json());

            const response = await fetch(context.state.endpoints.logout, {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Authorization': context.state.token,
                    'client-token': headers['client-token'],
                    'time-stamp': headers['time-stamp'],
                    'time-signature': headers['time-signature'],
                    'Content-Type': 'application/json',
                },
            }).then(res => res.json());

            if (response.resCode === 200) {
                localStorage.clear();
                sessionStorage.clear();
                context.commit('reset');
            } else {
                throw new Error(response);
            }
        } catch (err) {
            context.commit('error', err);
        }
    },
    async logoutAll(context) {
        try {
            const headers = await fetch(context.state.endpoints.header, {
                method: 'post',
            }).then(res => res.json());

            const response = await fetch(context.state.endpoints.logoutAll, {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Authorization': context.state.token,
                    'client-token': headers['client-token'],
                    'time-stamp': headers['time-stamp'],
                    'time-signature': headers['time-signature'],
                    'Content-Type': 'application/json',
                },
            }).then(res => res.json());

            if (response.resCode === 200) {
                localStorage.clear();
                sessionStorage.clear();
                context.commit('reset');
            } else {
                throw new Error(response);
            }
        } catch (err) {
            context.commit('error', err);
        }
    },
    async createHeaders(context) {
        const endpoints = context.getters["endpoints"];
        const headers = await fetch(endpoints.header, {
            method: "post",
        }).then((res) => res.json());

        return headers;
    },
}