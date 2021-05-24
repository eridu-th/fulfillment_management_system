export default {
    async checkLocalToken(context, payload) {
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
    }
}