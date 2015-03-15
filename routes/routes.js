/**
 * Created by gfoster on 3/9/15.
 */
var mysql = require('mysql');

var pool = mysql.createPool({
    host: process.env.HOST, database: process.env.DATABASE, password: process.env.PASSWORD, user: process.env.USER
});

var express = require('express');
var router = express.Router();

router.get("/api/blogs", function (req, res) {
    pool.getConnection(function (err, conn) {
        if (err) {
            res.json({"blog_entries": null});
            return;
        }

        conn.query("select * from blog_entry", function (err, result) {
            if (err) {
                res.json({"blog_entries": null});
            } else {
                res.json({"blog_entries": result});
            }
        });
    });
});

router.get("/api/blog/:blog_id", function (req, res) {
    pool.getConnection(function (err, conn) {
        if (err) {
            res.json({"blog_entry": null});
            return;
        }

        var blog_id = req.params.blog_id;
        if (blog_id > 0) {
            conn.query("select * from blog_entry where id = ?", [blog_id], function (err, result) {
                if (!err) {
                    res.json({"blog_entry": result});
                }
            });
        } else {
            res.json({"blog_entry": null});
        }
    });
});

router.get("/api/blog/:blog_id/comments", function (req, res) {
    pool.getConnection(function (err, conn) {
        if (err) {
            res.json({"comments": null});
            return;
        }

        var blog_id = req.params.blog_id;
        if (blog_id > 0) {
            conn.query("select * from comment where blog_id = ?", [blog_id], function (err, result) {
                if (!err) {
                    res.json({"comments": result});
                }
            });
        } else {
            res.json({"blog_entry": null});
        }
    });
});

router.get("/api/blog/:blog_id/comment/:id", function (req, res) {
    pool.getConnection(function (err, conn) {
        if (err) {
            res.json({"comment": null});
            return;
        }

        var blog_id = req.params.blog_id;
        var id = req.params.id;
        if (blog_id > 0 && id > 0) {
            conn.query("select * from comment where blog_id = ? and id = ?", [blog_id, id], function (err, result) {
                if (!err) {
                    res.json({"comment": result});
                }
            });
        } else {
            res.json({"comment": null});
        }
    });
});

module.exports = router;