const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
require('dotenv').config();

const sequelize = require('./config/database');

const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const employeeRoutes = require('./routes/employee.routes');
const branchRoutes = require('./routes/branch.routes');
const departmentRoutes = require('./routes/department.routes');
const assetCategoryRoutes = require('./routes/assetCategory.routes');
const vendorRoutes = require('./routes/vendor.routes');
const assetRoutes = require('./routes/asset.routes');
const assetTransactionRoutes = require('./routes/assetTransaction.routes');


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname,'public')));

app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}));

app.use(flash());



app.use((req, res, next) => {

    res.locals.success = req.flash('success');

    res.locals.error = req.flash('error');

    res.locals.admin = req.session.admin;

    next();
});

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.use(authRoutes);
app.use(dashboardRoutes);
app.use(employeeRoutes);
app.use(branchRoutes);
app.use(departmentRoutes);
app.use(assetCategoryRoutes);
app.use(vendorRoutes);

app.use('/', assetTransactionRoutes);
app.use(assetRoutes);



/*app.get('/',(req,res)=>{

    res.send('Asset Management System');

});*/

sequelize.authenticate()
.then(()=>{

    console.log('PostgreSQL Connected');

})
.catch(err=>{

    console.log(err);

});

const PORT=process.env.PORT ||3000;

app.listen(PORT,()=>{

    console.log(`Server Running http://localhost:${PORT}`);

});