import {Ticket} from "../ticket";

it('Implements optimistic concurrency control', async () => {
    // Create an instance of a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    });

    // Save the ticket to the database
    await ticket.save();

    // Fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // Make two separate changes to the ticket we fetched
    firstInstance.set({price: 10});
    secondInstance.set({price: 15});

    // Save the first fetched ticket
    await firstInstance.save();

    // Save the second fetched ticket and expect an error
    await expect(secondInstance.save()).rejects.toThrow();
    // VersionError: No matching document found for id "610301d89d717e9311acf35c" version 0 modifiedPaths "price"
});

it('Increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: '123'
    });
    await ticket.save();

    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);
});
