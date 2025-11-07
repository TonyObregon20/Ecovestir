const ContactMessage = require('../models/ContactMessage');

// Create a new contact message
exports.createContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, reason, message } = req.body;

    // Validate required fields according to frontend form
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ message: 'Name, email, phone, subject and message are required' });
    }

    const contact = new ContactMessage({
      name,
      email,
      phone,
      subject,
      reason,
      message,
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers['user-agent'] || ''
    });

    await contact.save();

    return res.status(201).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

// (Optional) list messages - useful for admin views
exports.listContacts = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
};
