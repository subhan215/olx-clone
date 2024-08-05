const Chat = require("../models/Chat.js");
const Mobile = require("../models/Ad Models/Mobile.js");
const User = require("../models/User.js");
const Vehicle = require("../models/Ad Models/Vehicle.js");
const Job = require("../models/Ad Models/Job.js");
const Service = require("../models/Ad Models/Service.js");

const allChats = async (req, res) => {
    const { user } = req.body;
    console.log(user)
    try {
        const chats = await Chat.find({
            $or: [{ seller: user }, { buyer: user }]
        })
        .populate('seller', 'fullName email profileImageURL')
        .populate('buyer', 'fullName email profileImageURL')
        // .populate({
        //     path: 'ad.adId',
        //     select: 'adTitle brand price ownerName',
        //     model: (doc) => {
        //         switch (doc.ad.adType) {
        //             case 'Mobile Phones':
        //                 return mongoose.model('mobile');
        //             // case 'vehicle':
        //             //     return 'vehicle';
        //             // case 'job':
        //             //     return 'job';
        //             // case 'service':
        //             //     return 'service';
        //             default:
        //                 throw new Error('Unknown ad type');
        //         }
        //     }
        // });

        return res.status(200).json({
            success: true,
            chat: chats,
            message: 'Chats retrieved successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: 'Cannot retrieve your chats'
        });
    }
};


const createChat = async (req, res) => {
    const { adId, adCategory, user } = req.body;
    if (!adId || !user) {
        return res.status(400).json({
            success: false,
            message: 'Invalid request',
        });
    }

    let adModel;
    switch (adCategory) {
        case 'Mobile Phones':
            adModel = Mobile;
            break;
        case 'vehicle':
            adModel = Vehicle;
            break;
        case 'job':
            adModel = Job;
            break;
        case 'service':
            adModel = Service;
            break;
        default:
            return res.status(400).json({
                success: false,
                message: 'Invalid ad category',
            });
    }

    try {
        const ad = await adModel.findById(adId);
        if (!ad) {
            return res.status(400).json({
                success: false,
                message: 'Cannot fetch data of ad from DB',
            });
        }

        const sellerId = ad.createdBy;
        if (!sellerId) {
            return res.status(400).json({
                success: false,
                message: 'Cannot fetch id of user from ad or ad does not have id due to some reason',
            });
        }

        const seller = await User.findById(sellerId);
        if (!seller) {
            return res.status(400).json({
                success: false,
                message: 'Cannot fetch data of user from DB',
            });
        }
        //pehlay dekh already bani hoi tu nhi chat
        const existingChat = await Chat.findOne({
            'ad.adId': adId,
            'ad.adType': adCategory,
            seller: seller._id,
            buyer: user,
        });

        if (existingChat) {
            return res.status(200).json({
                success: true,
                chat: existingChat,
                message: "Chat already exists",
            });
        }
        //warna chat bana day
        const newChat = await Chat.create({
            ad: {
                adId: ad._id,
                adType: adCategory,
            },
            seller: seller._id,
            buyer: user,
            adTitle: ad.adTitle, // Ensure this field exists in your ad model
            adPrice: ad.price,  // Ensure this field exists in your ad model
        });

        return res.status(200).json({
            success: true,
            chat: newChat,
            message: "Chat created successfully!",
        });
    } catch (error) {
        console.error("Error during creating chat:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

module.exports = { createChat,allChats };
