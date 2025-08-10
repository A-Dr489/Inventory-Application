const db = require('../Database/queries');
const { body, validationResult} = require("express-validator");
const url = require('url');

const emptyMsg = "This field should not be empty";
const lengthErr = "should be between 1 to 30 length";
const validateCreateItem = [
    body("name").trim()
        .notEmpty().withMessage(emptyMsg)
        .isLength({min: 1, max: 30}).withMessage(lengthErr),
    body("catagory").trim()
        .notEmpty().withMessage(emptyMsg),
    body("quantity").trim()
        .isNumeric().withMessage("Must be a number")
        .notEmpty().withMessage(emptyMsg),
    body("des").trim()
        .notEmpty().withMessage(emptyMsg),
    body("notes").optional()
]

exports.indexController = async (req, res) => {
    const items = await db.getAllItems();
    const cat = await db.getAllCatagories();
    res.render("index", {items: items, cat: cat});
}

exports.searchController = async (req, res) => {
    const { searchItem } = req.query;
    const result = await db.searchItems(searchItem);
    const cat = await db.getAllCatagories();
    res.render("index", {items: result, cat: cat});
}

exports.catagoryController = async (req, res) => {
    const parsedURL = new URL(req.get('Referer'));
    const cat = await db.getAllCatagories();
    if(parsedURL.pathname == '/search') {
        const bigResult = await db.getSearchAndCat(parsedURL.searchParams.get("searchItem"), req.body.catagory);
        res.render('index', {items: bigResult, cat: cat});
    } else {
        const result = await db.getCertainCatagory(req.body.catagory);
        res.render('index', {items: result, cat: cat});
    }
}

exports.createNewItem = (req, res) => {
    res.render('additem', {error: []});
}

exports.createItem = [validateCreateItem, async (req, res) => {
    const vError = validationResult(req);
    const errors = vError.array()
    if(!vError.isEmpty()) {
        return res.status(400).render('additem', {error: errors});
    }
    const {name, catagory, des, quantity, notes} = req.body;
    const result = await db.addItem(name, catagory, quantity, des, notes);
    if(result) {
        res.redirect('/');
    } else {
        errors.push({path: "name", msg: "This name already exists"});
        res.render('additem', {error: errors});
    }
}];

exports.deleteItem = async (req, res) => {
    db.deleteWithId(req.params.id);
    res.redirect('/');
}

exports.sendUpdateItem = async (req, res) => {
    const data = await db.getWithId(req.params.id);
    res.render('update', {data: data[0], error: []});
}

exports.implementUpdate = [validateCreateItem, 
    async (req, res) => {
        const vError = validationResult(req);
        const errors = vError.array()
         if(!vError.isEmpty()) {
            const data = await db.getWithId(req.params.id);
            return res.status(400).render('update', {data: data[0], error: errors});
        }
        const {name, catagory, des, quantity, notes} = req.body;
        await db.updateItem(req.params.id, name, catagory, quantity, des, notes);
        res.redirect('/');
    }
]