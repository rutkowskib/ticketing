import mongoose from 'mongoose';
import { Order } from './order';
import { OrderStatus } from '@ruciuxd/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttributes {
    id: string;
    title: string;
    price: number;
    userId: string;
}

export interface TicketDoc extends mongoose.Document {
    id: string;
    title: string;
    price: number;
    version: number;
    userId: string;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attributes: TicketAttributes): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attributes: TicketAttributes) => {
    return new Ticket({
        _id: attributes.id,
        title: attributes.title,
        price: attributes.price,
    });
};

ticketSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [ OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete ],
        },
    });
    return !!existingOrder;
};

export const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);
