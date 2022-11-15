const mongoose = require('mongoose')
const slugify = require('slugify')
const KanbanSchema = new mongoose.Schema(
  {
    slug: String,
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    requests: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Requests',
    },
    uid_nfc: {
      type: String,
      required: ['true', 'Vous devez ajouter un identifiant NFC'],
      unique: true,
      trim: true,
      maxlength: [
        10,
        "L'identifiant d'un kanban ne peut contenir plus de de 10 caractères",
      ],
    },
    quantity: {
      type: Number,
    },
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// create kanban slug from the nfc id
KanbanSchema.pre('save', function (next) {
  this.slug = slugify(this.uid_nfc, { lower: true })
  next()
})

module.exports = mongoose.model('Kanban', KanbanSchema)
