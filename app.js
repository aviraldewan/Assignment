const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/invoice-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create an Invoice schema
const invoiceSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  date: Date,
});

// Create an Invoice model
const Invoice = mongoose.model('Invoice', invoiceSchema);

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/api/invoices', async (req, res) => {
  try {
    // Retrieve all invoices from the database
    const invoices = await Invoice.find();

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/invoices', async (req, res) => {
  try {
    // Create a new invoice based on the request body
    const newInvoice = req.body;

    // Save the new invoice to the database
    const savedInvoice = await Invoice.create(newInvoice);

    res.json(savedInvoice);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/invoices/:id', async (req, res) => {
  const invoiceId = req.params.id;

  try {
    // Retrieve the invoice with the specified ID from the database
    const invoice = await Invoice.findById(invoiceId);

    if (invoice) {
      res.json(invoice);
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/api/invoices/:id', async (req, res) => {
  const invoiceId = req.params.id;
  const updatedInvoiceData = req.body;

  try {
    // Update the invoice with the specified ID in the database
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      updatedInvoiceData,
      { new: true }
    );

    if (updatedInvoice) {
      res.json(updatedInvoice);
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/api/invoices/:id', async (req, res) => {
  const invoiceId = req.params.id;

  try {
    // Delete the invoice with the specified ID from the database
    await Invoice.findByIdAndRemove(invoiceId);

    res.json({ message: `Invoice ${invoiceId} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
