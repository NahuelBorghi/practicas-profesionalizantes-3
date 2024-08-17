const generateId = require('../utils/UUID.js');

class Image {
    constructor(image, creationUser, id = null) {
        this.id = id || generateId();
        this.image = image;
        this.creationDate = new Date();
        this.creationUser = creationUser;
    }
}

module.exports = Image;