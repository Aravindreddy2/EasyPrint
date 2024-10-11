const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Folder where files will be uploaded
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filename to prevent overwriting
    }
});

const upload = multer({ storage: storage });

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve confirm.html
app.get('/confirm.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'confirm.html'));
});

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'vertor.pvt@gamil.com', // Replace with your Gmail
        pass: 'ewpy opkq gkqm xnfv' // App-specific password from Gmail
    }
});

// Route to handle file upload and email sending
app.post('/send-email', upload.single('document'), (req, res) => {
    const { name, email, phn, pages, clg, printType, instructions } = req.body;

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Set up email options
    const mailOptions = {
        from: 'vertor.pvt@gmail.com',
        to: email, // Send to the email provided by the user
        subject: `Document Upload - EasyPrint by ${name}`,
        text: `Thank you for uploading your document. Here are the details you provided:
        
        Name: ${name}
        Email: ${email}
        Phone: ${phn}
        Pages: ${pages}
        College: ${clg}
        Print Type: ${printType}
        Instructions: ${instructions}

        Your document is attached.`,
        attachments: [
            {
                filename: req.file.originalname,
                path: req.file.path // Path to the uploaded document
            }
        ]
    };

    // Send the email with the document attachment
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error while sending email.');
        } else {
            console.log('Email sent: ' + info.response);
            // Redirect to the confirmation page after sending the email
            res.redirect('/confirm.html');
        }
    });
});

// Start the server
app.listen(5501, () => {
    console.log('Server running on http://localhost:5501');
});
