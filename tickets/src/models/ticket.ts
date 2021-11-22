import mongoose from 'mongoose';

interface TicketAttributes {
    title: string;
    price: number;
    userId: string;
}

interface TicketDoc extends mongoose.Document, TicketAttributes {
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attributes: TicketAttributes): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});

ticketSchema.statics.build = (attributes: TicketAttributes) => {
    return new Ticket(attributes);
};

export const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);
