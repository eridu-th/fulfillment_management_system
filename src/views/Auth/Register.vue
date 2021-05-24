<template>
    <div id="signup_form">
        <div>
            <a href="#"
                ><img src="https://i.imgur.com/El5WkrH.png" alt="soibear_logo"
            /></a>
        </div>
        <h1>Register</h1>
        <div id="form_wrapper">
            <form @submit.prevent="register" action="" id="soibear_signup_form" class="form-group">
                <div class="input-group mt-3 mb-3">
                    <span class="input-group-text"
                        ><i class="fas fa-user"></i
                    ></span>
                    <input
                        data-type="name"
                        type="text"
                        class="form-control"
                        aria-label="name"
                        placeholder="Your Name"
                        v-model.trim="name"
                        required
                    />
                </div>
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
                        :class="invalidEmail"
                        required
                    />
                    <div class="invalid-feedback">
                        This Email is invalid! Please choose another email
                    </div>
                    <div class="valid-feedback">This email is available!</div>
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text"
                        ><i class="fas fa-phone-alt"></i
                    ></span>
                    <input
                        data-type="phone"
                        type="number"
                        inputmode="numeric"
                        class="form-control"
                        aria-label="phone number"
                        placeholder="Phone Number"
                        v-model.trim="phone"
                        :class="invalidPhone"
                        required
                    />
                    <div class="invalid-feedback">
                        This phone number is invalid! Please choose another one
                    </div>
                    <div class="valid-feedback">
                        This phone number is available!
                    </div>
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text"
                        ><i class="fas fa-lock"></i
                    ></span>
                    <input
                        data-type="password"
                        :type="showPassword ? 'text' : 'password'"
                        class="form-control"
                        aria-label="new password"
                        placeholder="New Password"
                        v-model.trim="password"
                        :class="invalid"
                        required
                    />
                    <span @click="togglePassword('showPassword')" class="input-group-text"
                        ><i class="fas" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i
                    ></span>
                    <div class="invalid-feedback">
                        Your passwords do not match!
                    </div>
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text"
                        ><i class="fas fa-lock"></i
                    ></span>
                    <input
                        data-type="confirm_password"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        class="form-control"
                        aria-label="confirm password"
                        placeholder="Confirm Password"
                        v-model.trim="confirmPassword"
                        :class="invalid"
                        required
                    />
                    <span @click="togglePassword('showConfirmPassword')" class="input-group-text"
                        ><i class="fas" :class="showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'"></i
                    ></span>
                    <div class="invalid-feedback">
                        Your passwords do not match!
                    </div>
                </div>
            </form>
        </div>
        <div>
            <div>
                <router-link class="btn btn-primary" to="/login"
                    >Back</router-link
                >
            </div>
            <input
                value="Sign Up"
                type="submit"
                class="btn btn-warning"
                id="signup_next_step"
                form="soibear_signup_form"
            />
        </div>
    </div>
