<template>
    <div id="signup_form">
        <div>
            <a href="#"
                ><img src="https://i.imgur.com/El5WkrH.png" alt="soibear_logo"
            /></a>
        </div>
        <h1>Register</h1>
        <div id="form_wrapper">
            <form action="" id="soibear_signup_form" class="form-group">
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
                        required
                    />
                    <div class="invalid-feedback">
                        This Email is in use! Please choose another email
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
                        required
                    />
                    <div class="invalid-feedback">
                        This phone number is in use! Please choose another one
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
                        type="password"
                        class="form-control"
                        aria-label="new password"
                        placeholder="New Password"
                        required
                    />
                    <span class="input-group-text"
                        ><i class="fas fa-eye"></i
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
                        type="password"
                        class="form-control"
                        aria-label="confirm password"
                        placeholder="Confirm Password"
                        required
                    />
                    <span class="input-group-text"
                        ><i class="fas fa-eye"></i
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
            model: {
                name: "",
                email: "",
                password: "",
            },
        };
    },
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
