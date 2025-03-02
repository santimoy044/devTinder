const adminAuth = ("/admin", (req, res, next) => {
    console.log("Admin auth is getting checked");
    const token = "xyz";

    const isAdminAuthorized = token === "xyz";  // Fixed typo
    if (!isAdminAuthorized) {
        return res.status(401).send("Unauthorized Request");
    } 
    next();
});
const userAuth = ("/user", (req, res, next) => {
    console.log("User auth is getting checked");
    const token = "xyz";

    const isUserAuthorized = token === "xyz";  // Fixed typo
    if (!isUserAuthorized) {
        return res.status(401).send("Unauthorized Request");
    } 
    next();
});



module.exports = {
    adminAuth,
    userAuth,
}