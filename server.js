let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');
const generateUUID = require('./genarateUUID');
const res = require('express/lib/response');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//homepage Route
app.get('/', (req, res) => {
    return res.send({
        error: false,
        messege: 'Welcome to Test API with Node js',
        created_by: 'First'
    })
})
let dbCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_api'
})
dbCon.connect();

//homepage Route
app.get('/users', (req, res) => {
    dbCon.query('SELECT * FROM user', (error, results, fields) => {
        if (error) throw error;

        let messege = "";
        if (results === undefined || results.length == 0) {
            messege = "User in Empty";
        } else {
            messege = "Fetch Complete";
        }
        return res.send({ error: false, data: results, messege: messege });
    });
});

app.get('/users/:id', (req, res) => {
    let id = req.params.id;

    if (!id) {
        return res.status(400).send({ error: true, messege: "Please insert ID" });
    } else {
        dbCon.query('SELECT * FROM user WHERE id = ?', id, (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results === undefined || results.length == 0) {
                message = "Not found User";
            } else {
                message = "Found User ID " + id;
            }
            return res.send({ error: false, data: results[0], messege: message });
        });
    }
});

app.put('/users', (req, res) => {
    let id = req.body.id;
    let name_user = req.body.name_user;
    let user = req.body.user;
    let pass = req.body.pass;

    if (!id || !name_user || !user || !pass) {
        return res.status(400).send({ error: true, message: 'Please insert ID, name, user, pass' });
    } else {
        dbCon.query('UPDATE user SET name_user = ?, user = ?, pass = ? WHERE id = ?', [name_user, user, pass, id], (error, results, fields) => {
            if (error) throw error;

            let messege = "";
            if (results.changedRows === 0) {
                messege = "Update Fail!!";
            } else {
                messege = "Update Complete";
            }
            return res.send({ error: false, data: results, messege: messege });
        });
    }
});

app.post('/addUser', (req, res) => {
    // console.log(UUID);
    let name_user = req.body.name_user;
    let user = req.body.user;
    let pass = req.body.pass;

    if (!name_user || !user || !pass) {
        return res.status(400).send({ error: true, messege: "Please insert values" });
    } else {
        let UUID = generateUUID();
        dbCon.query("INSERT INTO user (UUID, name_user, user, pass) VALUES (?,?,?,?)", [UUID, name_user, user, pass], (error, results, fields) => {
            if (error) throw error;
            return res.send({ error: false, data: results, messege: "Add User Complete" });
        });
    }
});

app.delete('/users', (req, res) => {
    let id = req.body.id;

    if (!id) {
        return res.status(400).send({ error: true, messege: "Please insert ID to Delete" });
    } else {
        dbCon.query('DELETE FROM user WHERE id=?', id, (error, results, fields) => {

            if (error) throw error;
            let messege = "";
            if (results.affectedRows === 0) {
                messege = "Delete Fail!!";
            } else {
                messege = "Delete Complete";
            }
            return res.send({ error: false, data: results, messege: messege });
        })
    }
})

app.listen(3000, () => {
    console.log('Node Start');
});

module.exports = app;