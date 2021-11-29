import { Ticket } from '../ticket';
import mongoose from "mongoose";

it('Updates version in ticket', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: '1234',
    });

    await ticket.save();

    const [ firstInstance, secondInstance ] = await Promise.all([
        Ticket.findById(ticket.id),
        Ticket.findById(ticket.id),
    ]);

    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });
    await firstInstance!.save();
    await expect(async () => {
        await secondInstance!.save();
    }).rejects.toThrowError();
});

it('Increments the version number', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: '1234',
    });
    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
});