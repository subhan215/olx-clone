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
        case 'Cars':
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
const getChatMessages = async (req, res) => {
    const { chatId } = req.params;
    console.log(chatId)
    try {
        // Check if the chatId is valid
        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: 'Chat ID is required',
            });
        }

        // Find chat and populate messages.sender
        const chat = await Chat.findById(chatId).populate('messages.sender');

        // Check if chat exists
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found',
            });
        }

        // Check if there are messages
        if (chat.messages.length === 0) {
            return res.status(200).json({
                success: true,
                messages: [],
                message: 'No messages yet. Start the conversation!',
            });
        }

        res.status(200).json({
            success: true,
            messages: chat.messages,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Cannot retrieve messages',
        });
    }
};
const sendMessage = async (req, res) => {
    const { chatId } = req.params;
    const { sender, content } = req.body;
  
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
  
      await chat.save();
  
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
  
module.exports = { createChat,allChats,getChatMessages,sendMessage };
