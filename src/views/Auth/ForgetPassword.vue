<template>
    <div id="reset_password_form">
        <div id="eridu_logo">
            <img src="https://i.imgur.com/El5WkrH.png" alt="soibear_logo" />
        </div>
        <h1>Reset Password</h1>
        <hr />
        <div id="reset_password_input">
            <form
                v-if="!validToken"
                action=""
                id="submit_email"
                class="form-group"
                @submit.prevent="sendResetEmail"
            >
                <div class="input-group mb-3">
                    <span class="input-group-text"
                        ><i class="fas fa-envelope"></i
                    ></span>
                    <input
                        data-type="email"
                        type="email"
                        inputmode="email"
                        class="form-control"
                        aria-label="email"
                        placeholder="Email"
                        v-model.trim="email"
                        required
                    />
                    <div class="valid-feedback">This email is valid!</div>
                    <div class="invalid-feedback">
                        Something went wrong...Please check the email again!
                    </div>
                </div>
                <button class="btn btn-primary">Reset Password</button>
            </form>
            <p v-else-if="emailSent">Email has been sent to {{ email }}</p>
            <form
                v-else
                action=""
                autocomplete="off"
                id="reset_password_form"
                @submit.prevent="resetPassword"
            >
                <div class="mb-3">
                    <label for="password" class="form-label"
                        >New Password</label
                    >
                    <input
                        type="password"
                        class="form-control"
                        id="password"
                        v-model.trim="password"
                        :class="invalid"
                        required
                    />
                    <div class="invalid-feedback">
                        Your password do not match
                    </div>
                </div>
                <div class="mb-3">
                    <label for="password_repeat" class="form-label"
                        >Confirm password</label
                    >
                    <input
                        type="password"
                        class="form-control"
                        id="password_repeat"
                        v-model.trim="confirmPassword"
                        :class="invalid"
                        required
                    />
                    <div class="invalid-feedback">
                        Your password do not match
                    </div>
                </div>
                <div>
                    <button type="submit" class="btn btn-primary">
                        Reset Password
                    </button>
                </div>
            </form>
        </div>
        <hr />
        <div id="backToLogin">
            <a class="btn btn-secondary" href="/login">Back to Login</a>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            email: "",
            token: null,
            validToken: false,
            password: "",
            confirmPassword: "",
            emailSent: false,
            matchingPassword: false,
        };
    },
    watch: {
        password(value) {
            if (this.confirmPassword && value === this.confirmPassword) {
                this.matchingPassword = true;
            }
        },
        confirmPassword(value) {
            if (this.password && value === this.password) {
                this.matchingPassword = true;
            }
        },
    },
    computed: {
        invalid() {
            if (
                this.matchingPassword &&
                this.password === this.confirmPassword &&
                this.password &&
                this.confirmPassword
            ) {
                return "is-valid";
            } else if (!this.password || !this.confirmPassword) {
                return "";
            }
            return "is-invalid";
        },
    },
    methods: {
        async resetPassword() {
            const endpoints = this.$store.getters["auth/endpoints"];
            const headers = await fetch(endpoints.header, {
                method: "post",
            }).then((res) => res.json());

            const response = await fetch(endpoints.resetPassword, {
                method: "post",
                mode: "cors",
                headers: {
                    Authorization: this.token,
                    "client-token": headers["client-token"],
                    "time-stamp": headers["time-stamp"],
                    "time-signature": headers["time-signature"],
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    password: this.password,
                    confirmPassword: this.confirmPassword,
                }),
            }).then((res) => res.json());

            if (response.resCode === 200) {
                this.$router.push("/login");
            } else {
                alert("something went wrong");
            }
        },
        async sendResetEmail() {
            const endpoints = this.$store.getters["auth/endpoints"];
            const headers = await fetch(endpoints.header, {
                method: "post",
            }).then((res) => res.json());
            const response = await fetch(endpoints.resetToken, {
                method: "post",
                mode: "cors",
                headers: {
                    "client-token": headers["client-token"],
                    "time-stamp": headers["time-stamp"],
                    "time-signature": headers["time-signature"],
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: this.email }),
            }).then((res) => res.json());

            if (response.resCode === 200) {
                this.emailSent = true;
                this.validToken = true;
            }
        },
        resetData() {
            this.email = "";
            this.token = null;
            this.validToken = false;
            this.password = "";
            this.confirmPassword = "";
            this.emailSent = false;
            this.matchingPassword = false;
        },
        async validateToken() {
            const queries = this.$route.query;
            if ("jwt" in queries) {
                this.validToken = false;
                try {
                    const token = queries.jwt;
                    const endpoints = this.$store.getters["auth/endpoints"];
                    const headers = await fetch(endpoints.header, {
                        method: "post",
                    }).then((res) => res.json());

                    const response = await fetch(endpoints.verifyResetToken, {
                        method: "post",
                        mode: "cors",
                        headers: {
                            Authorization: token,
                            "client-token": headers["client-token"],
                            "time-stamp": headers["time-stamp"],
                            "time-signature": headers["time-signature"],
                            "Content-Type": "application/json",
                        },
                    }).then((res) => res.json());

                    if (response.resCode === 200) {
                        this.token = token;
                        this.validToken = true;
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        },
    },
    async mounted() {
        this.resetData();
        await this.validateToken();
    },
};
</script>

<style scoped>
#backToLogin {
    display: flex;
    justify-content: center;
    align-items: center;
}

#reset_password_form {
    border: 2px #ccc solid;
    width: 80%;
    padding: 1.2rem;
    background: #fff;
    border-radius: 1rem;
}

#reset_password_form img {
    width: 100%;
}

#submit_email {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

#reset_password_input {
    display: flex;
    justify-content: center;
    align-items: center;
}

#reset_loader {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

#reset_password_form {
    width: 100%;
}

#reset_password_form button {
    display: block;
    margin: 0 auto;
}

@media (min-width: 768px) {
    #reset_password_form {
        max-width: 500px;
    }

    #reset_password_form img {
        display: block;
        /* width: 500px; */
        margin: 0 auto;
    }
}
</style>