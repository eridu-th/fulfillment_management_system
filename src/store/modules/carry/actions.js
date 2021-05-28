export default {
    async login(context) {
        try {
            const headers = await fetch(context.rootState.auth.endpoints.header, {
                method: 'post',
            }).then(res => res.json());

            const token = context.rootState.auth.token;

            const response = await fetch(context.state.endpoints.login, {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Authorization': token,
                    'client-token': headers['client-token'],
                    'time-stamp': headers['time-stamp'],
                    'time-signature': headers['time-signature'],
                    'Content-Type': 'application/json',
                }
            }).then(res => res.json());

            if (response.status === 200) {
                context.commit('user', { user: response.data });
                context.commit('token', { token: response.data.token });
            }

            return response;
        } catch (err) {
            context.commit('error', err);
        }
    },
    async addShop(context, payload) {
        try {
            const headers = await fetch(context.rootState.auth.endpoints.header, {
                method: 'post',
            }).then(res => res.json());

            const token = context.rootState.auth.token;
            const carryToken = context.state.token;

            const response = await fetch(context.state.endpoints.addShop, {
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
                    token: carryToken,
                    data: payload, // follow carry POST Add order shop BODY
                }),
            }).then(res => res.json());
            return response;
        } catch (err) {
            context.commit('error', err);
        }
    },
    async getOrders(context, payload) {
        try {
            const headers = await fetch(context.rootState.auth.endpoints.header, {
                method: 'post',
            }).then(res => res.json());

            const token = context.rootState.auth.token;
            // const carryToken = context.state.token;
            const carryToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IlRlc3QgMSIsInVzZXJfbG9naW4iOiJzaDEiLCJjcmVhdGVfZGF0ZSI6IjIwMjEtMDUtMTcgMTQ6MTk6MjUifQ.gaO6zWR-KUtiQI112fL4pixNIhb5yaM2PsnJRrQ-OTE`;

            const response = await fetch(context.state.endpoints.orders, {
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
                    token: carryToken,
                    data: {
                        type: payload.type,
                        page: payload.page,
                        id: payload.id,
                        k_filter: payload.filter,
                        k_start: payload.start,
                        k_end: payload.end,
                    },
                }),
            }).then(res => res.json());

            context.commit('orders', { orders: response.data });

            return response;
        } catch (err) {
            context.commit('error', err);
        }
    },
    async getProducts(context, payload) {
        try {
            const headers = await fetch(context.rootState.auth.endpoints.header, {
                method: 'post',
            }).then(res => res.json());

            const token = context.rootState.auth.token;
            // const carryToken = context.state.token;

            // token for all products
            const carryToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IlRlc3QgMSIsInVzZXJfbG9naW4iOiJzaDEiLCJjcmVhdGVfZGF0ZSI6IjIwMTktMTEtMTMgMTc6NTA6MzUifQ.5TTtPLS3h-4Gi0uH2sefEek6yIL8_uYgiqLH6w916dI`;

            // token for stock records
            const carryStockToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3QgMiIsInVzZXJfbG9naW4iOiJzaDIiLCJjcmVhdGVfZGF0ZSI6IjIwMTktMTEtMjEgMTc6NTU6NTAifQ.bYDd-3uQ44m2_JqNE-leGcBlgjKH-LaGx4y2d2ZF_xI`;

            const response = await fetch(context.state.endpoints.products, {
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
                    token: payload.type === 'products' ? carryToken : carryStockToken,
                    data: {
                        type: payload.type,
                        status: payload.status,
                        k_start: payload.start,
                        k_end: payload.end,
                    },
                }),
            }).then(res => res.json());

            switch (payload.type) {
                case 'product':
                    context.commit('products', { products: response.data });
                    break;
                case 'product_stock':
                    context.commit('stockRecords', { stockRecords: response.data });
                    break;
                default:
                    break;
            }

            return response;
        } catch (err) {
            context.commit('error', err);
        }
    },
}