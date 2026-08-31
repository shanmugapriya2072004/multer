const Document = require('../models/Document');

exports.uploadDocument = async (req, res) => {
  try {
    console.log("📁 FILE:", req.file);
    console.log("👤 USER:", req.user);
    console.log("📝 BODY:", req.body);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload a file"
      });
    }

    const newDoc = await Document.create({
      userId: req.user.id,
      title: req.body.title,
      category: req.body.category,
      doctorName: req.body.doctorName,
      fileUrl: req.file.path,
      fileType: req.file.mimetype,
      tags: req.body.tags
        ? req.body.tags.split(",")
        : []
    });

    console.log("✅ DOCUMENT SAVED:", newDoc._id);

    res.status(201).json({
      success: true,
      data: newDoc
    });

  } catch (error) {
    console.error("❌ DOCUMENT UPLOAD ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getUserDocuments = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { userId: req.user.id };

    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const documents = await Document.find(query).sort({ issuedDate: -1 });
    res.status(200).json({ success: true, count: documents.length, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};