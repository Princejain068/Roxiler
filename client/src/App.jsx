import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [barChartData, setBarChartData] = useState({});
  const [month, setMonth] = useState("1");
  const [search, setSearch] = useState(' ');
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, [month,page,perPage,search]);
  const fetchData = async () => {
    const monthIndex = new Date(`${month} 1, 2020`).getMonth() + 1;
    console.log(monthIndex);
    const barChartResponse = await axios.get(`http://localhost:3000/bar-chart`, {
      params: { month: monthIndex },
    });

    const data = {
      labels: Object.keys(barChartResponse.data),
      datasets: [
        {
          label: 'Number of items',
          data: Object.values(barChartResponse.data),
          backgroundColor: 'rgba(75, 192, 192, 0.4)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
    setBarChartData(data);
    const dataa = await axios.get("http://localhost:3000/transactions",{
      params: {month:monthIndex,page,perPage,search}
    })
    setTransactions(dataa.data)

    const statisticsResponse = await axios.get(`http://localhost:3000/statistics`, {
      params: { month: monthIndex },
    })
    setStatistics(statisticsResponse.data);
  };

  return (
    <div>
      <h1>Transactions</h1>
      <div>
        <label>Month: </label>
        <select value={month} onChange={(e) => {
          setMonth(e.target.value)
          // fetchData()
        }}>
          <option value="">Select</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
      </div>
      <div>
        {/* <button onClick={hadle()}>vjrnfj</button> */}
        <label>Search: </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          

            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.title}</td>
                <td>{transaction.description}</td>
                <td>{transaction.price}</td>
                <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                <td>{transaction.category}</td>
                <td>{transaction.sold ? 'Yes' : 'No'}</td>
                <td><img src={transaction.image} style={{height:"50%" , width:"50%",marginLeft:"50px" }} alt="" /></td>
              </tr>
                ) 
          )}
        </tbody>
      </table>
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Previous
      </button>
      <button onClick={() => setPage(page + 1)} disabled={transactions.length < perPage}>
        Next
      </button>
      <h2>Statistics</h2>
      <div>
        <p>Total Sales: {statistics.totalSales}</p>
        <p>Sold Items: {statistics.soldItems}</p>
        <p>Not Sold Items: {statistics.notSoldItems}</p>
      </div>
      <h2 >Bar Chart</h2>
      {/* <button onClick={showbar}>Show</button> */}
      <Bar data={barChartData} style={{height:"50%",width:"50%"}}></Bar>
     
    </div>
  );
};

export default App;
