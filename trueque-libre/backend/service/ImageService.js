const MysqlRepository = require("../repository/MySqlRepository.js");
const Image = require("../model/ImageModel.js");

class ImageService {
    constructor() {
        console.time('ImageService setup');
        this.mysqlRepository = new MysqlRepository();
        console.timeLog('ImageService setup', 'ImageService setup complete');
        console.timeEnd('ImageService setup');
    }

    async saveImage(fileBuffer, creationUser) {
        try {
            const image = new Image(fileBuffer, creationUser);
            await this.mysqlRepository.insertImage(image);
            return image.id;
        } catch (error) {
            console.error(error);
        }
    }

    async getImageById(imageId) {
        try{
            const image = await this.mysqlRepository.getImageById(imageId);
            return image;
        } catch (error) {
            console.error(error);
        }
    }

}

module.exports = ImageService;
