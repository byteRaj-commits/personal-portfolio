import Contact from "../models/Contact.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Simple email regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Submit Contact Form (Public) ────────────────────
export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message, type } = req.body;

  if (!name || !email || !subject || !message) {
    throw new ApiError(400, "Name, email, subject, and message are required");
  }

  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email address");
  }

  // Basic rate limiting: max 3 messages per IP per hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentCount = await Contact.countDocuments({
    ipAddress: req.ip,
    createdAt: { $gte: oneHourAgo },
  });

  if (recentCount >= 3) {
    throw new ApiError(429, "Too many messages. Please try again later.");
  }

  const contact = await Contact.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: subject.trim(),
    message: message.trim(),
    type: type || "general",
    ipAddress: req.ip,
  });

  res.status(201).json(
    new ApiResponse(201, { id: contact._id }, "Message sent successfully! I'll get back to you soon.")
  );
});

// ─── Get All Messages (Admin, Paginated) ─────────────
export const getAllMessages = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, isRead, type, search } = req.query;

  const filter = {};
  if (isRead !== undefined) filter.isRead = isRead === "true";
  if (type) filter.type = type;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [messages, total, unreadCount] = await Promise.all([
    Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Contact.countDocuments(filter),
    Contact.countDocuments({ isRead: false }),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      messages,
      totalMessages: total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      unreadCount,
    }, "Messages fetched successfully")
  );
});

// ─── Get Single Message (Admin) ───────────────────────
export const getMessageById = asyncHandler(async (req, res) => {
  const message = await Contact.findById(req.params.id);
  if (!message) throw new ApiError(404, "Message not found");

  // Auto mark as read when admin views it
  if (!message.isRead) {
    message.isRead = true;
    await message.save();
  }

  res.status(200).json(new ApiResponse(200, message, "Message fetched successfully"));
});

// ─── Mark as Read / Replied (Admin) ──────────────────
export const updateMessageStatus = asyncHandler(async (req, res) => {
  const { isRead, isReplied } = req.body;

  const update = {};
  if (isRead !== undefined) update.isRead = isRead;
  if (isReplied !== undefined) update.isReplied = isReplied;

  const message = await Contact.findByIdAndUpdate(
    req.params.id,
    { $set: update },
    { new: true }
  );

  if (!message) throw new ApiError(404, "Message not found");
  res.status(200).json(new ApiResponse(200, message, "Message status updated"));
});

// ─── Delete Message (Admin) ───────────────────────────
export const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Contact.findByIdAndDelete(req.params.id);
  if (!message) throw new ApiError(404, "Message not found");
  res.status(200).json(new ApiResponse(200, {}, "Message deleted successfully"));
});

// ─── Get Stats Summary (Admin) ────────────────────────
export const getContactStats = asyncHandler(async (req, res) => {
  const [total, unread, replied, byType] = await Promise.all([
    Contact.countDocuments(),
    Contact.countDocuments({ isRead: false }),
    Contact.countDocuments({ isReplied: true }),
    Contact.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]),
  ]);

  res.status(200).json(
    new ApiResponse(200, { total, unread, replied, byType }, "Contact stats fetched")
  );
});
