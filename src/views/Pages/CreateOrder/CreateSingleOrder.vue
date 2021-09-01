<template>
  <base-header type="gradient-warning" class="pb-6 pb-8 pt-5 pt-md-8">
  </base-header>
  <teleport to="body">
    <error-alert
      @close="closeError"
      :title="errorTitle"
      :content="errorMessage"
      v-if="isError"
    ></error-alert>
  </teleport>
  <div class="container-fluid mt--9">
    <div class="row mt-5">
      <div class="col">
        <keep-alive>
          <div id="order_forms">
            <create-order-form
              :headerBgColor="'royalblue'"
              :headerTextColor="'white'"
            >
              <template v-slot:header> Sender Information </template>
              <template v-slot:form>
                <form @submit.prevent>
                  <div class="form-group">
                    <label for="sender_name">Sender Name</label>
                    <input
                      id="sender_name"
                      type="text"
                      class="form-control"
                      :class="senderInput.name"
                      v-model="sender.name"
                      required
                    />
                    <div class="invalid-feedback">
                      Sender name is not correct
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="sender_phone">Sender Phone</label>
                    <input
                      id="sender_phone"
                      type="tel"
                      inputmode="tel"
                      class="form-control"
                      :class="senderInput.phone"
                      v-model="sender.phone"
                      required
                    />
                    <div class="invalid-feedback">
                      Sender phone is not correct
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="sender_address">Sender Address</label>
                    <textarea
                      name=""
                      id="sender_address"
                      class="form-control"
                      :class="senderInput.address"
                      v-model="sender.address"
                      required
                    ></textarea>
                    <div class="invalid-feedback">
                      Sender address is not correct
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="sender_postcode">Sender Postcode</label>
                    <input
                      list="sender_postcode"
                      class="form-control"
                      :class="senderInput.postcode"
                      v-model="sender.postcode"
                      autocomplete="off"
                      autocorrect="off"
                      type="search"
                      required
                    />
                    <datalist id="sender_postcode">
                      <option
                        v-for="postcode in postcodes"
                        :value="postcode"
                        :key="postcode"
                      >
                        {{ postcode }}
                      </option>
                    </datalist>
                    <div class="invalid-feedback">
                      Sender postcode is not correct
                    </div>
                  </div>
                </form>
              </template>
            </create-order-form>
            <create-order-form
              :headerBgColor="'#e75480'"
              :headerTextColor="'white'"
            >
              <template v-slot:header> Receiver Information </template>
              <template v-slot:form>
                <form @submit.prevent>
                  <div class="form-group">
                    <label for="receiver_name">Receiver Name</label>
                    <input
                      id="receiver_name"
                      type="text"
                      class="form-control"
                      :class="receiverInput.name"
                      v-model="receiver.name"
                      required
                    />
                    <div class="invalid-feedback">
                      Receiver name is not correct
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="receiver_phone">Receiver Phone</label>
                    <input
                      id="receiver_phone"
                      type="tel"
                      inputmode="tel"
                      class="form-control"
                      :class="receiverInput.phone"
                      v-model="receiver.phone"
                      required
                    />
                    <div class="invalid-feedback">
                      Receiver phone is not correct
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="receiver_address">Receiver Address</label>
                    <textarea
                      name=""
                      id="receiver_address"
                      class="form-control"
                      :class="receiverInput.address"
                      v-model="receiver.address"
                      required
                    ></textarea>
                    <div class="invalid-feedback">
                      Receiver address is not correct
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="receiver_postcode">Receiver Postcode</label>
                    <input
                      list="receiver_postcode"
                      class="form-control"
                      :class="receiverInput.postcode"
                      v-model="receiver.postcode"
                      autocomplete="off"
                      autocorrect="off"
                      type="search"
                      required
                    />
                    <datalist id="receiver_postcode">
                      <option
                        v-for="postcode in postcodes"
                        :value="postcode"
                        :key="postcode"
                      >
                        {{ postcode }}
                      </option>
                    </datalist>
                    <div class="invalid-feedback">
                      Receiver postcode is not correct
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="receiver_cod">Cash On Delivery</label>
                    <input
                      id="receiver_cod"
                      type="number"
                      inputmode="numeric"
                      class="form-control"
                      :class="receiverInput.cod"
                      v-model="receiver.cod"
                    />
                    <div class="invalid-feedback">
                      COD should be greater than or equal to 0
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="carrier_list">Logistics Carrier</label>
                    <input
                      list="carrier_list"
                      class="form-control"
                      :class="receiverInput.logistics"
                      v-model="receiver.logistics"
                      autocomplete="off"
                      autocorrect="off"
                      type="search"
                      required
                    />
                    <datalist id="carrier_list">
                      <option
                        v-for="carrier in logistics"
                        :key="carrier"
                        :value="carrier"
                      >
                        {{ carrier.includes('EMS') ? 'EMS Postal' : carrier }}
                      </option>
                    </datalist>
                    <div class="invalid-feedback">
                      Logistics service is not available
                    </div>
                  </div>
                </form>
              </template>
            </create-order-form>
            <create-order-form
              :headerBgColor="'#ff8c00'"
              :headerTextColor="'white'"
            >
              <template v-slot:header> Products </template>
              <template v-slot:form>
                <form @submit.prevent="addProduct(selectedProduct.id)">
                  <div class="form-group">
                    <label for="selected_product"
                      >Select Product
                      <span
                        class="btn btn-primary btn-sm"
                        @click="clearSelectedProduct"
                      >
                        clear
                      </span>
                    </label>
                    <input
                      id="selected_product"
                      list="product_list"
                      class="form-control"
                      :class="productInput"
                      v-model="selectedProduct.id"
                      autocomplete="off"
                      autocorrect="off"
                      type="search"
                    />
                    <datalist id="product_list">
                      <option
                        v-for="product in products"
                        :key="product.barcode_number"
                        :value="product.barcode_number"
                      >
                        {{ product.product_name }}
                      </option>
                    </datalist>
                    <div class="invalid-feedback">
                      Please select a valid product in the options
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="product_amount">Amount</label>
                    <input
                      id="product_amount"
                      type="number"
                      inputmode="numeric"
                      class="form-control"
                      :class="productAmountInput"
                      v-model.number="selectedProduct.amount"
                      min="1"
                    />
                    <div class="invalid-feedback">
                      You should have at least 1 product
                    </div>
                    <button @type="submit" class="btn btn-primary">
                      Add Product
                    </button>
                  </div>
                </form>
              </template>
            </create-order-form>
            <create-order-form
              :headerBgColor="'#ff8c00'"
              :headerTextColor="'white'"
            >
              <template v-slot:header> Product List </template>
              <template v-slot:form>
                <table class="table align-items-center table-flush tablesorter">
                  <thead class="thead-light">
                    <tr>
                      <th>Image</th>
                      <th>Product Name</th>
                      <th>Amount</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody class="list">
                    <tr
                      v-for="product in orderProductList"
                      :key="product.barcode_number"
                    >
                      <td>
                        <img
                          src="https://jncdqugytx-flywheel.netdna-ssl.com/wp-content/uploads/2019/04/product-placeholder.gif"
                          alt="product_img"
                        />
                      </td>
                      <td>
                        {{ product[product.barcode_number].product_name }}
                      </td>
                      <td class="text-center">
                        {{ product.amount }}
                      </td>
                      <td>
                        <span
                          class="btn btn-danger btn-sm"
                          @click="removeProduct(product.barcode_number)"
                          >Remove</span
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </template>
            </create-order-form>
          </div>
        </keep-alive>
      </div>
    </div>
  </div>
  <div id="proceed_btns">
    <div>
      <button @click="cancelCreatingOrder" type="button" class="btn btn-danger">
        Cancel
      </button>
    </div>
    <div>
      <button @click="createOrder" type="button" class="btn btn-primary">
        Confirm
      </button>
    </div>
  </div>
