import Stripe from 'stripe';

const stripe = new Stripe("sk_test_51Mj0VEILkb1ueBAxdYAerG39F6v3UINUMNTM6XNzZzefWJjXa5Jvcs1oSJV8LpO006ncWFAd2g2xoWPPkcExgQ8i00iHt1d5HA");

export default async function handler(req, res) {
  const id = req.query.id;

  try {
    if (!id.startsWith('cs_')) {
      throw Error('Incorrect CheckoutSession ID.');
    }
    const checkout_session = await stripe.checkout.sessions.retrieve(id);

    res.status(200).json(checkout_session);
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
