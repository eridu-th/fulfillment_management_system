<template>
    <base-header type="gradient-warning" class="pb-6 pb-8 pt-5 pt-md-8">
    </base-header>

    <div class="container-fluid mt--9">
        <div class="row mt-5">
            <div class="col">
                <records-table
                    type="light"
                    title="Stock Records"
                ></records-table>
            </div>
        </div>
    </div>
</template>

<script>
import RecordsTable from "../Tables/RecordsTable.vue";
export default {
    components: {
        RecordsTable,
    },
};
</script>