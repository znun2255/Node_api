let express = require('express');
let bodyParser = require('body-parser');
let mysql = require('mysql');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// connect to MySQL
let dbCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_api'
})

dbCon.connect((err) => {
    if (err) {
        console.error('Have Error : ' + err.message);
    } else {
        console.log('DATABASE_CONNECT!!!');
    }
});

// Homepage
app.get('/', (req, res) => {
    return res.send({
        error: false,
        message: 'Welcome to RESTful With Nodejs',
    })
})

// get All books
app.get('/books', (req, res) => {
    dbCon.query('SELECT * FROM books', (error, result, fields) => {
        if (error) throw error;

        let message = ""
        if (result === undefined || result.length == 0) {
            message = "Books is Empty";
        } else {
            message = "Get All Books Success!!!"
        }
        return res.send({
            error: false,
            data: result,
            message: message
        })
    })
})

// get book
app.get('/book/:id', (req, res) => {
    let id = req.params.id;

    if (!id) {
        return res.status(400).send({
            error: true,
            message: "ID is provide"
        })
    } else {
        dbCon.query('SELECT * FROM books WHERE id = ?', [id], (error, result, fields) => {
            if (error) throw error;

            let message = ""
            if (result === undefined || result.length == 0) {
                message = "Book not found";
            } else {
                message = "Get All Book ID : " + id + " Success!!!"
            }
            return res.send({
                error: false,
                data: result,
                message: message
            })
        })
    }
})

// Add book
app.post('/add_book', (req, res) => {
    let name = req.body.name;
    let auther = req.body.auther;

    if (!name || !auther) {
        return res.status(400).send({
            error: true,
            message: "Please Insert name and auther."
        })
    } else {
        dbCon.query('INSERT INTO books(name,auther) VALUES(?,?)', [name, auther], (error, result, fields) => {
            if (error) throw error;

            return res.send({
                error: false,
                data: result,
                message: "Add book Success!!!"
            })
        })
    }
})

// Update book
app.put('/update_book', (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let auther = req.body.auther;

    if (!id || !name || !auther) {
        return res.status(400).send({
            error: true,
            message: "ID is provide, name and auther."
        })
    } else {
        dbCon.query('UPDATE books SET name = ? , auther = ? WHERE id = ?', [name, auther,id], (error, result, fields) => {
            if (error) throw error;

            let message = ""
            if (result.changedRows === 0) {
                message = "Book not found or DATA are same"
            } else {
                message = "Update book Success!!!"
            }
            return res.send({
                error: false,
                data: result,
                message: message
            })
        })
    }
})

// Delete book
app.delete('/delete_book', (req, res) => {
    let id = req.body.id;

    if (!id) {
        return res.status(400).send({
            error: true,
            message: "ID not Found"
        })
    } else {
        dbCon.query('DELETE FROM books WHERE id = ?', [id], (error, result, fields) => {
            if (error) throw error;

            let message = ""
            if (result.affectRows === 0) {
                message = "Book not found"
            } else {
                message = "Deleted book Success!!!"
            }    
            return res.send({
                error: false,
                data: result,
                message: message
            })
        })
    }
})

app.listen(3000, () => {
    console.log('Server running on port 3000');
})

module.exports = app;