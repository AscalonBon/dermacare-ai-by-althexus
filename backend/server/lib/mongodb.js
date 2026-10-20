const mongoose = require('mongoose');

const cache = globalThis.__dermacareMongoose || {
  connection: null,
  promise: null,
};

globalThis.__dermacareMongoose = cache;

async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured.');
  }

  if (cache.connection?.connection.readyState === 1) {
    return cache.connection;
  }

  if (cache.connection && cache.connection.connection.readyState !== 1) {
    cache.connection = null;
    cache.promise = null;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    }).then((connection) => {
      cache.connection = connection;
      return connection;
    }).catch((error) => {
      cache.connection = null;
      cache.promise = null;
      throw error;
    });
  }

  return cache.promise;
}

module.exports = connectDB;
