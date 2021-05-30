export default {
    isLoaded(state) {
        state.isLoaded = true;
    },
    reset(state) {
        state.isLoaded = false;
    },
}