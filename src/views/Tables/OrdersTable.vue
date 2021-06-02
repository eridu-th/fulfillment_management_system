<template>
    <teleport to="body">
        <error-alert v-if="isError" @close="closeAlert" :content="errorMessage">
        </error-alert>
    </teleport>
    <teleport to="body">
        <router-view></router-view>
    </teleport>
    <div class="card shadow" :class="type === 'dark' ? 'bg-default' : ''">
        <div
            class="card-header border-0"
            :class="type === 'dark' ? 'bg-transparent' : ''"
        >
            <div class="row align-items-center">
                <div class="col-sm-3 col-xl-6">
                    <h3
                        class="mb-0"
                        :class="type === 'dark' ? 'text-white' : ''"
                    >
                        {{ title }}
                    </h3>
                </div>
                <div class="col-sm-9 col-xl-6 text-right">
                    <form
                        class="d-flex flex-column flex-sm-row justify-content-sm-end align-items-center"
                        @submit.prevent="clearSearchInput"
                    >
                        <div class="clearInput">
                            <label for="search_product">Search Product</label>
                            <button
                                class="btn btn-primary btn-sm my-2"
                                type="submit"
                            >
                                Clear
                            </button>
                        </div>
                        <input
                            type="text"
                            id="search_product"
                            class="mx-2 form-control"
                            v-model.trim="searchInput"
                            @input="searchProduct"
                        />
                    </form>
                </div>
            </div>
            <div class="row align-items-center">
                <div class="col-sm text-right">
                    <form
                        class="d-flex flex-column flex-lg-row justify-content-sm-center justify-content-lg-end align-items-center"
                        @submit.prevent
                    >
                        <date-picker
                            v-model="range"
                            mode="dateTime"
                            :masks="masks"
                            is-range
                            color="orange"
                        >
                            <template
                                v-slot="{ inputValue, inputEvents, isDragging }"
                            >
                                <div
                                    class="d-flex flex-column flex-sm-row flex-md-column flex-lg-row justify-content-lg-end align-items-center"
                                >
                                    <div class="input_wrapper">
                                        <div class="relative flex-grow">
                                            <label for="start_date"
                                                >Start</label
                                            >
                                        </div>
                                        <div class="relative flex-grow">
                                            <svg
                                                class="text-gray-600 w-4 h-full mx-2 absolute pointer-events-none"
                                                fill="none"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                ></path>
                                            </svg>
                                            <input
                                                id="start_date"
                                                class="flex-grow py-1 bg-gray-100 border rounded w-full"
                                                :class="
                                                    isDragging
                                                        ? 'text-gray-600'
                                                        : 'text-gray-900'
                                                "
                                                :value="inputValue.start"
                                                v-on="inputEvents.start"
                                            />
                                        </div>
                                    </div>
                                    <div class="input_wrapper">
                                        <div class="relative flex-grow">
                                            <label for="end_date">End</label>
                                        </div>
                                        <div class="relative flex-grow">
                                            <svg
                                                class="text-gray-600 w-4 h-full mx-2 absolute pointer-events-none"
                                                fill="none"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                ></path>
                                            </svg>
                                            <input
                                                id="end_date"
                                                class="flex-grow py-1 bg-gray-100 border rounded w-full"
                                                :class="
                                                    isDragging
                                                        ? 'text-gray-600'
                                                        : 'text-gray-900'
                                                "
                                                :value="inputValue.end"
                                                v-on="inputEvents.end"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </date-picker>
                    </form>
                </div>
            </div>
        </div>
        <div class="table-responsive">
            <transition mode="out-in">
                <div v-if="isDataLoading" class="loader">
                    <div class="spinner-border text-warning" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                    <p>Loading...</p>
                </div>
                <table
                    v-else-if="renderOrders.length"
                    class="table align-items-center table-flush tablesorter"
                >
                    <thead class="thead-light">
                        <tr>
                            <th>Order</th>
                            <th>Order ID</th>
                            <th>Receiver Name</th>
                            <th>Shipping By</th>
                            <th>Date</th>
                            <th>Purchase Order</th>
                            <th>Packed</th>
                        </tr>
                    </thead>
                    <tbody class="list">
                        <tr
                            v-for="(order, index) in renderOrders"
                            :key="order.order_number"
                            class="order_detail"
                            @click="checkDetails(order.order_id)"
                        >
                            <th>{{ (page - 1) * 10 + 1 + index }}</th>
                            <th>{{ order.order_number }}</th>
                            <th>{{ order.name_cust }}</th>
                            <th>{{ order.type_send }} {{ order.tack_post }}</th>
                            <th>{{ order.date_order }}</th>
                            <th>
                                <span
                                    :class="
                                        order.packing_status === 'Complete'
                                            ? 'complete'
                                            : ''
                                    "
                                >
                                    {{ order.status }}
                                </span>
                            </th>
                            <th>
                                <span
                                    :class="
                                        order.packing_status === 'Complete'
                                            ? 'complete'
                                            : ''
                                    "
                                >
                                    {{ order.packing_status }}</span
                                >
                            </th>
                        </tr>
                    </tbody>
                </table>
                <div v-else class="placeholder"><h1>No Data</h1></div>
            </transition>
        </div>
    </div>
    <div
        class="card-footer d-flex justify-content-end"
        :class="type === 'dark' ? 'bg-transparent' : ''"
    >
        <base-pagination
            :total="totalPages"
            @input="pageNumber"
            :value="page"
        ></base-pagination>
    </div>
</template>

<script>
import ErrorAlert from "../../components/ErrorAlert.vue";
import { DatePicker } from "v-calendar";

