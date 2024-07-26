import express from "express"
import axios from "axios";
import bodyParser from "body-parser"
import cors from "cors"
const app = express();
app.use(cors())
const port = 3000;

// Middleware
app.use(bodyParser.json());

let transactions = [];

app.get('/transactions', async(req, res) => {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    transactions = response.data;
    const { search = '', page = 1, perPage = 10 ,month} = req.query;
    // const { month } = req.query;
    
      const monthIndex = new Date(`${month} 1, 2020`).getMonth();
      transactions = transactions.filter(transaction => new Date(transaction.dateOfSale).getMonth() === monthIndex);
      const filteredTransactions = transactions.filter(t =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase()) ||
          t.price.toString().includes(search)
      );
      const start = (page - 1) * perPage;
      const paginatedTransactions = filteredTransactions.slice(start, start + perPage);
      res.json(paginatedTransactions);
    
});

// Statistics API
app.get('/statistics',async (req, res) => {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    transactions = response.data;
    const { month } = req.query;
    const monthIndex = new Date(`${month} 1, 2020`).getMonth();
    transactions = transactions.filter(transaction => new Date(transaction.dateOfSale).getMonth() === monthIndex);
    const totalSales = transactions.reduce((sum, t) => sum + t.price, 0);
    const soldItems = transactions.filter(t => t.sold).length;
    const notSoldItems = transactions.length - soldItems;

     res.json({ totalSales, soldItems, notSoldItems });
});

// Bar Chart API
app.get('/bar-chart', async(req, res) => {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    transactions = response.data;
    const { month } = req.query;
    const monthIndex = new Date(`${month} 1, 2020`).getMonth();
    transactions = transactions.filter(transaction => new Date(transaction.dateOfSale).getMonth() === monthIndex);
    const priceRanges = {
        '0-100': 0,
        '101-200': 0,
        '201-300': 0,
        '301-400': 0,
        '401-500': 0,
        '501-600': 0,
        '601-700': 0,
        '701-800': 0,
        '801-900': 0,
        '901+': 0,
    };

    transactions.forEach(t => {
        if (t.price <= 100) priceRanges['0-100']++;
        else if (t.price <= 200) priceRanges['101-200']++;
        else if (t.price <= 300) priceRanges['201-300']++;
        else if (t.price <= 400) priceRanges['301-400']++;
        else if (t.price <= 500) priceRanges['401-500']++;
        else if (t.price <= 600) priceRanges['501-600']++;
        else if (t.price <= 700) priceRanges['601-700']++;
        else if (t.price <= 800) priceRanges['701-800']++;
        else if (t.price <= 900) priceRanges['801-900']++;
        else priceRanges['901+']++;
    });

    res.json(priceRanges);
    });

    // Pie Chart API

// Combined API
app.get('/combined', async(req, res) => {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        transactions = response.data;
  const { month } = req.query;

  const transactions = transactions(month);
  const totalSales = transactions.reduce((sum, t) => sum + t.price, 0);
  const soldItems = transactions.filter(t => t.sold).length;
  const notSoldItems = transactions.length - soldItems;

  const priceRanges = {
    '0-100': 0,
    '101-200': 0,
    '201-300': 0,
    '301-400': 0,
    '401-500': 0,
    '501-600': 0,
    '601-700': 0,
    '701-800': 0,
    '801-900': 0,
    '901+': 0,
  };

  transactions.forEach(t => {
    if (t.price <= 100) priceRanges['0-100']++;
    else if (t.price <= 200) priceRanges['101-200']++;
    else if (t.price <= 300) priceRanges['201-300']++;
    else if (t.price <= 400) priceRanges['301-400']++;
    else if (t.price <= 500) priceRanges['401-500']++;
    else if (t.price <= 600) priceRanges['501-600']++;
    else if (t.price <= 700) priceRanges['601-700']++;
    else if (t.price <= 800) priceRanges['701-800']++;
    else if (t.price <= 900) priceRanges['801-900']++;
    else priceRanges['901+']++;
  });

  const categoryCounts = transactions.reduce((counts, t) => {
    counts[t.category] = (counts[t.category] || 0) + 1;
    return counts;
  }, {});

  res.json({
    transactions: transactions,
    statistics: { totalSales, soldItems, notSoldItems },
    barChart: priceRanges,
    pieChart: categoryCounts,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
