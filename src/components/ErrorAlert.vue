<template>
    <div @click="$emit('close')"></div>
    <dialog open>
        <h2>{{ title }}</h2>
        <p>{{ content }}</p>
        <slot></slot>
        <button type="button" class="btn btn-primary" @click="$emit('close')">
            {{ button }}
        </button>
    </dialog>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: "Something went wrong...",
        },
        content: {
            type: String,
        },
        button: {
            type: String,
            default: "Close",
        },
    },
    emits: ["close"],
};
</script>

<style scoped>
div {
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
    max-width: 600px;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    border-radius: 5px;
    border: none;
    padding: 1rem;
    z-index: 1001;
}

dialog button {
    display: block;
    margin: 0 auto;
}

dialog img {
    display: block;
    width: 500px;
    height: 500px;
    object-fit: cover;
}
</style>