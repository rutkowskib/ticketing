import mongoose from 'mongoose';

interface OrderAttributes {
   userId: string;
   status: string;
   expiresAt: Date;
   ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document, OrderAttributes {
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attributes: OrderAttributes): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date,
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});

orderSchema.statics.build = (attributes: OrderAttributes) => {
    return new Order(attributes);
};

export const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);
