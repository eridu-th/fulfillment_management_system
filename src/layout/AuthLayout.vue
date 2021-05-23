<template>
    <div class="container">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: "auth-layout",
    mounted() {
        const body = document.querySelector("body");
        body.style.backgroundColor = "#ccc";
    },
};
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 100vh;
    width: 100vw;
}
</style>
