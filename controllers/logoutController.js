exports.adminPOST = (req, res) => {
  res.clearCookie("isAdmin");
  res.redirect("/success/logout");
};
