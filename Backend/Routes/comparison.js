const express = require('express');
const router = express.Router();
const multer = require('multer');

const { compareCsvWithApi, compareApplicationWithEFile } = require('../Controller/comparison');
const { generateJwt } = require('../Controller/generateJwt');

const upload = multer({ storage: multer.memoryStorage() }); 


router.post('/compare/csv-json', upload.single('csvFile'), compareCsvWithApi);
router.post('/api/generate-jwt',generateJwt );
router.post('/compare/appjson-efilejson',compareApplicationWithEFile);


module.exports = router;
