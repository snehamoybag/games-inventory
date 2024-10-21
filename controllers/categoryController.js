exports.get = (req, res) => {
  res.send(`Category ID: ${req.params.id}`);
};