</template>

<script>
import CreateOrderForm from './CreateOrderForm.vue';
import ErrorAlert from '../../../components/ErrorAlert.vue';

export default {
  components: {
    CreateOrderForm,
    ErrorAlert,
  },
  data() {
    return {
      logistics: [
        'Kerry',
        'Kerry Sameday',
        'Kerry COD',
        'Lazada',
        'Shopee',
        'Flash',
        'J&T',
        'SCG',
        'Alpha',
        'ไปรษณีย์ EMS',
      ],
      sender: {
        name: '',
        phone: '',
        address: '',
        postcode: '',
      },
      receiver: {
        name: '',
        phone: '',
        address: '',
        postcode: '',
        cod: 0,
        logistics: '',
      },
      products: [],
      selectedProduct: {
        id: '',
        amount: 1,
      },
      orderProductList: [],
      isCreateOrder: false,
      isError: false,
      errorMessage: '',
      errorTitle: 'Something went wrong',
      senderInput: {
        name: '',
        phone: '',
        address: '',
        postcode: '',
      },
      receiverInput: {
        name: '',
        phone: '',
        address: '',
        postcode: '',
        cod: '',
        logistics: '',
      },
      productInput: '',
      productAmountInput: '',
    };
  },
  watch: {
    'sender.name'() {
      this.senderInput.name = '';
    },
    'sender.phone'() {
      this.senderInput.phone = '';
    },
    'sender.address'() {
      this.senderInput.address = '';
    },
    'sender.postcode'() {
      this.senderInput.postcode = '';
    },
    'receiver.name'() {
      this.receiverInput.name = '';
    },
    'receiver.phone'() {
      this.receiverInput.phone = '';
    },
    'receiver.address'() {
      this.receiverInput.address = '';
    },
    'receiver.postcode'() {
      this.receiverInput.postcode = '';
    },
    'receiver.logistics'() {
      this.receiverInput.logistics = '';
    },
    'selectedProduct.id'() {
      this.productInput = '';
    },
  },
  computed: {
    postcodes() {
      return this.$store.getters['postcode/allThaiPostcodes'];
    },
  },
  methods: {
    closeError() {
      this.isError = false;
      if (this.isCreateOrder) {
        this.reset();
        this.isCreateOrder = false;
      }
      this.errorTitle = 'Something went wrong';
      this.errorMessage = '';
    },
    clearSelectedProduct() {
      this.selectedProduct.id = '';
      this.selectedProduct.amount = 1;
    },
    addProduct(barcode_number = '') {
      const allProductIds = this.products.map((item) => item.barcode_number);

      if (allProductIds.includes(barcode_number)) {
        const position = this.orderProductList.findIndex(
          (item) => item.barcode_number === barcode_number
        );
        if (position > -1) {
          this.orderProductList[position].amount += parseInt(
            this.selectedProduct.amount
          );
        } else {
          const product = this.products.find(
            (product) => barcode_number === product.barcode_number
          );
          this.orderProductList.push({
            [barcode_number]: product,
            barcode_number,
            amount: parseInt(this.selectedProduct.amount),
          });
        }
        this.clearSelectedProduct();
      } else {
        let message = '';
        if (barcode_number) {
          message = `product id doesn't exist!`;
        } else {
          message = `please provide product id!`;
        }
        confirm(message);
        console.warn(message);
      }
    },
    removeProduct(barcode_number) {
      const position = this.orderProductList.findIndex(
        (item) => item.barcode_number === barcode_number
      );
      this.orderProductList.splice(position, 1);
    },
    cancelCreatingOrder() {
      this.$router.go(-1);
    },
    validateInputs() {
      let invalidList = [];
      if (!this.sender.name) {
        this.senderInput.name = 'is-invalid';
        invalidList.push('sender name');
      }
      if (!this.sender.phone) {
        this.senderInput.phone = 'is-invalid';
        invalidList.push('sender phone');
      }
      if (!this.sender.address) {
        this.senderInput.address = 'is-invalid';
        invalidList.push('sender address');
      }

      if (
        !this.sender.postcode ||
        !/\d{5}/g.test(this.sender.postcode) ||
        !this.postcodes.includes(this.sender.postcode)
      ) {
        this.senderInput.postcode = 'is-invalid';
        invalidList.push('sender postcode');
      }
      if (!this.receiver.name) {
        this.receiverInput.name = 'is-invalid';
        invalidList.push('receiver name');
      }
      if (!this.receiver.phone) {
        this.receiverInput.phone = 'is-invalid';
        invalidList.push('receiver phone');
      }
      if (!this.receiver.address) {
        this.receiverInput.address = 'is-invalid';
        invalidList.push('receiver address');
      }
      if (
        !this.receiver.postcode ||
        !/\d{5}/g.test(this.receiver.postcode) ||
        !this.postcodes.includes(this.receiver.postcode)
      ) {
        this.receiverInput.postcode = 'is-invalid';
        invalidList.push('receiver postcode');
      }
      if (
        !this.receiver.logistics ||
        !this.logistics.includes(this.receiver.logistics)
      ) {
        this.receiverInput.logistics = 'is-invalid';
        invalidList.push('Logistics');
      }

      return invalidList;
    },
    checkInputs() {
      if (this.sender.name) return true;
      if (this.sender.phone) return true;
      if (this.sender.address) return true;
      if (this.sender.postcode) return true;
      if (this.receiver.name) return true;
      if (this.receiver.phone) return true;
      if (this.receiver.address) return true;
      if (this.receiver.postcode) return true;
      if (this.receiver.logistics) return true;
      if (this.orderProductList.length) return true;
      return false;
    },
    async createOrder() {
      this.isError = true;
      if (this.orderProductList.length) {
        const products = this.orderProductList.map((item) => {
          return {
            barcode_number: item.barcode_number,
            amount: item.amount,
          };
        });
        const errorInputs = this.validateInputs();
        if (!errorInputs.length) {
          const option = {
            type: 'add_order',
            name_send: this.sender.name,
            tel_send: this.sender.phone,
            address_send: this.sender.address,
            post_send: this.sender.postcode,
            name_cust: this.receiver.name,
            tel: this.receiver.phone,
            address: this.receiver.address,
            Post: this.receiver.postcode,
            Balance: this.receiver.cod,
            type_send: this.receiver.logistics,
            node: JSON.stringify(products),
          };

          this.errorTitle = 'Loading';
          const res = await this.$store.dispatch('carry/createOrder', option);
          console.log(res);
          if (res.resCode === 200) {
            console.log('order is created');
            this.errorTitle = 'Create Order Success!';
            this.errorMessage = 'Your order is created successfully';
            this.isCreateOrder = true;
          } else {
            this.errorTitle = 'Something went wrong';
            console.log('order creation failed');
          }
        } else {
          const verb = errorInputs.length > 1 ? 'are' : 'is';
          this.errorMessage = `Your ${errorInputs.join(
            ', '
          )} ${verb} not correct!`;
        }
      } else {
        this.productInput = 'is-invalid';
        this.errorMessage = `You haven't added any product yet!`;
      }
    },
    async getProducts() {
      await this.$store.dispatch('carry/getProducts', {
        type: 'product',
      });
      this.products = this.$store.getters['carry/products'];
    },
    reset() {
      this.sender = {
        name: '',
        phone: '',
        address: '',
        postcode: '',
      };
      this.receiver = {
        name: '',
        phone: '',
        address: '',
        postcode: '',
        cod: 0,
        logistics: 'Kerry',
      };
      // this.products = [];
      this.selectedProduct = {
        id: '',
        amount: 1,
      };
      this.orderProductList = [];
      this.isError = false;
      this.errorMessage = '';
      this.errorTitle = 'Something went wrong';
    },
  },
  async beforeMount() {
    await this.getProducts();
    console.log(this.$store.getters['carry/user']);
  },
  beforeRouteLeave(to, from, next) {
    if (this.checkInputs()) {
      const answer = confirm(
        `You haven't finished creating order. Are you sure to leave?`
      );
      if (answer) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  },
};
</script>

<style scoped lang="scss">
#order_forms {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min-content, 500px));
  column-gap: 1rem;
  & > div {
    margin-bottom: 2rem;
  }
}

#proceed_btns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  button {
    display: block;
    margin: 2rem auto;
  }
}

#product_amount ~ button {
  display: block;
  margin: 0 auto;
  margin-top: 1rem;
}

tbody {
  img {
    display: block;
    width: 50px;
    height: 50px;
    object-fit: cover;
  }

  td:nth-child(2) {
    max-width: 11rem;
    white-space: normal;
  }
}
</style>
