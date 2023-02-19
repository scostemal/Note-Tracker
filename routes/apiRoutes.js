const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const notesFile = path.join(__dirname, '../db/db.json');

router.get('/notes', (req, res) => {
    fs.readFile(notesFile, 'utf8', (err, data) => {
        if(err) {
            console.log(err);
            res.status(500).json({ error: 'Error reading notes data' });
        }
        const notes = JSON.parse(data);
        res.json(notes);
    });
});

router.post('/notes', (req, res) => {
    const newNote = req.body;
    fs.readFile(notesFile, 'utf8', (err, data) => {
        if(err) {
            console.log(err);
            res.status(500).json({ error: 'Error reading notes data'});
            return;
        }
        const notes = JSON.parse(data);

        newNote.id = notes.length + 1;
        notes.push(newNote);

        fs.writeFile(notesFile, JSON.stringify(notes), (err) => {
            if(err) {
                console.log(err);
                res.status(500).json({ error: 'Error writing notes data' });
                return;
            }
            res.json(newNote);
        });
    });
});

router.delete('/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    fs.readFile(notesFile, 'utf8', (err, data) => {
        if(err) {
            console.log(err);
            res.status(500).json({ error: 'Error reading notes data' });
            return;
        }
        const notes = JSON.parse(data);
        const index = notes.findIndex((note) => note.id === id);
        if(index !== -1) {
            notes.splice(index, 1);
            fs.writeFile(notesFile, JSON.stringify(notes), (err) => {
                if(err) {
                    console.log(err);
                    res.status(500).json({ error: 'Error writing notes data' });
                    return;
                }
                res.sendStatus(204);
            });
        }else {
            res.status(404).json({ error: `Note with ID ${id} not found` });
        }
    });
});

module.exports = router;