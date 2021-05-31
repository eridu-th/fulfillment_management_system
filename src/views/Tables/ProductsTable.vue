<template>
    <teleport to="body">
        <error-alert
            v-if="isError"
            @close.stop="closeAlert"
            :content="errorMessage"
        >
        </error-alert>
    </teleport>
    <teleport to="body">
        <transition name="backdrop">
            <div
                v-if="selectedProduct"
                class="details"
                @click="closeAlert"
            ></div>
        </transition>
        <transition name="product">
            <dialog v-if="selectedProduct" open @click.stop>
                <ul class="nav nav-tabs">
                    <li class="nav-item">
                        <a
                            class="nav-link"
                            :class="selectedTab === 'details' ? 'active' : ''"
                            href="#details"
                            @click="switchTab('details')"
                            >Details</a
                        >
                    </li>
                    <li class="nav-item">
                        <a
                            class="nav-link"
                            :class="selectedTab === 'records' ? 'active' : ''"
                            @click="switchTab('records')"
                            href="#records"
                            >Records</a
                        >
                    </li>
                </ul>
                <button type="button" @click.stop="closeAlert">x</button>
                <div class="tab-content" id="product_contents">
                    <div
                        v-if="selectedTab === 'details'"
                        class="row"
                        id="product_details"
                    >
                        <div class="col-12 col-lg-4">
                            <div class="row product_media">
                                <div class="col-sm-6 col-lg-12 product_image">
                                    <img
                                        :src="selectedProduct.img"
                                        alt="product_image"
                                    />
                                </div>
                                <div class="col-sm-6 col-lg-12 product_qr">
                                    <img
                                        :src="`https://quickchart.io/qr?size=500&text=${selectedProduct.sku}`"
                                        alt="qr_code"
                                    />
                                    <div>{{ selectedProduct.sku }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-lg-8 card product_fields">
                            <div class="card-body">
                                <p>
                                    Product Name:
                                    <span>{{ selectedProduct.name }}</span>
                                </p>
                                <p>
                                    Brand:
                                    <span>{{ selectedProduct.brand }}</span>
                                </p>
                                <p>
                                    Current Amount:
                                    <span>{{ selectedProduct.amount }}</span>
                                </p>
                                <p>
                                    Shop:
                                    <span>{{ selectedProduct.shop }}</span>
                                </p>
                                <p>
                                    Date:
                                    <span>{{ selectedProduct.date }}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div v-else id="product_records">
                        <table
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
                                    v-for="record in recordsToRender"
                                    :key="record.barcode_number"
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
                                        {{
                                            record.transit === "in" ? "+" : "-"
                                        }}
                                        {{ record.num_products }}
                                    </td>
                                    <td>
                                        {{
                                            record.transit === "in"
                                                ? record.date_in.slice(0, 11)
                                                : record.date_out.slice(0, 11)
                                        }}
                                    </td>
                                    <td>
                                        {{ record.note ? record.note : "" }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </dialog>
        </transition>
    </teleport>
    <div class="card shadow" :class="type === 'dark' ? 'bg-default' : ''">
        <div
            class="card-header border-0"
            :class="type === 'dark' ? 'bg-transparent' : ''"
        >
            <div class="row align-items-center">
                <div class="col-sm col-lg-4 col-xl-6">
                    <h3
                        class="mb-0"
                        :class="type === 'dark' ? 'text-white' : ''"
                    >
                        {{ title }}
                    </h3>
                </div>
                <div class="col-sm col-lg-8 col-xl-6 text-right">
                    <form
                        class="d-flex flex-column flex-sm-row justify-content-sm-center justify-content-lg-end align-items-center"
                        @submit.prevent="clearSearchInput"
                    >
                        <label for="search_product">Search Product</label>
                        <input
                            type="text"
                            id="search_product"
                            class="mx-2"
                            v-model.trim="searchInput"
                            @input="searchProduct"
                        />
                        <button
                            class="btn btn-primary btn-sm my-2"
                            type="submit"
                        >
                            Clear
                        </button>
                    </form>
                </div>
                <!-- <div class="col text-right">
                    <base-button type="primary" size="sm">See all</base-button>
                </div> -->
            </div>
        </div>

        <div class="table-responsive">
            <div v-if="!isDataLoaded" class="loader">
                <div class="spinner-border text-warning" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                <p>Loading...</p>
            </div>
            <table
                v-else
                class="table align-items-center table-flush tablesorter"
            >
                <thead class="thead-light">
                    <tr>
                        <th v-for="column in columns" :key="column">
                            {{ column }}
                        </th>
                    </tr>
                </thead>
                <tbody class="list">
                    <tr
                        v-for="product in renderProducts"
                        :key="product.sku"
                        class="product_detail"
                        @click="checkDetails(product.sku)"
                    >
                        <td>
                            <div class="media align-items-center">
                                <a :href="'#'"
                                    ><img
                                        :src="product.img"
                                        alt="product_photo"
                                /></a>
                            </div>
                        </td>
                        <td>
                            {{ product.sku }}
                        </td>
                        <td>
                            {{ `${product.name} ${product.brand}` }}
                        </td>
                        <td>
                            {{ product.shop }}
                        </td>
                        <td>
                            {{ product.amount }}
                        </td>
                        <td>
                            {{ product.date }}
                        </td>
                        <td>
                            <span :class="productState(product.status)">{{
                                product.status
                            }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
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
    </div>
</template>
<script>
import ErrorAlert from "../../components/ErrorAlert.vue";

export default {
    components: {
        ErrorAlert,
    },
    name: "products-table",
    props: {
        type: {
            type: String,
        },
        title: String,
    },
    data() {
        return {
            isDataLoaded: false,
            searchInput: "",
            searchedProducts: [],
            searchedPage: 1,
            selectedTab: this.$route.hash,
            selectedProduct: "", // S1962020501
            selectedProductRecords: {
                stockIn: [],
                stockOut: [],
            },
            records: {
                stockIn: [],
                stockOut: [],
            },
            activeTab: {
                details: "",
                records: "",
            },
            products: [],
            page: 1,
            rows: 10,
            columns: [
                "Image",
                "Product SKU",
                "Product Name/Brand",
                "Shop",
                "Amount",
                "Date",
                "Status",
            ],
            isError: false,
            errorMessage: "",
        };
    },
    watch: {
        searchInput(value) {
            if (value.length) {
                this.searchedProducts = this.products.reduce(
                    (list, product) => {
                        if (
                            product.sku
                                .toLowerCase()
                                .includes(value.toLowerCase())
                        ) {
                            list.push(product);
                        } else if (
                            product.name
                                .toLowerCase()
                                .includes(value.toLowerCase())
                        ) {
                            list.push(product);
                        } else if (
                            product.brand
                                .toLowerCase()
                                .includes(value.toLowerCase())
                        ) {
                            list.push(product);
                        } else if (
                            product.shop
                                .toLowerCase()
                                .includes(value.toLowerCase())
                        ) {
                            list.push(product);
                        } else if (
                            product.status
                                .toLowerCase()
                                .includes(value.toLowerCase())
                        ) {
                            list.push(product);
                        }
                        return list;
                    },
                    []
                );
            }
        },
        selectedProductRecords: {
            handler(value) {
                if (this.selectedProduct) {
                    const records = [...value.stockIn, ...value.stockOut];
                    records.sort((a, b) => {
                        return (
                            Date.parse(b.date_in ? b.date_in : b.date_out) -
                            Date.parse(a.date_in ? a.date_in : a.date_out)
                        );
                    });
                    this.recordsToRender = records;
                }
            },
            deep: true,
        },
    },
    computed: {
        renderProducts() {
            if (this.searchInput.length) {
                // return this.searchedProducts;
                const trimStart = (this.searchedPage - 1) * this.rows;
                const trimEnd = trimStart + this.rows;

                const trimmedData = this.searchedProducts.slice(
                    trimStart,
                    trimEnd
                );
                return trimmedData;
            } else {
                const trimStart = (this.page - 1) * this.rows;
                const trimEnd = trimStart + this.rows;

                const trimmedData = this.products.slice(trimStart, trimEnd);
                return trimmedData;
            }
        },
        renderPage() {
            if (this.searchInput.length) return this.searchedPage;
            return this.page;
        },
        totalPages() {
            if (this.searchInput.length) return this.searchedProducts.length;
            return this.products.length;
        },
    },
    methods: {
        closeAlert() {
            this.isError = false;

            // inner router to check product info
            this.$router.push({ hash: "" });
            this.selectedTab = "";
            this.selectedProduct = null;
            this.selectedProductRecords = { stockIn: null, stockOut: null };
        },
        productState(status = "Active") {
            let statusClass = "status_active";
            switch (status) {
                case "Active":
                    break;
                case "Inactive":
                    statusClass = "status_inactive";
                    break;
                default:
                    break;
            }
            return statusClass;
        },
        checkDetails(sku = "") {
            const product = this.products.find((item) => item.sku === sku);
            this.selectedProduct = product;
            this.$router.push({ hash: "#details" });
            this.selectedTab = "details";

            if (this.records.stockIn.length) {
                const stockInRec = this.records.stockIn.filter((item) => {
                    return item["barcode_number"] === sku;
                });
                this.selectedProductRecords.stockIn = stockInRec;
            } else {
                this.selectedProductRecords.stockIn = [];
            }

            if (this.records.stockOut.length) {
                const stockOutRec = this.records.stockOut.filter((item) => {
                    return item["barcode_number"] === sku;
                });

                this.selectedProductRecords.stockOut = stockOutRec;
            } else {
                this.selectedProductRecords.stockOut = [];
            }
        },
        resetState() {
            this.isDataLoaded = false;
            this.searchInput = "";
            this.searchedProducts = [];
            this.selectedTab = "";
            this.records.stockIn = [];
            this.records.stockOut = [];
            this.activeTab = {
                details: "",
                records: "",
            };
            this.selectedProduct = "";
            this.selectedProductRecords.stockIn = [];
            this.selectedProductRecords.stockOut = [];
            this.products = [];
            this.columns = [
                "Image",
                "Product SKU",
                "Product Name/Brand",
                "Shop",
                "Amount",
                "Date",
                "Status",
            ];
            this.isError = false;
            this.errorMessage = "";
        },
        switchTab(tab = "") {
            this.selectedTab = tab;
        },
        pageNumber(value) {
            if (this.searchInput.length) {
                this.searchedPage = value;
            } else {
                this.page = value;
            }
        },
        clearSearchInput() {
            this.searchInput = "";
        },
    },
    async mounted() {
        this.resetState();
        const response = await this.$store.dispatch("carry/getProducts", {
            type: "product",
        });
        if (response.resCode === 200) {
            const { data } = response;
            const products = data.map((product) => {
                const imgUrl = product[9]
                    ? `https://www.carry.co.th/stocks/images_gen/${product[9]}`
                    : `https://jncdqugytx-flywheel.netdna-ssl.com/wp-content/uploads/2019/04/product-placeholder.gif`;
                return {
                    img: imgUrl,
                    sku: product.barcode_number,
                    name: product.product_name,
                    brand: product.product_bran,
                    shop: product.shop_name_t,
                    amount: product.num_products || 0,
                    date:
                        product.date ||
                        `${new Date().getFullYear()}-${
                            new Date().getMonth() + 1
                        }-${new Date().getDate()}`,
                    status: product.is_enable ? "Active" : "Inactive",
                };
            });

            this.products = products;
            this.isDataLoaded = true;

            const tmr = new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate() + 1
            );

            const stockIn = await this.$store.dispatch("carry/getProducts", {
                type: "product_stock",
                status: "in",
                start: "2021-05-01",
                end: `${tmr.getFullYear()}-${
                    tmr.getMonth() + 1
                }-${tmr.getDate()}`,
            });

            if (stockIn.resCode === 200) {
                const stockInFiltered = stockIn.data.reduce((list, item) => {
                    for (let product of products) {
                        if (product.sku === item["barcode_number"]) {
                            item.transit = "in";
                            list.push(item);
                        }
                    }
                    return list;
                }, []);

                this.records.stockIn = stockInFiltered.length
                    ? stockInFiltered
                    : [];
            }

            const stockOut = await this.$store.dispatch("carry/getProducts", {
                type: "product_stock",
                status: "out",
                start: "2021-05-01",
                end: `${tmr.getFullYear()}-${
                    tmr.getMonth() + 1
                }-${tmr.getDate()}`,
            });

            if (stockOut.resCode === 200) {
                const stockOutFiltered = stockOut.data.reduce((list, item) => {
                    for (let product of products) {
                        if (product.sku === item["barcode_number"]) {
                            item.transit = "out";
                            list.push(item);
                        }
                    }
                    return list;
                }, []);

                this.records.stockOut = stockOutFiltered.length
                    ? stockOutFiltered
                    : [];
            }
        } else {
            this.errorMessage =
                response.message || `Error Code: ${response.resCode}`;
            this.isError = true;
        }
    },
};
</script>
<style scoped lang="scss">
tbody img {
    display: block;
    width: 50px;
    height: 50px;
    object-fit: cover;
}

.product_detail {
    cursor: pointer;
    transition: all 0.2s ease-in;
}

.product_detail:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

.status_active {
    background-color: #b4f8c8;
    padding: 0.5rem;
    border-radius: 5px;
}

.status_inactive {
    background-color: #ffaebc;
    padding: 0.5rem;
    border-radius: 5px;
}

.details {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
}

.details ~ dialog {
    margin: 0;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 1200px;
    max-height: 80vh;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    border-radius: 5px;
    border: none;
    padding: 1rem;
    z-index: 1001;
}

.fadeIn {
    animation: fadeIn 0.5s ease-in;
    animation-fill-mode: both;
}

.product-enter-active {
    animation: fadeIn 0.3s ease-in;
}

.product-leave-active {
    animation: fadeIn 0.3s ease-in reverse;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.backdrop-enter-active,
.backdrop-leave-active {
    animation: backdrop 0.3s;
}

@keyframes backdrop {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 1;
    }
}

.details ~ dialog > button {
    display: block;
    position: absolute;
    top: 20px;
    right: 20px;
    border: none;
    background-color: inherit;
}

#product_contents {
    height: 70vh;
    overflow: auto;
    padding: 1rem 0.5rem;
}

#product_details > div {
    max-height: 400px;
}

#product_details .product_fields {
    max-height: 80%;
}

#product_details > div > div {
    height: 100%;
}

#product_details .product_media > div {
    height: 45%;
}

@media (min-width: 576px) and (max-width: 992px) {
    #product_details .product_media > div {
        height: 100%;
        max-height: 200px;
    }

    #product_details > div:nth-child(2) {
        margin-top: 1.5rem;
    }
}

.product_image img,
.product_qr img {
    display: block;
    max-width: 100%;
    object-fit: auto;
    margin: 0 auto;
}

.product_image img {
    max-height: 100%;
}

.product_qr img {
    max-height: 90%;
}

.product_qr {
    text-align: center;
    font-size: 1.4rem;
    font-weight: bold;
    color: #444;
}

.stock_in {
    background-color: palegreen;
}

.stock_out {
    background-color: pink;
}

.loader {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    div {
        height: 3rem;
        width: 3rem;
    }

    p {
        font-size: 2rem;
    }
}

.row {
    margin: 0;
}
</style>
