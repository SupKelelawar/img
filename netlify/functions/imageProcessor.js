const axios = require('axios');

exports.handler = async function (event) {
  const { url, w, q } = event.queryStringParameters; // Mendapatkan parameter dari URL (url, width, quality)

  // Jika URL tidak ada, kembalikan error
  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "URL parameter is required" }),
    };
  }

  try {
    // Buat URL untuk wsrv.nl dengan parameter yang diterima
    const imageUrl = `https://images.weserv.nl/?w=${w || ''}&q=${q || ''}&url=${encodeURIComponent(url)}`;

    // Arahkan permintaan ke wsrv.nl dan dapatkan respons gambar
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    // Kembalikan gambar yang diproses
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: imageBuffer.toString('base64'),
      isBase64Encoded: true, // Mengembalikan gambar sebagai Base64
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error processing image" }),
    };
  }
};
