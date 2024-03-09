import express, { Request, Response } from "express";
import fs from "fs";
import path from 'path';
import multer from 'multer';

const app = express();
const port = 3001
const site_url = "https://localhost:3001"

// Set up multer to store files in the 'images' directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({ storage: storage })


app.post('/upload', upload.single('image'), (req, res) => {
    // The file is automatically stored in 'images'
    // 'image' is the field name from the form
    // req.file is the 'image' file
    // req.body will hold the text fields, if there were any

    // You can now construct the URL to the file, which would be something like:
    const fileUrl = `${site_url}/images/${req.file?.filename}`;

    // Send the URL of the file back to the client
    res.send({ fileUrl: fileUrl });
});

// Serve static files from the "images" directory
app.use('/images', express.static(path.join(__dirname, 'images')));

app.listen(port, () => {
    console.log("Server is running on port 3001")
})