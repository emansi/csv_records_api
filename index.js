const express = require('express')
const app = express()
const formidable = require('formidable')
const path = require('path')
const uploadDir = ''
const fs = require("fs");
const Pool = require("pg").Pool;
const fastcsv = require("fast-csv");



app.post('/', (req, res) => {
    // console.log("debug mark 0")

    //DOWNLOAD CSV FILE FROM API
    var form = new formidable.IncomingForm()
    form.multiples = true
    form.keepExtensions = true
    form.uploadDir = uploadDir

    form.parse(req, (err, fields, files) => {
        console.log("debug mark 1")
        if (err) return res.status(500).json({ error: err })
        res.status(200).json({ uploaded: true })
    })

    form.on('fileBegin', function (name, file) {
        // console.log("debug mark 2")
        const [fileName, fileExt] = file.name.split('.')
        // console.log("debug mark 3")
        csvFile = `${fileName}.${fileExt}`;
        // console.log("debug mark 4")
        file.path = path.join(uploadDir, csvFile);
        // console.log("debug mark 5")
        currentPath = process.cwd() + "\\" + csvFile
        // console.log("debug mark 6")
        console.log(currentPath)


        //READ DATA STREAM FROM CSV

        let stream = fs.createReadStream(currentPath);
        //console.log("debug mark 7")
        let csvData = [];
        //console.log("debug mark 8")
        console.log(fastcsv)
        //console.log("debug mark 9")
        let csvStream = fastcsv
            .parse()
            .on("data", function (data) {
                //console.log("debug mark 10")
                csvData.push(data);
                //console.log("debug mark 11")
            })
            .on("end", function () {
                csvData.shift();

                //console.log("debug mark 12")

                //ESTABLISHING CONNECTION WITH POSTGRES
                const pool = new Pool({
                    host: "localhost",
                    user: "postgres",
                    database: "xencovTestRecords",
                    password: "password",
                    port: 5432
                });

                //QUERY TO INSERT DATA INTO THE TABLE STRUCTURE IN POSTGRES, SALES_RECORDS == TABLE NAME
                const query = "INSERT INTO sales_records (Region, Country, Item_Type, Sales_Channel, Order_Priority, Order_Date, Order_ID, Ship_Date, Units_Sold, Unit_Price, Unit_Cost, Total_Revenue, Total_Cost, Total_Profit )  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)";

                query = string.replace(/ /g, "_"); //FOR MAPPING COLUMN NAMES TO THE HEADER OF THE CSV. REPLACING SPACE WITH UNDERSCORE


                //WRITING DATA TO DATABASE
                pool.connect((err, client, done) => {
                    if (err) throw err;

                    try {
                        csvData.forEach(row => {
                            client.query(query, row, (err, res) => {
                                if (err) {
                                    console.log(err.stack);

                                } else {
                                    console.log("inserted " + res.rowCount + " row:", row);

                                }
                            });
                        });
                    } finally {
                        done();
                    }
                });
            });

        stream.pipe(csvStream);
    })
})


app.listen(3010, () => console.log('Example app listening on port 3010!'))