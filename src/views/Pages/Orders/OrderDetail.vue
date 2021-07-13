<template>
    <div class="backdrop" @click="closeDetail"></div>
    <dialog open>
        <button type="button" @click="closeDetail">x</button>
        <div class="container">
            <div v-if="!isDataLoaded" class="loader">
                <div class="spinner-border text-warning" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                <p>Loading...</p>
            </div>
            <ul v-if="isDataLoaded" class="nav nav-tabs">
                <li
                    class="nav-item"
                    v-for="(tab, key) in tabs"
                    :key="key"
                    @click.stop="switchTab(tab)"
                >
                    <span
                        class="nav-link"
                        :class="selectedTab === tab ? 'active' : ''"
                    >
                        {{ key.toUpperCase() }}
                    </span>
                </li>
            </ul>
            <div v-if="isDataReady" class="tab-content wrapper">
                <transition mode="out-in">
                    <component :is="selectedTab" :data="orderData"></component>
                </transition>
            </div>
        </div>
    </dialog>
</template>

<script>
import OrderCosts from "./OrderCosts.vue";
import OrderDelivery from "./OrderDelivery.vue";
import OrderInfo from "./OrderInfo.vue";
import OrderProducts from "./OrderProducts.vue";
export default {
    components: {
        OrderCosts,
        OrderDelivery,
        OrderInfo,
        OrderProducts,
    },
    props: ["orderId"],
    data() {
        return {
            isDataLoaded: false,
            orderData: [],
            tabs: {
                info: "order-info",
                products: "order-products",
                delivery: "order-delivery",
                costs: "order-costs",
            },
            selectedTab: "order-info",
        };
    },
    computed: {
        isDataReady() {
            if (this.orderData.length) return true;
            return false;
        },
    },
    methods: {
        closeDetail() {
            this.$router.push({
                path: "/orders",
            });
        },
        switchTab(tab = "") {
            this.selectedTab = tab;
        },
        reset() {
            this.isDataLoaded = false;
            this.orderData = [];
            this.tabs = {
                info: "order-info",
                products: "order-products",
                delivery: "order-delivery",
                costs: "order-costs",
            };
            this.selectedTab = "order-costs";
        },
    },
    async mounted() {
        this.isDataLoaded = false;
        const response = await this.$store.dispatch("carry/getOrders", {
            type: "get_order_detail",
            id: this.orderId,
        });
        if (response.resCode === 200) {
            for (let item in response.data) {
                this.orderData.push(response.data[item]);
            }
        }

        console.log(this.orderData);

        this.isDataLoaded = true;
    },
    unmounted() {
        this.reset();
    },
};
</script>

<style scoped lang="scss">
.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
}

dialog {
    margin: 0;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 1200px;
    height: 80vh;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    border-radius: 5px;
    border: none;
    padding: 1rem;
    z-index: 1001;

    animation: fadeIn 0.2s ease-in;

    button {
        display: block;
        position: absolute;
        top: 20px;
        right: 20px;
        border: none;
        background-color: inherit;
    }
}

.v-enter-active {
    animation: fadeIn 0.2s ease;
}

.v-leave-active {
    animation: fadeIn 0.2s ease reverse;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
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

ul.nav-tabs {
    li {
        cursor: pointer;
    }
}

.wrapper {
    max-height: calc(80vh - 100px);
    overflow: auto;
}
</style>