export default {
    components: {
        ErrorAlert,
        DatePicker,
    },
    props: {
        type: {
            type: String,
        },
        title: String,
    },
    data() {
        return {
            orders: [],
            filteredOrders: [], // empty as default
            searchInput: "",
            searchedPage: 1,
            range: {
                start: new Date(),
                end: new Date(),
            },
            masks: {
                input: "YYYY-MM-DD h:mm A",
            },
            isDataLoading: false, // false as default
            page: 1,
            rows: 10,
            isError: false, // false as default
            errorMessage: "",
        };
    },
    watch: {
        searchInput(value) {
            if (value.length) {
                this.filteredOrders = this.orders.reduce((list, order) => {
                    if (
                        order.order_number
                            .toLowerCase()
                            .includes(value.toLowerCase())
                    ) {
                        list.push(order);
                    } else if (
                        order.name_cust
                            .toLowerCase()
                            .includes(value.toLowerCase())
                    ) {
                        list.push(order);
                    } else if (
                        order.type_send
                            .toLowerCase()
                            .includes(value.toLowerCase())
                    ) {
                        list.push(order);
                    } else if (
                        order.tack_post
                            .toLowerCase()
                            .includes(value.toLowerCase())
                    ) {
                        list.push(order);
                    } else if (
                        order.status.toLowerCase().includes(value.toLowerCase())
                    ) {
                        list.push(order);
                    }
                    return list;
                }, []);
            }
        },
    },
    computed: {
        sortOrdersByDate() {
            const filteredOrders = this.orders.reduce((list, order) => {
                if (
                    Date.parse(order.date_order) <=
                        Date.parse(this.range.end) &&
                    Date.parse(order.date_order) >= Date.parse(this.range.start)
                ) {
                    list.push(order);
                }
                return list;
            }, []);
            return filteredOrders;
        },
        renderOrders() {
            return this.sortOrdersByDate;
        },
        renderPage() {
            if (this.searchInput.length) return this.searchedPage;
            return this.page;
        },
        totalPages() {
            if (this.searchInput.length) return this.filteredOrders.length;
            return this.orders.length;
        },
    },
    methods: {
        pageNumber(value) {
            if (this.searchInput.length) {
                this.searchedPage = value;
            } else {
                this.page = value;
            }
        },
        checkDetails(order_id = "") {
            const order = this.orders.find(
                (item) => item.order_id === order_id
            );
            this.filteredOrders = order;
            this.$router.push({ path: `/orders/${order_id}` });
        },
        clearSearchInput() {
            this.searchInput = "";
        },
        getDateString(date) {
            return `${date.getFullYear()}-${
                date.getMonth() + 1
            }-${date.getDate()}`;
        },
        closeAlert() {
            this.isError = false;
        },
        reset() {
            this.orders = [];
            this.filteredOrders = []; // empty as default
            this.searchInput = "";
            this.searchedPage = 1;
            this.date = {
                start: "",
                end: "",
            };
            this.range = {
                start: new Date(),
                end: new Date(),
            };
            this.masks = {
                input: "YYYY-MM-DD h:mm A",
            };
            this.isDataLoading = false; // false as default
            this.page = 1;
            this.rows = 10;
            this.isError = false; // false as default
            this.errorMessage = "";
        },
    },
    beforeMount() {
        const dateToday = new Date().getDate();
        const monthToday = new Date().getMonth();
        const yearToday = new Date().getFullYear();

        const startDate = new Date(yearToday, monthToday - 1, 1);

        this.range.start = startDate;
        this.range.end = new Date(yearToday, monthToday, dateToday);
    },
    async mounted() {
        this.isDataLoading = true;

        const response = await this.$store.dispatch("carry/getOrders", {
            type: "get_order_list",
        });

        if (response.resCode === 200) {
            const { data } = response;
            let list = [];
            if (data.total_page > 1) {
                list = [...data.data];
                for (let page = 1; page < data.total_page; page++) {
                    const res = await this.$store.dispatch("carry/getOrders", {
                        type: "get_order_list",
                        page: page + 1,
                    });
                    if (res.resCode === 200) {
                        list = [...list, ...res.data.data];
                    }
                }
            } else {
                list = data.data;
            }
            list.sort(function (a, b) {
                return Date.parse(b.date_order) - Date.parse(a.date_order);
            });
            this.orders = list;
        }

        this.isDataLoading = false;
    },
};
</script>

<style scoped lang="scss">
form {
    label {
        display: inline-block;
        text-align: center;
        padding: 0 0.5rem;
        margin: 0;
    }

    @media (min-width: 990px) {
        label {
            white-space: nowrap;
        }
    }

    .clearInput {
        display: flex;
        align-items: center;
    }

    .input_wrapper {
        display: flex;
        justify-content: center;
        align-items: center;

        svg {
            width: 1rem;
            margin: 0 auto;
        }

        label {
            margin: 0;
        }

        input {
            max-width: 195px;
        }

        & > div:last-child {
            min-width: 230px;
        }
    }
}

.order_detail {
    cursor: pointer;
    transition: all 0.2s ease-in;
}

.order_detail:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

.placeholder {
    text-align: center;
}

.v-enter-active {
    animation: fadeIn 0.3s ease-in;
}
.v-leave-active {
    animation: fadeIn 0.3s ease-in reverse;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 100;
    }
}

.loader {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    div {
        width: 3rem;
        height: 3rem;
    }

    p {
        font-size: 2rem;
    }
}

.complete {
    background-color: green;
    color: #fff;
    border-radius: 5px;
}
</style>