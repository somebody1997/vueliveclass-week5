export default {
  props: ['productDetail'],
  template: `<div id="productModal" ref="productModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="productModalTitle" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="productModalTitle">
            <span>{{ tempProduct.title }}</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-6">
              <img class="img-fluid" :src="tempProduct.imageUrl" alt="商品圖片">
            </div>
            <div class="col-sm-6">
              <span class="badge bg-primary rounded-pill">{{ tempProduct.category }}</span>
              <p>商品描述 : {{ tempProduct.description }}</p>
              <p>商品內容 : {{ tempProduct.content }}</p>
              <div class="h5" v-if="!tempProduct.price">{{ tempProduct.origin_price }} 元</div>
              <del class="h6" v-if="tempProduct.price">原價 {{ tempProduct.origin_price }} 元</del>
              <div class="h5" v-if="tempProduct.price">現在只要 {{ tempProduct.price }} 元</div>
              <div>
                <div class="input-group">
                  <input type="number" class="form-control" v-model.number="quantity" min="1">
                  <button type="button" class="btn btn-primary" @click="$emit('add-to-cart', tempProduct.id, quantity)">加入購物車</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`,
  data() {
    return {
      status: {},
      tempProduct: {},
      modal: '',
      quantity: 1,
    };
  },
  methods: {
    openModal() {
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },
  },
  watch: {
    productDetail() {
      this.tempProduct = this.productDetail;
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.productModal);
  },
};