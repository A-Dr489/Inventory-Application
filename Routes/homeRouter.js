const { Router } = require("express");
const homeRouter = Router();
const homeController = require('../Controller/homeController.js');

homeRouter.get('/', homeController.indexController);
homeRouter.get('/search', homeController.searchController);
homeRouter.post('/catagory', homeController.catagoryController);
homeRouter.get('/new', homeController.createNewItem);
homeRouter.post('/new', homeController.createItem);
homeRouter.post('/:id/delete', homeController.deleteItem);
homeRouter.get('/:id/update', homeController.sendUpdateItem);
homeRouter.post('/:id/update', homeController.implementUpdate);

module.exports = homeRouter;