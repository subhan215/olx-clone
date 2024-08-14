const { Router } = require("express");
const { createOrder, updateStatus, putRating , getSpecificTransaction , getTransactions } = require("../controllers/transaction.controllers");
const router = Router();

router.post('/create', createOrder);
router.get("/:type/:userId" , getTransactions)
router.put('/getSpecificTransaction' , getSpecificTransaction)
router.put('/:id/status', updateStatus);
router.put('/:transactionId/rate', putRating);
const transactionRoute = router;
module.exports = transactionRoute;
