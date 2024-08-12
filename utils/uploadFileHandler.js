import multer from "multer";
import path from "path";

const FILE_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValidFormat = FILE_TYPE[file.mimetype];

    let uploadError = new Error("Invalid format image ");

    if (isValidFormat) {
      uploadError = null;
    }
    cb(uploadError, "./public/upload");
  },
  filename: function (req, file, cb) {
    const uniquieFile = `${file.filename}-${Date.now()}${path.extname(
      file.originalname
    )}`;

    cb(null, uniquieFile);
  },
});

export const upload = multer({ storage: storage });
