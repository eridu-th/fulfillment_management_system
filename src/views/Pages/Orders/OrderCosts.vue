<template>
    <div class="container">
        <h1>Cost Structure</h1>
        <ul class="list">
            <li>
                <h3>Invoice Code:</h3>
                <div>{{ product.invoice_number }}</div>
            </li>
            <li>
                <h3>Order ID:</h3>
                <div>{{ product.order_number }}</div>
            </li>
            <li>
                <h3>Shipping:</h3>
                <div>
                    {{ product.type_send }} {{ product.delivery_size }}
                    {{
                        product.delivery_cost_primary
                            ? product.delivery_cost_primary
                            : 0
                    }}
                    Baht
                </div>
            </li>
            <li>
                <h3>Costs:</h3>
            </li>
            <li>
                <h3>Box Value:</h3>
                <div>{{ product.material_cost }} Baht</div>
            </li>
            <!-- <li>
                <h3>Include:</h3>
                <div>{{ product }} Baht</div>
            </li> -->
        </ul>
    </div>
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
        product() {
            return this.data[0];
        },
    },
};
</script>

<style scoped lang="scss">
.list {
    padding: 0;

    li {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, max-content));
    }
}
</style>