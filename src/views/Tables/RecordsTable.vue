<template>
    <teleport to="body">
        <error-alert v-if="isError" @close="closeAlert" :content="errorMessage">
        </error-alert>
    </teleport>
    <div class="card shadow" :class="type === 'dark' ? 'bg-default' : ''">
        <div
            class="card-header border-0"
            :class="type === 'dark' ? 'bg-transparent' : ''"
        >
            <div class="row align-items-center">
                <div class="col-sm col-lg-3 col-xl-6">
                    <h3
                        class="mb-0"
                        :class="type === 'dark' ? 'text-white' : ''"
                    >
                        {{ title }}
                    </h3>
                </div>
                <div class="col-sm col-lg-9 col-xl-6 text-right">
                    <form
                        class="d-flex flex-column flex-sm-row justify-content-sm-center justify-content-lg-end align-items-center"
                        @submit.prevent
                    >
                        <date-picker
                            v-model="range"
                            mode="date"
                            :masks="masks"
                            is-range
                            color="orange"
                        >
                            <template
                                v-slot="{ inputValue, inputEvents, isDragging }"
                            >
                                <div
                                    class="d-flex flex-column flex-md-row justify-content-lg-end align-items-center"
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
                    v-else-if="renderRecords.length"
                    class="table align-items-center table-flush tablesorter"
                >
                    <thead class="thead-light">
                        <tr>
                            <th>Shop</th>
                            <th>SKU</th>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Note</th>
                        </tr>
                    </thead>

                    <tbody class="list">
                        <tr
                            v-for="record in renderRecords"
                            :key="
                                record.product_stock_in_id
                                    ? record.product_stock_in_id
                                    : record.product_stock_out_id
                            "
                            :class="
                                record.transit === 'in'
                                    ? 'stock_in'
                                    : 'stock_out'
                            "
                        >
                            <td>{{ record.shop_number }}</td>
                            <td>{{ record.barcode_number }}</td>
                            <td>{{ record.product_name }}</td>
                            <td>
                                {{ record.transit === "in" ? "+" : "-" }}
                                {{ record.num_products }}
                            </td>
                            <td>
                                {{
                                    record.transit === "in"
                                        ? record.date_in
                                        : record.date_out
                                }}
                            </td>
                            <td>
                                {{ record.note ? record.note : "" }}
                            </td>
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
            :value="renderPage"
        ></base-pagination>
    </div>
</template>

<script>
import ErrorAlert from "../../components/ErrorAlert.vue";
import { DatePicker } from "v-calendar";

export default {
    name: "records-table",
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
            isDataLoading: true, // default be false
            startDate: ``,
            endDate: ``,
            filteredPage: 1,
            page: 1,
            records: {
                stockIn: [],
                stockOut: [],
            },
            filteredRecords: [],
            rows: 10,
            range: {
                start: new Date(),
                end: new Date(),
            },
            masks: {
                // input: "YYYY-MM-DD h:mm A",
                input: "YYYY-MM-DD",
            },
            isError: false,
            errorMessage: "",
        };
    },
    watch: {
        range() {
            this.startDate = this.getDateString(this.range.start);
            this.endDate = this.getDateString(this.range.end);
            this.fetchRecords();
        },
    },
    computed: {
        renderRecords() {
            const trimStart = (this.page - 1) * this.rows;
            const trimEnd = trimStart + this.rows;

            const trimmedData = this.filteredRecords.slice(trimStart, trimEnd);
            return trimmedData;
        },
        renderPage() {
            return this.page;
        },
        totalPages() {
            return this.records.stockIn.length + this.records.stockOut.length;
        },
    },
    methods: {
        pageNumber(value) {
            this.page = value;
        },
        closeAlert() {
            this.isError = false;
        },
        getDateString(date) {
            return `${date.getFullYear()}-${
                date.getMonth() + 1
            }-${date.getDate()}`;
        },
        sortRecords() {
            this.filteredRecords = [
                ...this.records.stockIn,
                ...this.records.stockOut,
            ].sort(function (a, b) {
                return (
                    Date.parse(b.date_in ? b.date_in : b.date_out) -
                    Date.parse(a.date_in ? a.date_in : a.date_out)
                );
            });
        },
        async fetchRecords() {
            this.isDataLoading = true;
            const stockIn = await this.$store.dispatch("carry/getProducts", {
                type: "product_stock",
                status: "in",
                start: this.startDate,
                end: this.endDate,
            });

            if (stockIn.resCode === 200) {
                const stockInFiltered = stockIn.data.reduce((list, item) => {
                    item.transit = "in";
                    list.push(item);
                    return list;
                }, []);

                this.records.stockIn = stockInFiltered;
            } else {
                this.records.stockIn = [];
            }

            const stockOut = await this.$store.dispatch("carry/getProducts", {
                type: "product_stock",
                status: "out",
                start: this.startDate,
                end: this.endDate,
            });

            if (stockOut.resCode === 200) {
                const stockOutFiltered = stockOut.data.reduce((list, item) => {
                    item.transit = "out";
                    list.push(item);
                    return list;
                }, []);

                this.records.stockOut = stockOutFiltered;
            } else {
                this.records.stockOut = [];
            }

            this.isDataLoading = false;

            this.sortRecords();
        },
        reset() {
            this.isDataLoading = true;
            this.startDate = ``;
            this.endDate = ``;
            this.filteredPage = 1;
            this.page = 1;
            this.records = {
                stockIn: [],
                stockOut: [],
            };
            this.filteredRecords = [];
            this.rows = 10;
            this.range = {
                start: new Date(),
                end: new Date(),
            };
            this.masks = {
                input: "YYYY-MM-DD h:mm A",
            };
            this.isError = false;
            this.errorMessage = "";
        },
    },
    beforeMount() {
        const dateToday = new Date().getDate();
        const monthToday = new Date().getMonth() + 1;
        const yearToday = new Date().getFullYear();

        const startDate = new Date(yearToday, monthToday - 1, 1);

        this.range.start = startDate;
        this.range.end = new Date(yearToday, monthToday - 1, dateToday);

        this.startDate = this.getDateString(this.range.start);
        this.endDate = this.getDateString(this.range.end);
    },
    async mounted() {
        this.fetchRecords();
    },
    unmounted() {
        this.reset();
    },
};
</script>

<style scoped lang="scss">
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

form {
    label {
        display: inline-block;
        text-align: center;
        padding: 0 0.5rem;
    }

    @media (min-width: 990px) {
        label {
            white-space: nowrap;
        }
    }
    svg {
        width: 1rem;
    }
    input {
        padding: 0;
        max-width: 100px;
    }

    .input_wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 200px;

        label {
            margin: 0;
        }
    }
}

.stock_in {
    background-color: palegreen;
}

.stock_out {
    background-color: pink;
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
</style>