const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create the uploads folder if it doesn't exist
const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/upload', upload.single('document'), (req, res) => {
    // Handle other form data
    const formData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phn,
        pages: req.body.pages,
        college: req.body.clg,
        printType: req.body.printType,
        instructions: req.body.instructions
    };

    console.log('Form data:', formData);
    console.log('Uploaded file:', req.file);

    // Return a success response to the client
    res.send('File uploaded and form data received successfully!');
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
