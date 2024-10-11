const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Your Razorpay key and secret
const RAZORPAY_SECRET = 'your_razorpay_secret';

// Endpoint to handle Razorpay webhooks
app.post('/payment-success', (req, res) => {
    const razorpaySignature = req.headers['x-razorpay-signature'];
    const payload = req.body;
    const generatedSignature = crypto.createHmac('sha256', RAZORPAY_SECRET)
                                     .update(`${payload.order_id}|${payload.payment_id}`)
                                     .digest('hex');

    if (generatedSignature === razorpaySignature) {
        // Signature is valid, process the payment
        res.status(200).send('Payment received');
    } else {
        // Invalid signature
        res.status(400).send('Invalid signature');
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
