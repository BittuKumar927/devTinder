const adminAuth = (req, res, next) => {
    console.log('Admin auth is getting checked!');
    const token = "xyz"; 
    const isAdminAuthentorized = token === "xyz";
    if(!isAdminAuthentorized) {
        return res.status(401).send('Forbidden: Admin access required'); 
    } else {
        next();
    }
}
const userAuth = (req, res, next) => {
    console.log('User auth is getting checked!');
    const token = "xyz"; 
    const isUserAuthentorized = token === "xyz";
    if(!isUserAuthentorized) {
        return res.status(401).send('Forbidden: Admin access required'); 
    } else {
        next();
    }
}

module.exports = {
    adminAuth,
    userAuth
};