</template>
<script>
export default {
    name: "register",
    data() {
        return {
            name: "",
            email: "",
            phone: '',
            password: "",
            confirmPassword: '',
            showPassword: false,
            showConfirmPassword: false,
            matchingPassword: false,
            checkEmailTimer: null,
            validEmail: false,
            checkPhoneTimer: null,
            validPhone: false,
            timer: 500,
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
        email() {
            if (this.checkEmailTimer) {
                clearTimeout(this.checkEmailTimer);
                this.checkEmailTimer = null;
            }
            this.checkEmailTimer = setTimeout(() => {
                this.validateEmail();
            }, this.timer);
        },
        phone() {
            if (this.checkPhoneTimer) {
                clearTimeout(this.checkPhoneTimer);
                this.checkPhoneTimer = null;
            }
            this.checkPhoneTimer = setTimeout(() => {
                this.validatePhone();
            }, this.timer);
        }
    },
    computed: {
        invalidPhone() {
            if (this.validPhone) {
                return 'is-valid';
            } else if (this.phone && !this.validPhone) {
                return 'is-invalid';
            } else {
                return '';
            }
        },
        invalidEmail() {
            if (this.validEmail) {
                return 'is-valid';
            } else if (this.email && !this.validEmail) {
                return 'is-invalid';
            } else {
                return '';
            }
        },
        invalid() {
            let classType = '';
            if (
                this.matchingPassword &&
                this.password === this.confirmPassword &&
                this.password &&
                this.confirmPassword
            ) {
                classType = "is-valid";
            } else if (!this.password || !this.confirmPassword) {
                classType = "";
            } else {
                classType = "is-invalid";
            }
            return classType;
        },
    },
    methods: {
        togglePassword(state = '') {
            if (state) {
                this[state] = !this[state];
            }
        },
        async validateInputs() {
            await this.validateEmail();
            if (!this.validEmail) return false;

            await this.validatePhone();
            if (!this.validPhone) return false;

            if (!this.password || !this.confirmPassword || !this.email || this.name || this.phone) return false;
            if (this.password !== this.confirmPassword) return false;
            
            return true;
        },
        async register() {
            if (this.validEmail && this.validPhone && this.matchingPassword) {
                const endpoints = this.$store.getters['auth/endpoints'];
                const headers = await this.createHeaders();
                const response = await fetch(endpoints.createUser, {
                    method: 'post',
                    headers: {
                        "client-token": headers["client-token"],
                        "time-stamp": headers["time-stamp"],
                        "time-signature": headers["time-signature"],
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: this.name,
                        phone: this.phone,
                        email: this.email,
                        password: this.password,
                    }),
                }).then(res => res.json());

                console.log(response);
                if (response.resCode === 201) {
                    this.$router.push('/login');
                };
            } else {
                this.validateInputs();
            }
        },
        async validatePhone() {
            this.validPhone = false;
            const endpoints = this.$store.getters['auth/endpoints'];
            const headers = await this.createHeaders();
            const response = await fetch(endpoints.checkExistPhone, {
                method: 'post',
                headers: {
                    "client-token": headers["client-token"],
                    "time-stamp": headers["time-stamp"],
                    "time-signature": headers["time-signature"],
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone: this.phone,
                }),
            }).then(res => res.json());
            if (response.resCode === 200) {
                this.validPhone = true;
                return true;
            };
            return false;
        },
        async validateEmail() {
            this.validEmail = false;
            const endpoints = this.$store.getters['auth/endpoints'];
            const headers = await this.createHeaders();
            const response = await fetch(endpoints.checkExistEmail, {
                method: 'post',
                headers: {
                    "client-token": headers["client-token"],
                    "time-stamp": headers["time-stamp"],
                    "time-signature": headers["time-signature"],
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: this.email,
                }),
            }).then(res => res.json());
            if (response.resCode === 200) {
                this.validEmail = true;
                return true;
            };
            return false;
        },
        async createHeaders() {
            const endpoints = this.$store.getters['auth/endpoints'];
            const headers = await fetch(endpoints.header, {
                method: "post",
            }).then((res) => res.json());

            return headers;
        }
    }
};
</script>
<style scoped>
#signup_form {
    border: 2px #ccc solid;
    height: 80%;
    width: 80%;
    padding: 1.2rem;
    background: #fff;
    border-radius: 1rem;
    display: grid;
    grid-template-rows: 3fr 1fr 10fr 1fr;
}

#signup_form img {
    width: 100%;
}

#signup_form > div:last-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
}

#form_wrapper {
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
}

#form_wrapper form > div > span:nth-child(3):hover {
    cursor: pointer;
}

#regiser_form_loader {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

#regiser_form_loader h4 {
    margin: 0;
    color: #ffc107;
    font-weight: bold;
}

#soibear_signup_form {
    width: 100%;
}

@media (min-width: 500px) {
    #signup_form {
        max-width: 500px;
    }
}
</style>
