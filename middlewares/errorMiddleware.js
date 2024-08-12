export const notFound = (req, res, next) => {
  const error = new Error(`path not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let resStatusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Log error untuk debugging
  // console.error("Error message:", message);
  // console.error("Error stack:", err.stack);

  // Periksa jika error adalah ValidationError Mongoose
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    resStatusCode = 400; // Set status code untuk kesalahan validasi
  }

  // Kirim response dengan status dan pesan error
  res.status(resStatusCode).json({
    message: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Jangan kirim stack trace di produksi
  });
};
