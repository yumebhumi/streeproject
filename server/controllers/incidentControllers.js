const Incident = require('../models/incidentSchema');
const User = require('../models/userSchema');

const getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find({ status: 'published' }).sort({ date: -1, time: -1 });

    if (!incidents) {
      return res.status(404).json({ msg: 'No incidents found.' });
    }

    return res.status(200).json(incidents);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
};

const addNewIncident = async (req, res) => {
  const { location, description, category, date, time, name, isAnonymous } = req.body;

  try {
    if (!location || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
      return res.status(400).json({ msg: 'Latitude and longitude are required.' });
    }

    if (typeof location.coordinates[0] !== 'number' || typeof location.coordinates[1] !== 'number') {
      return res.status(400).json({ msg: 'Latitude and longitude are required and must be numbers.' });
    }

    if (!location.type || location.type !== 'Point') {
      return res.status(400).json({ msg: 'Location type must be "Point".' });
    }

    const user = req.userId; 
    console.log('Authenticated User ID:', user);

    const userId = await User.findById(user);
    if (!userId) {
      return res.status(401).json({ msg: 'Invalid user ID' });
    }

    const shouldHideIdentity = Boolean(isAnonymous);
    const safeName = shouldHideIdentity ? '' : (name || userId.userName || '').trim();

    const newIncident = new Incident({
      location: {
        type: location.type,
        coordinates: [location.coordinates[0], location.coordinates[1]],
      },
      description,
      category,
      date,
      time,
      user: userId,
      name: safeName,
      isAnonymous: shouldHideIdentity,
      status: 'submitted',
    });

    const incident = await newIncident.save();
    console.log('New Incident:', incident);

    return res.status(201).json({
      message: 'Incident submitted for review.',
      incident,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
};


module.exports = {
  getAllIncidents,
  addNewIncident,
};
