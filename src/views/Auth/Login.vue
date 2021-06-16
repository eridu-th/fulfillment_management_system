<template>
    <div id="login_form">
        <div id="eridu_logo">
            <img src="https://i.imgur.com/El5WkrH.png" alt="soibear_logo" />
        </div>
        <form action="" autocomplete="off" @submit.prevent="login">
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                    type="text"
                    class="form-control"
                    id="email"
                    aria-describedby="emailHelp"
                    autocomplete="off"
                    v-model="email"
                    :class="invalid"
                    @input="clearInvalid"
                />
                <div class="invalid-feedback">Your email is not correct</div>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="password"
                    :class="invalid"
                    @input="clearInvalid"
                />
                <div class="invalid-feedback">Your password is not correct</div>
            </div>
            <div class="mb-3 form-check">
                <input
                    type="checkbox"
                    class="form-check-input"
                    id="remember_me"
                    checked
                    v-model="rememberMe"
                />
                <label class="form-check-label" for="remember_me"
                    >Remember me</label
                >
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
            <div>
                <div>
                    <router-link to="register">Sign Up</router-link>
                </div>
                <div>
                    <router-link to="/forgetpassword"
                        >Forget Password</router-link
                    >
                </div>
            </div>
        </form>
    </div>
</template>
<script scoped>
export default {
    name: "login",
    data() {
        return {
            email: "",
            password: "",
            rememberMe: true,
            validity: null,
            auth: false,
        };
    },
    watch: {
        auth(value) {
            if (value) {
                this.$router.push("/orders");
            }
        },
    },
    computed: {
        invalid() {
            return this.validity ? "is-invalid" : "";
        },
    },
    methods: {
        clearInvalid() {
            this.validity = false;
        },
        async login() {
            this.validity = false;
            await this.$store.dispatch({
                type: "auth/login",
                email: this.email,
                password: this.password,
                remember: this.rememberMe,
            });

            if (this.$store.getters["auth/error"]) {
                this.validity = true;
                return;
            }

            if (
                this.$store.getters["auth/auth"] &&
                this.$store.getters["auth/token"]
            ) {
                this.auth = true;
            }
        },
    },
};
</script>
<style scoped>
#login_form {
    border: 2px #ccc solid;
    width: 80%;
    padding: 1.2rem;
    background: #fff;
    border-radius: 1rem;
}

#login_form img {
    width: 100%;
}

#login_form button {
    display: block;
    margin: 0 auto;
}

#login_form form > div:last-child {
    margin: 1rem auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

@media (min-width: 768px) {
    #login_form {
        max-width: 500px;
    }

    #login_form img {
        display: block;
        /* width: 500px; */
        margin: 0 auto;
    }
}
</style>
