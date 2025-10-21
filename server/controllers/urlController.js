import redis from "../config/redis.js";
import Url from "../models/urlModel.js";
import generateShortId from "../utils/idGenerator.js";


export const createUrl = async (req, res) => {
  try {
    const { longUrl } = req.body;

    if (!longUrl) {
      return res.status(400).json({
        message: "Long URL is required",
      });
    }

    console.log("BASE_URL from env:", process.env.BASE_URL);

    // ✅ Await the Redis get call
    const cached = await redis.get(longUrl);

    if (cached) {
      return res.status(200).json({
        message: "URL already exists",
        shortUrl: `${process.env.BASE_URL}/${cached}`,
      });
    }

    // Generate short ID
    const shortId = generateShortId();

    // Save to MongoDB
    const newUrl = new Url({
      longUrl,
      shortUrl: shortId,
      user: req.user._id,
    });
    await newUrl.save();

    // ✅ Cache in Redis
    await redis.set(longUrl, shortId);

    return res.status(201).json({
      message: "URL created successfully",
      shortUrl: `${process.env.BASE_URL}/${shortId}`,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};


export const getUrl = async (req, res) => {
  try {
    const shortId = req.params.shortId;

    const cachedLongUrl = await redis.get(shortId);
    console.log("ca",cachedLongUrl)
    if (cachedLongUrl) return res.redirect(cachedLongUrl);

    const urlDoc = await Url.findOne({ shortUrl: shortId });
    if (!urlDoc) return res.status(404).json({ error: 'URL not found' });

    await redis.set(shortId, urlDoc.longUrl, 'EX', 60 * 60 * 24); // cache 24h
    res.redirect(urlDoc.longUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export const getUserUrls = async (req, res) => {
  try {
    const userId = req.user._id;

    const urls = await Url.find({ user: userId })
      .sort({ createdAt: -1 })
      .select('longUrl shortUrl createdAt');

    const formattedUrls = urls.map(url => ({
      longUrl: url.longUrl,
      shortUrl: `${process.env.BASE_URL}/${url.shortUrl}`,
      createdAt: url.createdAt
    }));

    return res.status(200).json({
      message: "URLs retrieved successfully",
      urls: formattedUrls,
      count: formattedUrls.length
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}