const fs = require('fs').promises;
const path = require('path');

module.exports = async app => {
  // Setup notes variable
  let notes;
  try {
    const data = await fs.readFile('db/db.json', 'utf-8');
    notes = JSON.parse(data);
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit the process if an error occurs
  }

  // API ROUTES

  // Setup the /api/notes get route
  app.get('/api/notes', function (req, res) {
    res.json(notes);
  });

  // Setup the /api/notes post route
  app.post('/api/notes', async function (req, res) {
    // Receives a new note, adds it to db.json, then returns the new note
    const newNote = req.body;
    notes.push(newNote);
    await updateDb();
    return res.status(201).json({ message: 'Note added successfully' });
  });

  // Retrieves a note with specific id
  app.get('/api/notes/:id', function (req, res) {
    res.json(notes[req.params.id]);
  });

  // Deletes a note with specific id
  app.delete('/api/notes/:id', async function (req, res) {
    notes.splice(req.params.id, 1);
    await updateDb();
    return res.json({ message: 'Note deleted successfully' });
  });

  // View Routes

  // Display notes.html when /notes is accessed
  app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/notes.html'));
  });

  // This displays the index.html when all other routes are accessed
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  // This updates the JSON file whenever a note is added or deleted
  async function updateDb() {
    try {
      await fs.writeFile('db/db.json', JSON.stringify(notes, null, 2));
      console.log('Database updated successfully');
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
};