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
        <button type="button" class="btn btn-primary" @click="exportTemplate">
          Download Template
        </button>
      </div>
      <div class="col" v-if="!showDropArea">
        <div class="upload_again btn btn-success">
          Upload again
          <input
            type="file"
            accept=".xlsx, .xls"
            id="uploadExcel"
            @change="importExcel"
          />
        </div>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col">
        <div v-if="showDropArea" class="card file-upload">
          <div class="my-file" @drop.prevent="dropInput">
            <p><i class="fas fa-file-upload fa-5x"></i></p>
            <p>Drag your Excel file (.xlsx or .xls) here</p>
            <p>or <span>Click</span> to upload</p>
            <input
              type="file"
              class="my-input"
              accept=".xlsx, .xls"
              id="uploadExcel"
              @change="importExcel"
            />
          </div>
        </div>
        <div v-else class="table-responsive card shadow">
          <div v-if="showLoading" class="loader">
            <div class="spinner-border text-warning" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <p>Loading...</p>
          </div>
          <table
            class="table align-items-center table-flush tablesorter"
            v-else
          >
            <thead class="thead-light">
              <tr>
                <th>order</th>
                <th>sender_name</th>
                <th>sender_phone</th>
                <th>sender_address</th>
                <th>sender_postcode</th>
                <th>receiver_name</th>
                <th>receiver_address</th>
                <th>receiver_phone</th>
                <th>receiver_postcode</th>
                <th>logistics</th>
                <th>cod</th>
                <th>product_code</th>
                <th>amount_of_products</th>
                <th>remove</th>
              </tr>
            </thead>
            <tbody class="list">
              <tr
                v-for="(row, index) in sheetData"
                :key="index + '_' + row.order"
              >
                <td>{{ row.order }}</td>
                <td>{{ row.sender_name }}</td>
                <td>{{ row.sender_phone }}</td>
                <td>{{ row.sender_address }}</td>
                <td>{{ row.sender_postcode }}</td>
                <td>{{ row.receiver_name }}</td>
                <td>{{ row.receiver_phone }}</td>
                <td>{{ row.receiver_address }}</td>
                <td>{{ row.receiver_postcode }}</td>
                <td>{{ row.receiver_logistics }}</td>
                <td>{{ row.receier_cod }}</td>
                <td>{{ row.product_code }}</td>
                <td>{{ row.amount }}</td>
                <td>
                  <!-- <button
                                        class="btn btn-warning"
                                        type="button"
                                    >
                                        Edit
                                    </button> -->
                  <button
                    class="btn btn-danger"
                    type="button"
                    @click="removeData(index)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div id="proceed_btns" v-if="!showDropArea">
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
import xlsx from 'xlsx';
import ErrorAlert from '../../../components/ErrorAlert.vue';

