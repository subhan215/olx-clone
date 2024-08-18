const Mobile = require("../models/Ad Models/Mobile.js");
const User = require("../models/User.js");
const Vehicle = require("../models/Ad Models/Vehicle.js");
const Job = require("../models/Ad Models/Job.js");
const Service = require("../models/Ad Models/Service.js");
const {Chat }= require("../models/chat.js");
const notificationMsg = require("../models/NotificationsMsg.js");

const allChats = async (req, res) => {
    const { user } = req.body;
    console.log(user)
    try {
        const chats = await Chat.find({
            $or: [{ seller: user }, { buyer: user }]
        })
            .populate('seller', 'fullName email profileImageURL')
            .populate('buyer', 'fullName email profileImageURL')


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
    const { adId, user , createdBy } = req.body;
    if (!adId || !user) {
        return res.status(400).json({
            success: false,
            message: 'Invalid request',
        });
    }
    if(createdBy == user) {
        return res.status(400).json({
            success: false , 
            message: "You can't created an ad with yourself!"
        })
    }
    let mobileAd = await Mobile.findById(adId)
    let vehicleAd = await Vehicle.findById(adId)
    let serviceAd = await Service.findById(adId)
    let jobAd = await Job.findById(adId)
    if (jobAd || mobileAd || vehicleAd || serviceAd) {
        try {
            ad = jobAd ? jobAd: mobileAd? mobileAd : vehicleAd  ? vehicleAd: serviceAd

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
            let adCategory = (jobAd  ? "job" : mobileAd ? "Mobile Phones" : serviceAd ? "service" : "Vehicle" )
            //pehlay dekh already bani hoi tu nhi chat
            const existingChat = await Chat.findOne({
                'ad.adId': adId,
                'ad.adType':adCategory ,
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
    }
    return res.status(400).json({
        success: false , 
        message: "Can not fetch ad from database!"
    })
    
};
const getChatMessages = async (req, res) => {
    const { chatId } = req.params;
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
    console.log(chatId, page, limit);
    
    try {
        // Check if the chatId is valid
        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: 'Chat ID is required',
            });
        }

        // Find chat and populate messages.sender
        let chat = null;
        if (chatId !== "undefined") {
            chat = await Chat.findById(chatId).populate('messages.sender');
        }

        // Check if chat exists
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found',
            });
        }

        // Get paginated messages
        const totalMessages = chat.messages.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedMessages = chat.messages.slice(startIndex, endIndex);

        // Delete notifications
        await notificationMsg.deleteMany({ chatId: chat._id, recipientId: req?.body?.userId });

        return res.status(200).json({
            success: true,
            messages: paginatedMessages,
            chat,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalMessages / limit),
                totalMessages: totalMessages
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot retrieve messages',
        });
    }
};

const sendMessage = async (req, res) => {
    const { chatId } = req.params;
    const { sender, content , name } = req.body;

    try {
        if (!chatId || !sender || !content) {
            return res.status(400).json({
                success: false,
                message: 'Chat ID, sender ID, and message content are required',
            });
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found',
            });
        }

        const newMessage = {
            sender,
            content,
            timestamp: new Date(),
        };
        chat.messages.push(newMessage);
        let recipientId = (chat.seller == sender ? chat.buyer : chat.seller) || (chat.seller._id == sender ? chat.buyer._id : chat.seller._id)
        await chat.save()
        await notificationMsg.create({
            senderId: sender , 
            recipientId , 
            chatId , 
            senderName: name

        })

        //await chat.populate('messages.sender').execPopulate();

        res.status(200).json({
            success: true,
            messages: chat.messages,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Cannot send message',
        });
    }
};
const updateSeenStatus = async (req , res) => {
    console.log("this function hitted")
       const {chatId} = req.params
       if(chatId) {
            const {userId} = req.body ; 
            if(userId) {
                 let chat = await Chat.findById(chatId)
                for(let i = 0 ; i < chat.messages.length ; i++) {
                    if(chat.messages[i].sender != userId) {
                        chat.messages[i].isSeen = true
                    } 
                }
                let updatedChat = await Chat.findByIdAndUpdate(chatId , {
                    ...chat
                })
                return res.status(200).json({
                    messages: updatedChat.messages ,
                    success: true , 
                    message: "Seen status updated successfully"
                })
            }
            return res.status(400).json({
                success: false,  
                message: "User Id didn't found!"
            })
       }
       return res.status(400).json({
            success: false , 
            messsage: "Chat Id didnt found!"
       })
}
const getNotifications =  async (req , res) => {
     if(req.params.recipientId != "undefined") {
        const notifications = await notificationMsg.find({recipientId: req.params.recipientId})
        return res.status(200).json({
            message: "Notifications fetched successfully!" , 
            notifications , 
            success: true
        })
     }
     return res.status(400).json({
        success: false , 
        message: "Recipient id didn't found"
     })
}
module.exports = { createChat, allChats, getChatMessages, sendMessage  , updateSeenStatus , getNotifications};
