<template>
    <base-header type="gradient-warning" class="pb-6 pb-8 pt-5 pt-md-8">
    </base-header>
    <div class="container-fluid mt--9">
        <div class="row mt-5">
            <div class="col">
                <orders-table type="light" title="Orders"></orders-table>
            </div>
        </div>
    </div>
</template>

<script>
import OrdersTable from "../Tables/OrdersTable.vue";
export default {
    components: {
        OrdersTable,
    },
};
</script>