import mongoose from 'mongoose';
import { OrderStatus } from '@ruciuxd/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrderAttributes {
    id: string;
    version: number;
    userId: string;
    price: number;
    status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
    version: number;
    userId: string;
    price: number;
    status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attributes: OrderAttributes): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attributes: OrderAttributes): OrderDoc => {
    return new Order({
        _id: attributes.id,
        version: attributes.version,
        status: attributes.status,
        userId: attributes.userId,
        price: attributes.price,
    });
};

export const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);
