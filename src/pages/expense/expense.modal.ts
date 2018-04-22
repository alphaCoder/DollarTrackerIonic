import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, Platform, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Expense } from './expense.model';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ExpenseService } from './expense.service';
import { ExpenseStory } from '../expenseStory/expenseStory.model';
import { Plugins } from '../../shared/upload/plugins.service';
import { Transfer } from '@ionic-native/transfer';
import { IonicSearchSelectPage } from '../../shared/ionic-select/ionic-search-select';
import { ActionSheetController } from 'ionic-angular';

@Component({
    templateUrl: 'expense.modal.html'
})
export class ExpenseModalPage {
    public expenseStory: ExpenseStory;
    public expense: Expense = new Expense();
    public _imageBlob: any = null;
    public images: Array<string> = [];
    public loading: any;
    public base64Image: string = null;
    private isEdit = false;
    
    constructor(
        public platform: Platform,
        public params: NavParams,
        public viewCtrl: ViewController,
        public alert: AlertController,
        public expenseService: ExpenseService,
        public plugins: Plugins,
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public actionSheetCtrl: ActionSheetController,
        private camera: Camera
    ) {
        let dt = new Date();
        this.expenseStory = params.data.expenseStory;
        this.expense.expenseUtcDt = dt.toISOString();

        if (params.data.expense) {
            this.expense = params.data.expense;
            this.isEdit = true;
        }
        else {
            this.expense.expenseStoryId = this.expenseStory.expenseStoryId;
        }
        this.loading = loadingCtrl.create();
    }
    public save() {
        if (!this.validate()) return;
        if (this.images.length > 0) {
            var fileName = 'receipt-' + new Date().getTime() + '.jpg';
            this.loading.present();

            var file = new File(this._imageBlob, fileName);
            var files: Array<any> = [file];
            if (this.isEdit) {
                this.expenseService
                    .updateExpense(this.expense, this.images)
                    .subscribe(response => {
                        this.dismiss(response);
                    }, error =>{
                        this.dismiss(null);
                    });
            }
            else {
                this.expenseService
                    .addExpense(this.expense, this.images)
                    .subscribe(response => {
                        this.dismiss(response);
                    }, error =>{
                        this.dismiss(null);
                    });
            }
        }
        else {
            if (this.isEdit) {
                this.expenseService
                .updateOnlyExpense(this.expense)
                .subscribe(response => {
                    this.dismiss(response);
                }, error =>{
                    this.dismiss(null);
                });
            }
            else {
                 this.expenseService
                 .addOnlyExpense(this.expense)
                 .subscribe(response => {
                     this.dismiss(response);
                 }, error =>{
                     this.dismiss(null);
                 });
            }
        }
    }

    public validate(): boolean {
        let isValid = false;
        if (this.expense.expenseSubCategoryId == null) {
            this.showError("Please select a valid expense category");
        }
        else if (this.expense.amount == null || this.expense.amount <= 0) {
            this.showError("Please enter a valid amount");
        }
        else if (this.expense.expenseUtcDt == null) {
            this.showError("Please select a valid expense date");
        }
        else {
            isValid = true;
        }
        return isValid;
    }

    public showError(message) {
        let errorAlert = this.alert.create({
            title: 'Invalid Input',
            message: message,
            buttons: ['OK'],
            enableBackdropDismiss: true
        });
        errorAlert.present();
    }

    public uploadReceipt() {
        const options: CameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.PNG,
            mediaType: this.camera.MediaType.PICTURE,
            targetWidth: 400,
            targetHeight: 300,
          }
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Upload receipt',
            buttons: [
                {
                    text: 'Take Photo',
                    handler: () => {
                        this.camera.getPicture(options).then((imageData) => {
                            // imageData is either a base64 encoded string or a file URI
                            // If it's base64:
                            this.images.push(imageData);
                            this.base64Image =  imageData;
                           }, (err) => {
                            // Handle error
                           });
                       
                       
                        // this.plugins.camera.open()
                        //     .then(imgUrl => {
                        //         if (imgUrl) {
                        //             this.images.push(imgUrl);
                        //             this.base64Image = imgUrl;
                        //         }
                        //     }, error => { console.log("image upload error", error) })
                    }
                },
                {
                    text: 'Photo Library',
                    handler: () => {
                        this.plugins.albums.open()
                            .then(imgUrl => {
                                if (imgUrl) {
                                    this.images.push(imgUrl);
                                    this.base64Image = imgUrl;
                                }
                            }, error => { console.log("image upload error", error) })
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });

        actionSheet.present();


    }
    public onSelectCategory(category: any) {
        if (category) {
            this.expense.expenseCategoryId = category.expenseCategoryId;
            this.expense.expenseSubCategoryId = category.expenseSubCategoryId;
            this.expense.subCategoryDescription = category.description;
        }
    }
    public dismiss(response) {
        this.viewCtrl.dismiss(response);
        this.loading.dismiss();
    }
}