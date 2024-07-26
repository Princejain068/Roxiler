const initializer=async(transactions)=>{

    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    transactions = response.data;
}

export default initializer

