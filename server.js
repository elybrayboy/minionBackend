const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const imagesDir = path.join(__dirname, 'images');

// Ensure images directory exists
if (!fs.existsSync(imagesDir)){
    fs.mkdirSync(imagesDir);
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use('/images', express.static(imagesDir));

app.get('/gallery', (req, res) => {
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            console.error('Failed to read the gallery directory.', err);
            res.status(500).send('Failed to read the gallery directory.');
        } else {
            console.log('Files:', files); // Log files for debugging
            res.json(files);
        }
    });
});

app.post('/upload', (req, res) => {
    const imgData = req.body.imgBase64;
    const imgBuffer = Buffer.from(imgData.split(',')[1], 'base64');
    const filename = `image-${Date.now()}.jpg`;

    fs.writeFile(path.join(imagesDir, filename), imgBuffer, (err) => {
        if (err) {
            console.error('Failed to save image:', err);
            res.status(500).send('Failed to save image.');
        } else {
            console.log('Image saved successfully:', filename); // Log filename for debugging
            res.send('Image saved successfully.');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
