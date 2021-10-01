export const stripe = {
    charges: {
        create: jest.fn().mockResolvedValue({id: 'mock_stripe_id'})
    }
};
