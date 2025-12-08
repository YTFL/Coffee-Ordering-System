const Feedback = require('../models/Feedback');

exports.submitFeedback = async (req, res) => {
    try {
        const { coffee_id, rating, comment } = req.body;
        await Feedback.create(req.user.id, coffee_id, rating, comment);
        res.status(201).json({ success: true, message: 'Feedback submitted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getFeedbackForCoffee = async (req, res) => {
    try {
        const feedback = await Feedback.findByCoffeeId(req.params.id);
        res.json({ success: true, data: feedback });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
