<template>
    <div id="app">
        <!-- <transition>
            <div v-if="!isDataLoaded" class="loader">
                <div class="spinner-border text-warning" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                <p>Loading...</p>
            </div>
        </transition> -->
        <!-- <router-view v-if="isDataLoaded" /> -->
        <router-view />
    </div>
</template>

<script>
export default {
    // computed: {
    //     isDataLoaded() {
    //         return this.$store.getters["isLoaded"];
    //     },
    // },
};
</script>

<style scoped lang="scss">
.loader {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    div {
        width: 5rem;
        height: 5rem;
    }

    p {
        font-size: 2rem;
        font-weight: bold;
    }
}
</style>