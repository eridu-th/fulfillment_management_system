<template>
    <div>
        <teleport to="body">
            <error-alert
                v-if="errorAlert"
                :content="errorMessage"
                @close="closeAlert"
            ></error-alert>
        </teleport>
        <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center">
            <span class="mask bg-gradient-warning opacity-8"></span>
        </base-header>

        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-xl-8 order-xl-1">
                    <card shadow type="secondary">
                        <template v-slot:header>
                            <div class="bg-white border-0">
                                <div class="row align-items-center">
                                    <div class="col-8">
                                        <h3 class="mb-0">My account</h3>
                                    </div>
                                    <div class="col-4 text-right">
                                        <button
                                            type="button"
                                            class="btn btn-sm btn-primary"
                                            @click="toggleEdit"
                                        >
                                            {{ editBtn }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <form>
                            <h6 class="heading-small text-muted mb-4">
                                User information
                            </h6>
                            <div class="pl-lg-4">
                                <div class="row">
                                    <div class="col-lg-4">
                                        <base-input
                                            alternative=""
                                            label="Name"
                                            placeholder="Name"
                                            input-classes="form-control-alternative"
                                            data-type="name"
                                            :value="name"
                                            @input="setValue"
                                            :disabled="!edit"
                                            :error="error.name"
                                            :valid="valid.name"
                                        />
                                    </div>
                                    <div class="col-lg-4">
                                        <base-input
                                            type="email"
                                            alternative=""
                                            label="Email"
                                            placeholder="Email"
                                            input-classes="form-control-alternative"
                                            data-type="email"
                                            :value="email"
                                            @input="setValue"
                                            :disabled="!edit"
                                            :error="error.email"
                                            :valid="valid.email"
                                        />
                                    </div>
                                    <div class="col-lg-4">
                                        <base-input
                                            type="phone"
                                            alternative=""
                                            label="Phone"
                                            placeholder="Phone Number"
                                            input-classes="form-control-alternative"
                                            data-type="phone"
                                            :value="phone"
                                            @input="setValue"
                                            :disabled="!edit"
                                            :error="error.phone"
                                            :valid="valid.phone"
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </card>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ErrorAlert from "../../components/ErrorAlert.vue";

export default {
    components: {
        ErrorAlert,
    },
    name: "user-profile",
    data() {
        return {
            name: "",
            email: "",
            phone: "",
            edit: false,
            valid: {
                name: null,
                email: null,
                phone: null,
            },
            error: {
                name: "",
                email: "",
                phone: "",
            },
            errorAlert: false,
            errorMessage: "",
        };
    },
    watch: {
        name() {
            this.valid.name = null;
        },
        email() {
            this.valid.email = null;
        },
        phone() {
            this.valid.phone = null;
        },
    },
    computed: {
        editBtn() {
            return this.edit ? "Done" : "Edit";
        },
    },
    methods: {
        async toggleEdit() {
            this.edit = !this.edit;
            if (!this.edit) {
                const user = this.$store.getters["auth/user"];
                if (user.name !== this.name) {
                    if (this.name) {
                        this.valid.name = true;
                    } else {
                        this.valid.name = false;
                    }
                } else {
                    this.valid.name = null;
                }

                if (user.email !== this.email) {
                    const response = await this.$store.dispatch(
                        "auth/validateEmail",
                        { email: this.email }
                    );
                    if (response.resCode === 200) {
                        this.valid.email = true;
                    } else {
                        this.error.email = response.message;
                    }
                } else {
                    this.valid.email = null;
                }

                if (user.phone !== this.phone) {
                    const response = await this.$store.dispatch(
                        "auth/validatePhone",
                        { phone: this.phone }
                    );
                    if (response.resCode === 200) {
                        this.valid.phone = true;
                    } else {
                        this.error.phone = response.message;
                    }
                } else {
                    this.valid.phone = null;
                }

                if (this.valid.name || this.valid.email || this.valid.phone) {
                    try {
                        const response = await this.$store.dispatch(
                            "auth/editUserData",
                            {
                                name: this.name,
                                email: this.email,
                                phone: this.phone,
                            }
                        );
                        console.log(response);
                        if (response.resCode === 200) {
                            this.valid.name = true;
                            this.valid.phone = true;
                            this.valid.email = true;
                        } else {
                            this.errorMessage = response.message;
                            this.errorAlert = true;
                        }
                    } catch (err) {
                        this.errorMessage =
                            err.message || "Server has some issue...";
                    }
                }
            }
        },
        setValue(event) {
            const type = event.target.dataset.type;
            const input = event.target.value;
            switch (type) {
                case "name":
                    this.name = input;
                    break;
                case "email":
                    this.email = input;
                    break;
                case "phone":
                    this.phone = input;
                    break;
                default:
                    break;
            }
        },
        closeAlert() {
            this.errorAlert = false;
        },
        resetState() {
            this.name = "";
            this.email = "";
            this.phone = "";
            this.edit = false;
            this.valid = {
                name: null,
                email: null,
                phone: null,
            };
            this.error = {
                name: "",
                email: "",
                phone: "",
            };
        },
    },
    mounted() {
        this.resetState();
        const user = this.$store.getters["auth/user"];
        this.name = user.name;
        this.email = user.email;
        this.phone = user.phone;
    },
};
</script>
<style></style>
