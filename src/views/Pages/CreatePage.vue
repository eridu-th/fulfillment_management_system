<template>
    <base-header type="gradient-warning" class="pb-6 pb-8 pt-5 pt-md-8">
    </base-header>
    <div class="container-fluid mt--9">
        <div class="row mt-5">
            <div class="col">
                <div id="link_list">
                    <div class="card">
                        <router-link
                            class="btn btn-outline-secondary"
                            :to="{ name: 'create_order' }"
                            >Create Single Order</router-link
                        >
                    </div>
                    <div class="card">
                        <router-link
                            class="btn disabled"
                            :to="{ name: 'create_order' }"
                            >Create Multiple Orders</router-link
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectRoute: false,
        };
    },
    methods: {
        hideBtns() {
            this.selectRoute = true;
        },
    },
};
</script>

<style scoped lang="scss">
#link_list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min-content, 250px));
    justify-content: space-around;
    div.card {
        text-align: center;
    }
}
</style>