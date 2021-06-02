<template>
    <table class="table align-items-center table-flush tablesorter">
        <thead class="thead-light">
            <tr>
                <th>no.</th>
                <th>product sku</th>
                <th>product name</th>
                <th>amount</th>
                <th>confirmed amount</th>
                <th>status</th>
            </tr>
        </thead>
        <tbody class="list">
            <tr
                v-for="(product, index) in products"
                :key="product.barcode_number"
                class="order_detail"
            >
                <th>{{ index + 1 }}</th>
                <th>{{ product.barcode_number }}</th>
                <th>{{ product.product_name }}</th>
                <th class="text-center">{{ product.num_pro }}</th>
                <th class="text-center">{{ product.confirm_num_pro }}</th>
                <th>
                    <span
                        :class="
                            product.status.toLowerCase() === 'complete'
                                ? 'complete'
                                : ''
                        "
                        >{{ product.status }}</span
                    >
                </th>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    computed: {
        products() {
            const products = this.data.reduce((list, product) => {
                if (product.product_list.length) {
                    product.product_list.forEach((item) => {
                        item.status = product.packing_status;
                    });
                    list = [...list, ...product.product_list];
                }
                return list;
            }, []);
            return products;
        },
    },
};
</script>

<style scoped>
.order_detail {
    /* cursor: pointer; */
    transition: all 0.2s ease-in;
}

.order_detail:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

.complete {
    background-color: green;
    color: #fff;
    border-radius: 5px;
    padding: 0.3rem;
}
</style>