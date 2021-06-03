<template>
    <div class="container" ref="box">
        <h1>
            Parcel ID: {{ order.tack_post }}
            <button type="button" @click="copyParcelId">
                <i class="far fa-copy"></i>
            </button>
        </h1>
        <iframe
            src="https://th.kerryexpress.com/th/track/"
            :width="boxWidth"
            :height="boxHeight"
            frameborder="0"
        ></iframe>
    </div>
</template>

<script>
export default {
    props: ["data"],
    data() {
        return {
            box: {
                width: 0,
            },
        };
    },
    computed: {
        boxWidth() {
            if (this.$refs.box) return this.$refs.box.offsetWidth;
            return this.box.width;
        },
        boxHeight() {
            // this.box.height = window.innerHeight * 0.4;
            // return this.box.height;
            return window.innerHeight * 0.5;
        },
        order() {
            return this.data[0];
        },
    },
    methods: {
        async copyParcelId() {
            await navigator.clipboard.writeText(this.order.tack_post);
        },
    },
    mounted() {
        const container = this.$refs.box;
        this.box.width = container.offsetWidth;
    },
};
</script>

<style scoped lang="scss">
$icon-color: #666;

.container {
    h1 {
        button {
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
            i {
                color: $icon-color;
            }
            border: none;
            background-color: inherit;
        }
        button:active {
            i {
                color: invert($icon-color);
            }

            &::before,
            &::after {
                transform: translateY(-50%);
                opacity: 1;
            }
        }
        button::before {
            position: absolute;
            content: "";
            top: 50%;
            left: 40px;
            width: 1.2rem;
            height: 1.2rem;
            background-color: $icon-color;
            clip-path: polygon(60% 25%, 0 50%, 60% 75%);
            transform: translateY(-50%);
            opacity: 0;
            transition: all 0.2s ease;
        }
        button::after {
            position: absolute;
            content: "Copied!";
            top: 50%;
            left: calc(1.2rem + 40px);
            height: 1.6rem;
            transform: translateY(-50%);
            opacity: 0;
            font-size: 1rem;
            transition: all 0.2s ease;
        }
    }
}
</style>