export default {
  components: {
    ErrorAlert,
  },
  data() {
    return {
      isError: false,
      errorTitle: 'Something went wrong',
      errorMessage: '',
      sheetData: [],
      showLoading: false,
    };
  },
  computed: {
    showDropArea() {
      if (this.sheetData.length) return false;
      return true;
    },
  },
  methods: {
    closeError() {
      this.isError = false;
    },
    handleFile(file = null) {
      if (file) {
        const fileReader = new FileReader();

        fileReader.onload = (e) => {
          try {
            this.showLoading = true;
            const data = e.target.result;
            const XLSX = xlsx;
            const workbook = XLSX.read(data, {
              type: 'binary',
            });
            const wsname = workbook.SheetNames[0]; // fetch the name from 1st sheet of the uploaded worksheet
            const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); // parse data of the sheet
            const excellist = []; // conatiner array for the sheet
            for (let i = 0; i < ws.length; i++) {
              excellist.push(ws[i]);
            }
            excellist.forEach((data) => {
              if (data.receiver_phone) {
                data.receiver_phone = data.receiver_phone.replaceAll(
                  /"|'/g,
                  '',
                );
              }
              if (data.sender_phone) {
                data.sender_phone = data.sender_phone.replaceAll(/\D/g, '');
              }
              if (!data.receiver_cod) {
                data.receiver_cod = 0;
              }
            });
            this.sheetData = excellist;
            this.showLoading = false;
          } catch (error) {
            console.log(error);
            return alert('import Excel file failed!');
          }
        };
        fileReader.readAsBinaryString(file);
      } else {
        return confirm('Please upload the file!');
      }
    },
    dropInput(event) {
      const files = [];
      if (event.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < event.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (event.dataTransfer.items[i].kind === 'file') {
            const file = event.dataTransfer.items[i].getAsFile();
            files.push(file);
            // console.log('... file[' + i + '].name = ' + file.name);
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (let i = 0; i < event.dataTransfer.files.length; i++) {
          files.push(event.dataTransfer.files);
          // console.log('... file[' + i + '].name = ' + event.dataTransfer.files[i].name);
        }
      }

      if (!files.length) {
        return console.warn('Something went wrong when uploading files');
      }
      this.handleFile(files[0]);
    },
    importExcel(event) {
      const files = event.target.files;
      if (!files.length)
        return console.warn('Something went wrong when uploading files'); // eject if no file is uploaded

      this.handleFile(files[0]);
    },
    exportTemplate() {
      const table = document.createElement('table');
      table.innerHTML = `
            <thead>
                <tr>
                    <th>order</th>
                    <th>sender_name</th>
                    <th>sender_phone</th>
                    <th>sender_address</th>
                    <th>sender_postcode</th>
                    <th>receiver_name</th>
                    <th>receiver_phone</th>
                    <th>receiver_address</th>
                    <th>receiver_postcode</th>
                    <th>receiver_logistics</th>
                    <th>receiver_cod</th>
                    <th>product_code</th>
                    <th>amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>John Doe</td>
                    <td>'0987654321</td>
                    <td>88 Soi Sukhumvit 19, Khwaeng Khlong Toei Nuea, Khet Watthana, Bangkok 10110</td>
                    <td>10110</td>
                    <td>Receiver1</td>
                    <td>999 หมู่ 1 Nong Prue, Bang Phli District, Samut Prakan 10540</td>
                    <td>'0123456789</td>
                    <td>10540</td>
                    <td>Kerry</td>
                    <td></td>
                    <td>S00000001</td>                    
                    <td>1</td>
                </tr>
                <tr>
                    <td>1</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>S00000002</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Smith Jane</td>
                    <td>'0987654321</td>
                    <td>Grand Palace Na Phra Lan Road, Grand Palace Bangkok 10200</td>
                    <td>10200</td>
                    <td>Receiver2</td>
                    <td>'0123456789</td>
                    <td>Phahonyothin Rd, Thanon Phaya Thai, Ratchathewi, Bangkok 10400</td>
                    <td>10400</td>
                    <td>Kerry</td>
                    <td></td>
                    <td>S00000001</td>                    
                    <td>1</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>500</td>
                    <td>S00000002</td>
                    <td>1</td>
                </tr>
            </tbody>
            `;
      const XLSX = xlsx;
      const wb = XLSX.utils.table_to_book(table, {
        sheet: 'bulk_upload',
      });
      return XLSX.writeFile(wb, 'soibear_bulk_template.xlsx');
    },
    removeData(index) {
      this.sheetData.splice(index, 1);
    },
    cancelCreatingOrder() {
      this.$router.go(-1);
    },
    integrateSKUs(sheetData) {
      let orders = [];
      if (sheetData.length) {
        sheetData.forEach((row) => {
          const position = orders.findIndex(
            (order) => order.order === row.order,
          );
          if (position > -1) {
            const products = JSON.parse(orders[position].node);
            products.push({
              barcode_number: row.product_code,
              amount: row.amount,
            });
            orders[position].node = JSON.stringify(products);
          } else {
            orders.push({
              type: 'add_order',
              order: row.order,
              name_send: row.sender_name,
              tel_send: row.sender_phone,
              address_send: row.sender_address,
              post_send: row.sender_postcode,
              name_cust: row.receiver_name,
              tel: row.receiver_phone,
              address: row.receiver_address,
              Post: row.receiver_postcode,
              Balance: row.receiver_cod,
              type_send: row.receiver_logistics,
              node: JSON.stringify([
                {
                  barcode_number: row.product_code,
                  amount: row.amount,
                },
              ]),
            });
          }
        });
      }
      return orders;
    },
    async createOrder() {
      this.isError = true;
      this.errorTitle = 'Processing';
      let progress = `0%`;
      this.errorMessage = progress;
      if (this.sheetData.length) {
        let counter = 0;
        let indexToRemove = 0;
        let list = this.integrateSKUs(this.sheetData);
        for (let i = 0; i < list.length; i++) {
          this.errorTitle = 'Loading';
          const res = await this.$store.dispatch('carry/createOrder', list[i]);
          if (res.resCode === 200) {
            console.log(`an order is created! Order: ${list[i].order}`);
            this.sheetData = this.sheetData.filter((data) => {
              return data.order !== list[i].order;
            });
          } else {
            indexToRemove++;
            console.log(`an order creation failed! Order: ${list[i].order}`);
          }
          counter++;
          let progress = `${(counter / list.length) * 100} %`;
          this.errorMessage = progress;
        }
        this.errorTitle = `Process Finished`;
        let message = '';
        if (indexToRemove) {
          message = `${indexToRemove} ${
            indexToRemove > 1 ? 'orders' : 'order'
          } failed to upload`;
        } else {
          message = 'All orders are created!';
        }
        this.errorMessage = message;
      } else {
        this.errorTitle = 'Something went wrong. No data can be sent';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.file-upload {
  // background-color: #999;
  box-shadow: 0 5px 8px rgba(0, 0, 0, 0.3);

  .my-file {
    position: relative;
    height: 40vh;
    // background-color: #999;
    color: #aaa;
    border: 3px dashed #aaa;
    margin: 0.5rem;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    span {
      text-decoration: underline;
      font-weight: bold;
    }

    .my-input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
    .my-input:hover {
      cursor: pointer;
    }
  }
}

.upload_again {
  input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  input:hover {
    cursor: pointer;
  }
}

.loader {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  div {
    height: 3rem;
    width: 3rem;
  }

  p {
    font-size: 2rem;
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
</style>
