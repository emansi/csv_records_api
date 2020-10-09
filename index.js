const express = require('express')
const app = express()
const formidable = require('formidable')
const path = require('path')
const uploadDir = '' 



app.post('/', (req, res) => {
    // console.log("debug mark 0")

    //download csv from api
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
        currentPath = process.cwd() +"\\"+csvFile
        // console.log("debug mark 6")
        console.log(currentPath)

    })
})


app.listen(3010, () => console.log('Example app listening on port 3010!'))