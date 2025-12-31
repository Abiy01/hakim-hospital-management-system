import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Message } from "../models/messageSchema.js";

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, message } = req.body;
  if (!firstName || !lastName || !email || !phone || !message) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  await Message.create({ firstName, lastName, email, phone, message });
  res.status(200).json({
    success: true,
    message: "Message Sent!",
  });
});

export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    messages,
  });
});

// Get single message by ID (Admin only)
export const getMessageById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const message = await Message.findById(id);
  if (!message) {
    return next(new ErrorHandler("Message Not Found!", 404));
  }
  res.status(200).json({
    success: true,
    message,
  });
});

// Update message (Admin only)
export const updateMessage = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let message = await Message.findById(id);
  if (!message) {
    return next(new ErrorHandler("Message Not Found!", 404));
  }
  
  message = await Message.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  
  res.status(200).json({
    success: true,
    message: "Message Updated Successfully!",
    message,
  });
});

// Delete message (Admin only)
export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const message = await Message.findById(id);
  if (!message) {
    return next(new ErrorHandler("Message Not Found!", 404));
  }
  await message.deleteOne();
  res.status(200).json({
    success: true,
    message: "Message Deleted Successfully!",
  });
});