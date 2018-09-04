module.exports = function(req, res, next) {
  res.sentHttpError = function(error) {
    res.status(error.status);
    if (res.req.headers["x-request-width"] == "XMLHttpRequest") {
      res.json(error);
    } else {
      res.render("error", { error: error });
    }
  };
  next();
};
