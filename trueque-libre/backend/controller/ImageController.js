const BaseException = require("../exceptions/BaseException.js");
const ImageService = require("../service/ImageService.js");
const multer = require('multer');
const fs = require('fs');

// Configuración de multer
const storage = multer.memoryStorage(); // Guarda el archivo en memoria
const upload = multer({ storage: storage });

class ImageController {
    constructor() {
        const label = `-------------------- ImageController setup - ${Date.now()}`;
        console.time(label);
        this.imageService = new ImageService();
        console.timeLog(label, 'ImageService setup complete');
        console.timeEnd(label);
    }

    async uploadImage(req, res) {
        try {
            // Usar multer para manejar la carga de archivos
            upload.single('fileData')(req, res, async (err) => {
                if (err) {
                    throw new BaseException("File upload error", 400, "Bad Request", "FileUploadError");
                }
                
                const creationUser = req.body.creationUser;
                const file = req.file;

                if (!file || !creationUser) {
                    throw new BaseException("Missing required fields", 400, "Bad Request", "MissingRequiredFields");
                }
                // Guardar el archivo utilizando el servicio
                const imageId = await this.imageService.saveImage(file.buffer, creationUser);
                console.log("Image ID:", imageId);

                res.status(201).json({ message: 'Imagen guardada exitosamente.', imageId });
            });
        } catch (error) {
            throw new BaseException(`ImageController.uploadImage: ${error.message}`, error.statusCode ?? 400, "Bad Request", "ImageUploadError");
        }
    }

    async getImage(req, res) {
        try {
            const { imageId } = req.params;

            if (!imageId) {
                throw new BaseException("Image ID is required", 400, "Bad Request", "ImageIdRequired");
            }
            console.log("Image ID:", imageId);
            const imageData = await this.imageService.getImageById(imageId);
            if (!imageData) {
                throw new BaseException("Image not found", 404, "Not Found", "ImageNotFound");
            }
            console.log("Image ID:", imageId);
            // Determinar el tipo de imagen basado en la extensión de archivo si es necesario
            res.setHeader('Content-Type', 'image/jpg'); // Cambiar según el tipo de imagen si es necesario

            
            // solo para pruebas

            fs.writeFileSync(`test_image_${imageId}.jpg`, imageData);

            const originalImagePath = "./img.jpg";
            const savedImagePath = `./test_image_${imageId}.jpg`;

            console.log("Original image path:", originalImagePath);
            console.log("Saved image path:", savedImagePath);

            // Leer el archivo original y el archivo guardado
            let originalImageBuffer, savedImageBuffer;

            if (fs.existsSync(originalImagePath)) {
                originalImageBuffer = fs.readFileSync(originalImagePath);
                console.log("Original image buffer leído con éxito");
            } else {
                console.log("Archivo original no encontrado:", originalImagePath);
            }

            if (fs.existsSync(savedImagePath)) {
                savedImageBuffer = fs.readFileSync(savedImagePath);
                console.log("Saved image buffer leído con éxito");
            } else {
                console.log("Archivo guardado no encontrado:", savedImagePath);
            }

            // Comparar longitudes
            console.log("Original image size:", originalImageBuffer.length);
            console.log("Saved image size:", savedImageBuffer.length);

            // Comparar contenido
            const isEqual = originalImageBuffer.equals(savedImageBuffer);
            console.log("Are images equal?", isEqual);

            // Enviar la imagen como respuesta
            res.status(200).send(imageData);
        } catch (error) {
            throw new BaseException(`ImageController.getImage: ${error.message}`, error.statusCode ?? 500, "Internal Server Error", "GetImageError");
        }
    }
}

module.exports = ImageController;
