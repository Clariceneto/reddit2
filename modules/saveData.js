const fs = require('fs');
const { Parser } = require('json2csv');
const xlsx = require('json-as-xlsx');
const pdf = require('pdfkit');
const axios = require('axios');

function saveToJson(data, outputPath) {
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
}

async function saveToCsv(data, outputPath) {
  const parser = new Parser();
  const csv = parser.parse(data);
  fs.writeFileSync(outputPath, csv);
}

async function saveToExcel(data, outputPath) {
  const settings = {
    fileName: outputPath.split('.').slice(0, -1).join('.'),
    extraLength: 3,
    writeOptions: {}
  };

  xlsx(data, settings);
}

async function saveToPdf(data, outputPath) {
  const doc = new pdf();
  doc.pipe(fs.createWriteStream(outputPath));

  data.forEach(item => {
    doc.text(JSON.stringify(item, null, 2));
    doc.moveDown();
  });

  doc.end();
}

async function postToWebhook(url, data) {
  await axios.post(url, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

module.exports = {
  saveToJson,
  saveToCsv,
  saveToExcel,
  saveToPdf,
  postToWebhook
};
