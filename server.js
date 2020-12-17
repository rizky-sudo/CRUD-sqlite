const express = require('express');
const path = require('path');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(__dirname + '/data.db', (err) => {
    if (err) throw err;
    console.log('db connected');
});
const app = express();
const body = require('body-parser');



// menampilkan engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// menampilkan body parser
app.use(body.urlencoded({ extended: false }));

// menmapilkan jalur statis
app.use('/', express.static(path.join(__dirname, 'public')));

// menampilkan list
app.get('/', (req, res) => {
    const { cek1, cek2, cek3, cek4, cek5, cek6, id, string, integer, float, startdate, enddate, boolean } = req.query;
    let halaman = req.query.halaman || 1;
    let perhalaman = 3;
    let ofset = (halaman - 1) * perhalaman;
    let url = req.url == '/' ? '/?halaman=1' : req.url;
    let result = [];
    let filter = false;

    if (cek1 && id) {
        result.push(`id = '${id}'`);
        filter = true;
    }

    if (cek2 && string) {
        result.push(`string = '${string}'`);
        filter = true;
    }

    if (cek3 && integer) {
        result.push(`integer = '${integer}'`);
        filter = true;
    }

    if (cek4 && float) {
        result.push(`float = '${float}'`);
        filter = true;
    }

    if (cek5 && startdate && enddate) {
        result.push(`date BEETWEN '${startdate}' AND '${enddate}'`);
        filter = true;
    }

    if (cek6 && boolean) {
        result.push(`boolean = ${boolean}`)
        filter = true;
    }

    let sql = `SELECT COUNT (*) AS total from crud`
    if (filter == true) {
        sql += `WHERE ${result.join(' AND ')}`
    }

    // menghitung jumlah data pada tabel
    db.all(sql, (err, count) => {
        if (err) throw err;
        let rows = count[0].total

        let hall = Math.ceil(rows / perhalaman);
        sql = `SELECT * FROM crud`;
        if (filter) {
            sql += ` WHERE ${result.join(' AND')}`
        }
        sql += ` LIMIT ${perhalaman} OFFSET ${ofset}`
        db.all(sql, (err, rows) => {
            console.log(sql);
            res.render('index', { crud: rows, halaman, hall, query: req.query, url, title: 'CRUD' });
        });
    });
});
//menampilkan add 
app.get('/add', (req, res) => {
    const id = req.params.id;
    res.render('add');
});

//menambahkan data
app.post('/add', (req, res) => {
    let id = req.params.id;
    const { string, integer, float, date, boolean } = req.body;
    db.serialize(() => {
        const sql = `INSERT INTO crud (string, integer, float, date, boolean)
        VALUES ('${string}', ${integer}, ${float}, '${date}', '${boolean}')`;
        // const resetauto = `DELETE FROM sqlite_sequence WHERE name = 'crud'`;
        db.run(sql, (err, rows) => {
            if (err) throw err;
            // db.run(resetauto, (err, rows) => {
            //     if (err) throw err;
            // });
            res.redirect('/');
        });
    });
});

//menampilkan edit
app.get('/edit/:id', (req, res) => {
    let { id } = req.params;;
    db.serialize(() => {
        const sql = `SELECT * FROM crud WHERE id = ${id}`;
        db.get(sql, (err, rows) => {
            if (err) throw err;
            res.render('edit.ejs', { crud: rows });
        });
    });
});
app.post('/edit/:id', (req, res) => {
    let { id } = req.params;
    const { string, integer, float, date, boolean } = req.body
    db.serialize(() => {
        const sql = `UPDATE crud SET string= '${string}', integer= ${integer}, float= ${float}, date= '${date}', boolean= '${boolean}' WHERE id= ${id}`;
        db.run(sql, (err) => {
            if (err) throw err;
            res.redirect('/');
        });
    });
});


// menampilkan delete
app.get('/delete/:id', (req, res) => {
    const {id} = req.params;
    db.serialize(() => {
        const sql = `DELETE FROM crud WHERE id= ${id}`;
        db.run(sql, (err) => {
            if (err) throw err;
            res.redirect('/');
        });
    });
});


app.listen(3000, () => {
    console.log('aplikasi sedang berjalan di port 3000');
});
