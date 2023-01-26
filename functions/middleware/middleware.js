class Middleware {
  
    authChecker(req, res, next) {
  
      // console.log(req.headers);
  
      if (
          process.env.CLIENT_URL_ALLOWED !== req.headers.origin &&
          process.env.CLIENT_URL_ALLOWED_SECOND !== req.headers.origin &&
          process.env.BACKEND_ACCESS_TOKEN !== req.query.access_token  
      )
        return res.status(404).json({ err: "Bad Access" });
  
      next();
    }
  }
  
  module.exports = new Middleware();
  