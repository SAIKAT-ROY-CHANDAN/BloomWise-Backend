import multer from 'multer'
import path from 'path'
import fs from 'fs';
import axios from 'axios';

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

export const upload = multer({ storage });


export const uploadImage = async (req: any, res: any) => {
    console.log(req.body, 'body');
    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.error('Upload Error:', err);
            return res.status(400).json({ error: err.message });
        }

        try {
            const filePath = req.file.path;
            const imageUrl = await uploadToImgBB(filePath);

            // Delete the local file after successful upload to ImgBB
            fs.unlinkSync(filePath);
            console.log('Image uploaded to ImgBB:', imageUrl);

        } catch (error: any) {
            console.error('Error during ImgBB upload:', error.message);
        }
    });
};

export const uploadToImgBB = async (filePath: string): Promise<string> => {
    try {
        const imgBBApiKey = process.env.IMGBB_API_KEY;
        // Read the file and convert it to base64
        const fileData = fs.readFileSync(filePath, { encoding: 'base64' });

        const formData = new URLSearchParams();
        formData.append('image', fileData); // Send the file as a base64 string

        const response = await axios.post(
            `https://api.imgbb.com/1/upload?key=${imgBBApiKey}`,
            formData
        );

        const imageUrl = response.data.data.url;
        return imageUrl;
    } catch (error: any) {
        throw new Error('Error uploading image to ImgBB: ' + error.message);
    }
};
