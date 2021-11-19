import mongoose from 'mongoose';
import { Password } from '../services/password';

interface UserAttributes {
    email: string;
    password: string;
}

interface UserModel extends mongoose.Model<UserAttributes>{
    build: (attrs: UserAttributes) => UserDoc;
}

export interface UserDoc extends mongoose.Document, UserAttributes {}


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;

        },
    },
});

userSchema.statics.build = (attrs: UserAttributes) => {
    return new User(attrs);
};

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

export const User = mongoose.model<UserDoc, UserModel>('User', userSchema);