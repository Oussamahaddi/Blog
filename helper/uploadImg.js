const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name : "dujpquv4d",
    api_key: "213693444639214",
    api_secret : "5h-sGaHXfVnMMbbT1HDaIR2oeMs"
})

const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
}

module.exports = (image) => {
    console.log(image);
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, opts, (err, result) => {
            if (result && result.secure_url) {
                console.log(result.secure_url);
                return resolve(result.secure_url);
            }
            console.log(err.message);
            return reject({message : err.message});
        })
    })
}


