const Job = require("../models/Ad Models/Job");
const Mobile = require("../models/Ad Models/Mobile");
const Service = require("../models/Ad Models/Service");
const Vehicle = require("../models/Ad Models/Vehicle");
const transaction = require("../models/transaction");
const User = require("../models/User");
async function putRating(req, res) {
    const { transactionId } = req.params; // Assuming transactionId is passed as a URL parameter
    const { userId, rating } = req.body;

    // Check if required fields are present
    if (!userId || !rating || !transactionId) {
        return res.status(400).json({
            success: false,
            message: "User Id, transaction Id, or rating is missing",
        });
    }

    try {
        // Find and update the specific transaction
        const t = await transaction.findOneAndUpdate(
            {
                _id: transactionId,   // Update the transaction by ID
                buyer: userId,        // Ensure the user is the buyer
                status: "Completed",  // Ensure the transaction is completed
            },
            {
                rating,
            },
            {
                new: true,  // Return the updated document
            }
        );

        if (!t) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found or not completed",
            });
        }

        let seller = await User.findById(t.seller);
        seller.sellerRating.push({ rating, userId });

        await User.findByIdAndUpdate(t.seller , {
            sellerRating: seller.sellerRating
        })
        let user = await User.findById(t.seller)
        let totalRating= 0
        for(let i = 0 ; i < user.sellerRating.length ; i++) {
          totalRating += user.sellerRating[i].rating
        }
        totalRating /= user.sellerRating.length
        // Calculate the average rating correctly
        // Update all the ads with the new average rating
        const updateAds = async (Model, sellerId) => {
            const ads = await Model.find({ createdBy: sellerId });
            // Map through ads and update each one, ensuring all updates are awaited
            const updatePromises = ads.map(async (ad) =>
                await Model.findByIdAndUpdate(ad._id, { userRating: totalRating }, { new: true })
            );
            // Wait for all updates to complete
            return Promise.all(updatePromises);
        };

        await Promise.all([
            updateAds(Job, t.seller),
            updateAds(Vehicle, t.seller),
            updateAds(Service, t.seller),
            updateAds(Mobile, t.seller)
        ]);

        // Return the updated transaction
        return res.json({ success: true, t });
    } catch (error) {
        // Handle server errors
        return res.status(500).json({ success: false, error: error.message });
    }
}

async function updateStatus(req, res) {
    const transactionId = req.params.id;
    const { status } = req.body;

    if (!transactionId || !status) {
        return res.status(400).json({
            success: false,
            message: "Transaction ID or status is missing!",
        });
    }
    if(!req.body.userId) {
        return res.status(400).json({
            success: false,
            message: "userId is missing!",
        });
    }
    try {
        const t = await transaction.findByIdAndUpdate(transactionId, { status }, { new: true });
        if (!t) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found!",
            });
        }
        let adId = t.job ? t.job : t.service ? t.service : t.vehicle ? t.vehicle : t.mobile
        if(status.toLowerCase() === "completed") {
            const job = await Job.findById(adId)
            const service = await Service.findById(adId)
            const vehicle = await Vehicle.findById(adId)
            const mobile = await Mobile.findById(adId)
            if(job) {
            await Job.findByIdAndUpdate(job._id , {
                completed: true
            })
            }
            if(service) {
            await Service.findByIdAndUpdate(service._id , {
                completed: true
            })
            }
            if(vehicle) {
            await Vehicle.findByIdAndUpdate(vehicle._id , {
                completed: true
            } )
            }
            if(mobile) {
                await Mobile.findByIdAndUpdate(mobile._id , {
                    completed : true
                })
            }
        }
        return res.json({ success: true, transaction: t });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
async function createOrder(req, res) {
    try {
        const { adId, sellerId, buyerId , adTitle } = req.body
        console.log(req.body)
        if (!adId || !sellerId || !buyerId || !adTitle) {
            return res.status(400).json({
                success: false,
                message: "Some data is missing !"
            })
        }
        let job = await Job.findById(adId)
        let service = await Service.findById(adId)
        let vehicle = await Vehicle.findById(adId)
        let mobile = await Mobile.findById(adId)
        if (!job && !service && !vehicle && !mobile) {
            return res.status(400).json({
                message: "Wrong ad id",
                success: false
            })
        }
        let t = await transaction.create({
            seller: sellerId,
            buyer: buyerId,
            job,
            service,
            vehicle,
            mobile , 
            adTitle
        })
        return res.status(201).json({ success: true, t });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
async function getTransactions(req, res) {

    const { type, userId } = req.params;
    if (!userId, !type) {
        return res.status(400).json({
            success: false,
            message: "userId or type is missing!"
        })
    }
    let transactions;
    try {
        if (type === "selling") {
            transactions = await transaction.find({ seller: userId });
        } else if (type === "buying") {
            transactions = await transaction.find({ buyer: userId });
        }
        res.json({ success: true, transactions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}

async function getSpecificTransaction(req, res) {
    try {
        const { adId } = req.body
        if (!adId) {
            return res.status(400).json({
                success: false,
                message: "adId is missing !"
            })

        }
        let t = await transaction.findOne({
            $or: [
                { 'job': adId },
                { 'service': adId },
                { 'vehicle': adId },
                { 'mobile': adId }
            ]
        });
        if (!t) {
            return res.status(400).json({
                message: "Transaction didn't find!",
                success: false
            })
        }
        return res.status(200).json({
            success: true,
            t,
            message: "Transaction fetched successfully!"
        })
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
module.exports = {
    putRating,
    updateStatus,
    createOrder,
    getTransactions , 
    getSpecificTransaction,
}