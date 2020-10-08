const { Client } = require('pg')

const connectionString = "postgressql://postgres:password@localhost:5432/xencovTestRecords";
const client = new Client({
    connectionString:connectionString
})

client.connect()

client.query('SELECT * from sales_records', (err,res)=>{
console.log(err,res)
client.end()
})