const express = require('express');
const router = express.Router();
const multer = require('multer');

const { compareCsvWithApi, compareApplicationWithEFile } = require('../Controller/comparison');
const { generateJwt } = require('../Controller/generateJwt');

const upload = multer({ storage: multer.memoryStorage() }); // You can also use diskStorage if you want to save to disk


router.post('/compare/csv-json', upload.single('csvFile'), compareCsvWithApi);
router.post('/api/generate-jwt',generateJwt );
router.post('/compare/appjson-efilejson',compareApplicationWithEFile);


module.exports = router;
