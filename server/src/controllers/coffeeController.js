const Coffee = require('../models/Coffee');
const Feedback = require('../models/Feedback');

exports.getAllCoffees = async (req, res) => {
    try {
        // If admin is requesting, they might want to see unavailable too, but let's keep it simple
        // Public view only shows available. Admin controller might use different method or query param.
        // For now, public listing:
        const coffees = await Coffee.findAll();

        // Attach ratings if needed, or fetch separately.
        // Let's implement robust "Get Details" with ratings, list can be simple.
        res.json({ success: true, data: coffees });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getCoffeeById = async (req, res) => {
    try {
        const coffee = await Coffee.findById(req.params.id);
        if (!coffee) return res.status(404).json({ success: false, message: 'Coffee not found' });

        const stats = await Feedback.getAverageRating(coffee.id);

        res.json({ success: true, data: { ...coffee, rating: stats.average, reviewCount: stats.count } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.createCoffee = async (req, res) => {
    try {
        const { name, description, price, image_url, available } = req.body;
        const id = await Coffee.create(name, description, price, image_url, available);
        res.status(201).json({ success: true, message: 'Coffee created', id });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateCoffee = async (req, res) => {
    try {
        const { name, description, price, image_url, available } = req.body;
        await Coffee.update(req.params.id, name, description, price, image_url, available);
        res.json({ success: true, message: 'Coffee updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.deleteCoffee = async (req, res) => {
    try {
        await Coffee.delete(req.params.id);
        res.json({ success: true, message: 'Coffee deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
