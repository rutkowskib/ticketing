import mongoose from 'mongoose';

interface PaymentsAttributes {
    orderId: string;
    stripeId: string;
}

interface PaymentsDoc extends mongoose.Document {
    orderId: string;
    stripeId: string;
}

interface PaymentsModel extends mongoose.Model<PaymentsDoc> {
    build(attributes: PaymentsAttributes): PaymentsDoc;
}

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
    },
    stripeId: {
        required: true,
        type: String,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});

paymentSchema.statics.build = (attributes: PaymentsAttributes) => {
    return new Payment(attributes);
};

export const Payment = mongoose.model<PaymentsDoc, PaymentsModel>('Payment', paymentSchema);
