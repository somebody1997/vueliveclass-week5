import productModal from './productModal.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/api';
const apiPath = 'vueliveclass';

const app = Vue.createApp({
    data(){
        return{
            loadingStatus:{
                loadingItem:'',
                buttonTarget:'',
            },
            products:[],
            productDetail:{},
            formData:{
                user:{
                    name:'',
                    email:'',
                    tel:'',
                    address:','
                },
                message:'',
            },
            cartData:{},
        };
    },
    methods:{
        getProductListData(){
            const url = `${apiUrl}/${apiPath}/products`;

            axios.get(url)
            .then((res) =>{
                if(res.data.success){
                    const { products} = res.data;
                    this.products= products;
                }else{
                    const {message} =res.data;
                    alert(message);
                }
            })
            .catch((error)=>{
                console.log(error);
            });
        },
        openModal(item){
            const url = `${apiUrl}/${apiPath}/product/${item.id}`;
            this.loadingStatus.loadingItem = item.id;
            this.loadingStatus.buttonTarget = 'openModal';
            
            axios.get(url)
            .then((res) =>{
                this.loadingStatus.loadingItem = '';
                this.loadingStatus.buttonTarget = '';
                
                if(res.data.success){
                    const {product} = res.data;
                    this.productDetail = product;
                    this.$refs.productModal.openModal();
                }else{
                    const {message} = res.data;
                    alert(message);
                }
            })
            .catch((error) =>{
                console.log(error);
            });
        },
        addToCart(productId,quantity = 1){
            const cart = {
                product_id : productId,
                qty : quantity,
            };
            
            const url = `${apiUrl}/${apiPath}/cart`;
            this.loadingStatus.loadingItem = productId;
            this.loadingStatus.buttonTarget = 'addToCart';

            axios.post(url,{data:cart})
            .then((res) =>{
                this.loadingStatus.loadingItem = '',
                this.loadingStatus.buttonTarget = '',
                this.$refs.productModal.hideModal();
                this.$refs.productModal.quantity = 1;

                const {message} =res.data;
                alert(message);
                if (res.data.success) {
                    this.getCartData();
                  }
            })
            .catch((error) =>{
                console.log(error);
            });
        },
        getCartData(){
            const url = `${apiUrl}/${apiPath}/cart`;
            
            axios.get(url)
                .then((res) =>{
                    if(res.data.success){
                        const {data} = res.data;
                        this.cartData = data;
                    }
                })
                .catch((error) =>{
                    console.log(error);
                });
        },
        updateCartItem(item){
            const url = `${apiUrl}/${apiPath}/cart/${item.id}`;
            const cartItemParams = {
                product_id: item.product_id,
                qty: item.qty,
            };
            this.loadingStatus.loadingItem = item.id;

            axios.put(url, {data:cart})
            .then((res) =>{
                this.loadingStatus.loadingItem = '';

                const {message} = res.data;
                alert(message);

                if(res.data.success){
                    this.getCartData();
                }
            })
            .catch((error) =>{
                console.log(error)
            });
        },
        removeAllCartItems(){
            const url = `${apiUrl}/${apiPath}/carts`;

            axios.delete(url)
                .then((res) =>{
                    const {message} = res.data;
                    alert(message);
                    console.log(res);
                    if(res.data.success){
                        this.getCartData();
                        console.log(res);
                    }
                })
                .catch((error) =>{
                    console.log(error);
                });
        },
        removeCartItem(id){
            const url = `${apiUrl}/${apiPath}/cart/${id}`;
            this.loadingStatus.loadingItem = id;

            axios.delete(url)
                .then((res) =>{
                    this.loadingStatus.loadingItem = '';
                    const {message} = res.data;
                    alert(message);

                    if(res.data.success){
                        this.getCartData();
                    }
                })
                .catch((error) =>{
                    console.log(error);
                });
        },
        submitOrder(){
            const url = `${apiUrl}/${apiPath}/order`;
            const order = this.formData;

            axios.post(url, {data:order})
                .then((res) =>{
                    const {message} =res.data;
                    alert(message);

                    if(res.data.success){
                        this.$refs.cartForm.resetForm();
                        this.formData.message = '';
                        this.getCartData();
                    }
                })
                .catch((error) =>{
                    console.log(error);
                });
        },
    },
    mounted(){
        this.getProductListData();
        this.getCartData();
    },
});

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true,
});

Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.component('productModal', productModal);
app.mount('#app');