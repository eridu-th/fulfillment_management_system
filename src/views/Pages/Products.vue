<template>
    <base-header type="gradient-warning" class="pb-6 pb-8 pt-5 pt-md-8">
    </base-header>

    <div class="container-fluid mt--9">
        <div class="row mt-5">
            <div class="col">
                <products-table type="light" title="Products"></products-table>
            </div>
        </div>
    </div>
</template>

<script>
import ProductsTable from "../Tables/ProductsTable.vue";
export default {
    components: {
        ProductsTable,
    },
};
</script>