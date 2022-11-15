const mongoose = require('mongoose')
const slugify = require('slugify')

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: [true, "Merci d'entrer un numero de commande"],
      maxlength: [
        20,
        'Le numéro de commande doit contenir au maximum 20 caractères',
      ],
    },
    quantity: {
      type: Number,
    },
    orderDays: Number,

    status: String,
    orderDate: {
      type: Date,
      required: true,
      min: '2022-01-01',
      max: '2100-01-01',
    },
    supplierDate: {
      type: Date,
      default: null,
      min: '2022-01-01',
      max: '2100-01-01',
    },
    deliveryDate: {
      type: Date,
      default: null,
      min: '2022-01-01',
      max: '2100-01-01',
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true },
)

// Create  order slug from the order number
OrderSchema.pre('save', function (next) {
  this.slug = slugify(this.orderNumber, { lower: true })
  next()
})
// Calculates the number of days elapsed since the request
OrderSchema.pre('save', function (next) {
  if (this.deliveryDate === null) {
    this.orderDays = Math.round(
      (Date.now() - new Date(this.orderDate).getTime()) / (1000 * 3600 * 24),
    )
  } else {
    this.orderDays = Math.round(
      (new Date(this.deliveryDate) - new Date(this.orderDate).getTime()) /
        (1000 * 3600 * 24),
    )
  }
  next()
})

// create the status  order in relation to the dates

OrderSchema.pre('save', function (next) {
  if (this.supplierDate === null) {
    this.status = 'Traitement fournisseur'
  }
  if (this.deliveryDate === null && this.supplierDate != null) {
    this.status = 'en cours de livraison'
  }
  if (this.deliveryDate != null) {
    this.status = 'Livrée'
  }
  next()
})

module.exports = mongoose.model('Order', OrderSchema)
