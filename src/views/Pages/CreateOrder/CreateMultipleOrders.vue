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
                <div v-if="showDropArea" class="card file-upload">
                    <div class="my-file" @drop.prevent="dropInput" >
                        <p><i class="fas fa-file-upload fa-5x"></i></p>
                        <p>Drag your Excel file (.xlsx or .xls) here</p>
                        <p>or <span>Click</span> to upload</p>
                        <input type="file" class="my-input" accept=".xlsx, .xls" id="uploadExcel" @change="importExcel">
                    </div>
                </div>
                <div v-else class="card"></div>
            </div>
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
        }
    },
    computed: {
        showDropArea() {
            if (this.sheetData.length) return false;
            return true;
        },
    },
    methods: {
        closeError(){
            this.isError = false;
        },
        handleFile(file = null){
            if(file) {
                const fileReader = new FileReader();

                fileReader.onload = (e) => {
                    try {
                        const data = e.target.result;
                        const XLSX = xlsx;
                        const workbook = XLSX.read(data, {
                            type: "binary"
                        });
                        const wsname = workbook.SheetNames[0]; // fetch the name from 1st sheet of the uploaded worksheet
                        const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); // parse data of the sheet
                        const excellist = []; // conatiner array for the sheet
                        for (let i = 0; i < ws.length; i++) {
                            excellist.push(ws[i]);
                        }
                        this.sheetData = excellist;
                        // console.log("result", excellist); // print the results in console
                    } catch (error) {
                        console.log(error);
                        return alert("import Excel file failed!");;
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

            if (!files.length) return console.warn('Something went wrong when uploading files');

            this.handleFile(files[0]);
        },
        importExcel(event){
            const files = event.target.files;
            console.log(files);
            if (!files.length) return console.warn('Something went wrong when uploading files'); // eject if no file is uploaded

            this.handleFile(files[0]);
        }
    }
}
</script>

<style lang="scss" scoped>
.file-upload {
    // background-color: #999;
    box-shadow: 0 5px 8px rgba(0,0,0,.3);

    .my-file {
        position: relative;
        height: 40vh;
        // background-color: #999;
        color: #aaa;
        border: 3px dashed #aaa;
        margin: .5rem;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        span {
            text-decoration: underline;
            font-weight: bold;
        }

        .my-input{
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
</style>