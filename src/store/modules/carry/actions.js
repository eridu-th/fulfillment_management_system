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
    async createOrder(context, payload) {
        try {
            const headers = await fetch(context.rootState.auth.endpoints.header, {
                method: 'post',
            }).then(res => res.json());

            const token = context.rootState.auth.token;
            const carryToken = context.state.token;

            // token for testing
            // const carryToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IlRlc3QgMSIsInVzZXJfbG9naW4iOiJzaDEiLCJjcmVhdGVfZGF0ZSI6IjIwMjEtMDUtMTcgMTY6MjU6NDEifQ.Yr_KXfjmCqbeE7k3W34_viUFzpfzSbywKe43ghefA5k`;

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
                        name_send: payload.name_send,
                        tel_send: payload.tel_send,
                        address_send: payload.address_send,
                        post_send: payload.post_send,
                        name_cust: payload.name_cust,
                        tel: payload.tel,
                        address: payload.address,
                        Post: payload.Post,
                        Balance: payload.Balance,
                        type_send: payload.type_send,
                        node: payload.node,
                        // node: [{ "barcode_number": "S13720191", "amount": "2" }], // for testing purpose
                    },
                }),
            }).then(res => res.json());
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
            const carryToken = context.state.token;

            // token for all products
            // const carryToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IlRlc3QgMSIsInVzZXJfbG9naW4iOiJzaDEiLCJjcmVhdGVfZGF0ZSI6IjIwMTktMTEtMTMgMTc6NTA6MzUifQ.5TTtPLS3h-4Gi0uH2sefEek6yIL8_uYgiqLH6w916dI`;

            // token for stock records
            // const carryStockToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3QgMiIsInVzZXJfbG9naW4iOiJzaDIiLCJjcmVhdGVfZGF0ZSI6IjIwMTktMTEtMjEgMTc6NTU6NTAifQ.bYDd-3uQ44m2_JqNE-leGcBlgjKH-LaGx4y2d2ZF_xI`;

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
                    // token: payload.type === 'products' ? carryToken : carryStockToken,
                    token: carryToken,
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
    async getOrders(context, payload) {
        try {
            const headers = await fetch(context.rootState.auth.endpoints.header, {
                method: 'post',
            }).then(res => res.json());

            const token = context.rootState.auth.token;
            const carryToken = context.state.token;
            // const carryToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IlRlc3QgMSIsInVzZXJfbG9naW4iOiJzaDEiLCJjcmVhdGVfZGF0ZSI6IjIwMjEtMDUtMTcgMTQ6MTk6MjUifQ.gaO6zWR-KUtiQI112fL4pixNIhb5yaM2PsnJRrQ-OTE`;

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

            if (response.resCode === 200) {
                if (payload.type === 'get_order_list') {
                    // start
                    /*
                        this is noticed to block on 2021/07/14
                    */
                    response.data.data = response.data.data.filter(item => {
                        return item.order_number !== 'O824004';
                    });
                    // end
                    context.commit('orders', { orders: response.data.data });
                } else if (payload.type === 'get_order_detail') {
                    context.commit('selectedOrder', { selectedOrder: response.data });
                }
                return response;
            } else {
                throw new Error(response);
            }
        } catch (err) {
            context.commit('error', err);
        }
    },
}