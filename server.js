const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: 'rzp_test_xL6LkZQ0srI6cq',
    key_secret: 'wpsaMwGgKDznVZl5M8R04z4Q'
});

// Create Order
app.post('/create-order', async (req, res) => {
    try {
        const options = {
            amount: req.body.amount, // amount in paise
            currency: req.body.currency,
            receipt: req.body.receipt,
            payment_capture: req.body.payment_capture
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Verify Payment Signature
app.post('/payment-success', async (req, res) => {
    try {
        const { paymentId, orderId, signature } = req.body;
        const hmac = crypto.createHmac('sha256', 'YOUR_KEY_SECRET');
        hmac.update(orderId + '|' + paymentId);
        const generatedSignature = hmac.digest('hex');

        if (generatedSignature === signature) {
            // Payment is verified
            res.send('Payment verification successful');
        } else {
            // Payment is not verified
            res.status(400).send('Payment verification failed');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
