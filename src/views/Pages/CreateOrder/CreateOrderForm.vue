<template>
    <div class="card">
        <div
            class="card-header"
            id="headingOne"
            :style="`background-color: ${headerBgColor}`"
        >
            <div class="row">
                <h2 class="col-9" :style="`color: ${headerTextColor}`">
                    <slot name="header"></slot>
                </h2>
                <h5 class="mb-0 col-3 text-right">
                    <button
                        class="btn"
                        data-toggle="collapse"
                        data-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                        @click="toggleForm"
                        :style="`color: ${headerTextColor}`"
                    >
                        {{ showForm ? "—" : "+" }}
                    </button>
                </h5>
            </div>
        </div>
        <transition name="form">
            <div
                id="collapseOne"
                class="collapse show"
                v-if="showForm"
                aria-labelledby="headingOne"
                data-parent="#accordion"
            >
                <div class="card-body">
                    <slot name="form"></slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props: ["headerBgColor", "headerTextColor"],
    data() {
        return {
            showForm: true,
        };
    },
    methods: {
        toggleForm() {
            this.showForm = !this.showForm;
        },
    },
};
</script>

<style scoped lang="scss">
.form-enter-from,
.form-leave-to {
    transform: translateY(-20%);
    opacity: 0;
}
.form-enter-to,
.form-leave-from {
    transform: translateY(0);
    opacity: 1;
}

.form-enter-active {
    transition: all 0.5s ease;
}
.form-leave-active {
    transition: all 0.5s ease;
}

#collapseOne > div {
    overflow: auto;
}

@media (max-width: 768px) {
    #collapseOne > div {
        max-width: 90vw;
    }
}
</style>