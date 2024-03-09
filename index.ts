import express, { Request, Response } from "express";
import path from 'path';
import multer from 'multer';
import cors from 'cors';
import pgp from 'pg-promise';
import fs from 'fs';

const app = express();
app.use(cors());
const port = 3001
const site_url = "https://localhost:3001"

// Set up pg-promise
const db = pgp()('postgresql://postgres:53F35cCbAGd4C6bCgB25e5cAbDDDD4Ca@viaduct.proxy.rlwy.net:58104/railway');


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


app.post('/upload', upload.single('image'), async (req, res) => {
    const file = req.file as unknown as Express.Multer.File;
    try {
        const img = await fs.promises.readFile(file.path);
        await db.none('INSERT INTO images(data) VALUES($1)', [img]);
        await fs.promises.unlink(file.path); // delete file from 'uploads' directory
        res.send('Image uploaded successfully.');
      } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred.');
      }
});

// Serve static files from the "images" directory
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(cors());


app.listen(port, () => {
    console.log("Server is running on port 3001")
})
module.exports = app;
