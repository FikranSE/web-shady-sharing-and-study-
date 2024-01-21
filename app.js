const fs = require('fs');
const express = require('express')
const mysql = require('mysql2')
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path=require('path');
const moment = require('moment');
const multer = require('multer');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash')

const app = express()
const port = 3000;



//buat folder penampung file jika tidak ada
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}


// middleware untuk parsing request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


app.set('views', path.join(__dirname, '/views'));

app.use('/css', express.static(path.resolve(__dirname, "assets/css")));
app.use('/img', express.static(path.resolve(__dirname, "assets/img")));
app.use('/submission', express.static('/img'));

// template engine
app.set('view engine', 'ejs')

// layout ejs
app.use(expressLayouts);

// mengatur folder views
app.set('views', './views');
// Middleware session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Middleware flash messages
app.use(flash());



// Create multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create multer upload configuration
const upload = multer({ storage: storage });


const saltRounds = 10;



// Konfigurasi koneksi ke database
const db = mysql.createConnection({
  host: 'localhost', 
  user: 'root',
  password: '',
  database: 'webppsi' 
});

db.connect((err) => {
  if (err) {
    console.error('Gagal terkoneksi ke database:', err);
  } else {
    console.log('Terhubung ke database MySQL');
  }
});



//register dan login
app.get('/register', function (req, res) {
  const errorMessage = req.session.errorMessage;
  req.session.errorMessage = ''; // Clear the error message from session
  const successMessage = req.session.successMessage;
  req.session.successMessage = '';
  res.render('register',{
    title:'Register',
    layout:'layouts/auth-layout',
    errorMessage : errorMessage,
    successMessage : successMessage
  });
})
 
app.post('/register', function (req, res) {
  const { email, password, confirm_password } = req.body;

  // check if email already exists
  const sqlCheck = 'SELECT * FROM users WHERE email = ?';
  db.query(sqlCheck, email, (err, result) => {
    if (err) throw err;
      console.log("Upss user sudah terdaftar");
    if (result.length > 0) {
      console.error({ message: 'email sudah terdaftar', err });
      req.session.errorMessage = 'email sudah terdaftar';
      return res.redirect('/register');
    }

    if (password !== confirm_password) {
      console.error({ message: 'Password tidak cocok!', err });
      req.session.errorMessage = 'Password tidak cocok!';
      return res.redirect('/register');
    }

    // hash password
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) throw err;

      // insert user to database
      const sqlInsert = "INSERT INTO users (email, password) VALUES (?, ?)";
      const values = [email, hash];
      db.query(sqlInsert, values, (err, result) => {
        if (err) throw err;
        console.log({ message: 'Registrasi berhasil', values });
        res.redirect('/login');
      });
    });
  });
});


// login page
app.get('/login',  (req, res) =>{
  const errorMessage = req.session.errorMessage;
  req.session.errorMessage = ''; // Clear the error message from session
  const successMessage = req.session.successMessage;
  req.session.successMessage = '';
  res.render('login',{
    title:'Login',
    layout:'layouts/auth-layout',
    errorMessage : errorMessage,
    successMessage : successMessage
  });
})

app.post('/login',  (req, res) =>{
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], function(err, result) {
    if (err) {
      console.error({ message: 'Internal Server Error', err });
      req.session.errorMessage = 'Internal Server Error';
      return res.redirect('/login');
    }
    if (result.length === 0) {
      console.error({ message: 'email atau Password salah!!', err });
      req.session.errorMessage = 'email atau Password salah!!';
      return res.redirect('/login');
    }

    const user = result[0];

    // compare password
    bcrypt.compare(password, user.password, function(err, isValid) {
      if (err) {
        console.error({ message: 'Internal Server Error', err });
        req.session.errorMessage = 'Internal Server Error';
        return res.redirect('/login');
      }

      if (!isValid) {
        console.error({ message: 'email atau Password salah!!', err });
        req.session.errorMessage = 'email atau Password salah!!';
        return res.redirect('/login');
      }

      // generate token
      const token = jwt.sign({ id_user: user.id_user }, 'secret_key');
      res.cookie('token', token, { httpOnly: true });

      console.log({ message: 'Login Berhasil', user });
      return res.redirect('/');
    });
  });
});

app.use(requireAuth, (req, res, next) => {
  
  const query1 = `SELECT * FROM users WHERE id_user = ${req.id_user}`;
  db.query(query1, function (error, results1) {
    if (error) throw error;

    const user = results1[0];
    res.locals.user = user; 
    next();
  }); 
}); 






app.get('/logout', (req, res) => {
  res.clearCookie('token', { maxAge: 0 });
  res.redirect('/');
});



// middleware untuk memeriksa apakah user sudah login atau belum
function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    res.redirect('/login');
    return;
  }

  jwt.verify(token, 'secret_key', function(err, decoded) {
    if (err) {
      res.redirect('/login');
      return;
    }

    req.id_user = decoded.id_user;
    next();
  });
}

// index page
app.get('/', (req, res) => {
  const projects = `SELECT posts.*, users.*, categori.categori, matkul.matkul FROM  posts
  JOIN users ON posts.id_user = users.id_user
  JOIN categori ON posts.id_categori = categori.id_categori
  JOIN matkul ON posts.id_matkul = matkul.id_matkul
  WHERE posts.id_categori = 2
  `;
  const moduls = `SELECT posts.*, users.*, categori.categori, matkul.matkul FROM  posts
  JOIN users ON posts.id_user = users.id_user
  JOIN categori ON posts.id_categori = categori.id_categori
  JOIN matkul ON posts.id_matkul = matkul.id_matkul
  WHERE posts.id_categori = 1
  `;
  const kuisioners = `SELECT kuisioner.*, users.*, matkul.matkul FROM  kuisioner
  JOIN users ON kuisioner.id_user = users.id_user
  JOIN matkul ON kuisioner.id_matkul = matkul.id_matkul
  `
  ;
  db.query(projects, (err, projects) => {
    if (err) {
      throw err;
    }
  db.query(moduls, (err, moduls) => {
    if (err) {
      throw err;
    }
  db.query(kuisioners, (err, kuisioners) => {
    if (err) {
      throw err;
    }

    res.render('index', {
      projects : projects,
      moduls : moduls,
      kuisioners : kuisioners,
      moment:moment,
      title: 'Dashboard',
      layout: 'layouts/main-layout'
        });
      });
    });
  });
});


app.get('/manages-post', requireAuth, function (req, res) {
  const itemsPerPage = 20;
  const currentPage = parseInt(req.query.page) || 1;

  const queryCount = 'SELECT COUNT(*) AS totalItems FROM posts';
  
  const queryData = `SELECT posts.*, users.email, users.username, matkul.matkul, categori.categori FROM posts 
  JOIN users ON posts.id_user = users.id_user
  JOIN matkul ON posts.id_matkul = matkul.id_matkul
  JOIN categori ON posts.id_categori = categori.id_categori
  LIMIT ${itemsPerPage} OFFSET ${(currentPage - 1) * itemsPerPage}
  
  `;

  db.query(queryCount, (errCount, resultCount) => {
    if (errCount) throw errCount;

    const totalItems = resultCount[0].totalItems;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage < 1 || currentPage > totalPages) {
      res.redirect('/manages-post');
      return;
    }
    db.query(queryData, (errData, resultData) => {
      if (errData) throw errData;

      res.render('manages-post', {
        items: resultData,
        currentPage: currentPage,
        totalPages: totalPages,
        layout:'layouts/main-layout',
        title:'Manages Post',
        moment:moment
      });
    });
  });
  })

app.get('/delete/:id_post', (req,res)=>{
  let id_post = req.params.id_post;
  const deleteSql = `DELETE FROM posts WHERE id_post = ${id_post}`
  db.query(deleteSql, (err, result)=>{
    if (err) throw err;
    console.log({result})
    res.redirect('/manages-post')
  })
})

app.get('/search-in-table', (req, res) => {
  const itemsPerPage = 10;
  const currentPage = parseInt(req.query.page) || 1;
  const searchQuery = req.query.search || '';

  const queryCount = 'SELECT COUNT(*) AS totalItems FROM posts';
  const queryData = `
  SELECT posts.*, users.username, matkul.matkul, categori.categori
FROM posts
JOIN users ON posts.id_user = users.id_user
JOIN matkul ON posts.id_matkul = matkul.id_matkul
JOIN categori ON posts.id_categori = categori.id_categori
WHERE posts.title LIKE '%${searchQuery}%'
    OR users.username LIKE '%${searchQuery}%'
    OR matkul.matkul LIKE '%${searchQuery}%'
    OR categori.categori LIKE '%${searchQuery}%'
LIMIT ${itemsPerPage} OFFSET ${(currentPage - 1) * itemsPerPage}

  
  `;
  db.query(queryCount, (errCount, resultCount) => {
    if (errCount) throw errCount;

    const totalItems = resultCount[0].totalItems;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage < 1 || currentPage > totalPages) {
      res.redirect('/manages-post');
      return;
    }
    db.query(queryData, (errData, resultData) => {
      if (errData) throw errData;

      res.render('manages-post', {
        items: resultData,
        currentPage: currentPage,
        totalPages: totalPages,
        layout:'layouts/main-layout',
        title:'Manages Post',
        moment:moment
      });
    });
  });
})

app.get('/manages-matkul', requireAuth, function (req, res) {
  const itemsPerPage = 20;
  const currentPage = parseInt(req.query.page) || 1;

  const queryCount = 'SELECT COUNT(*) AS totalItems FROM matkul';
  
  const queryData = `SELECT * FROM matkul 
  LIMIT ${itemsPerPage} OFFSET ${(currentPage - 1) * itemsPerPage}
  `;

  db.query(queryCount, (errCount, resultCount) => {
    if (errCount) throw errCount;

    const totalItems = resultCount[0].totalItems;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage < 1 || currentPage > totalPages) {
      res.redirect('/manages-matkul');
      return;
    }
    db.query(queryData, (errData, resultData) => {
      if (errData) throw errData;

      res.render('manages-matkul', {
        items: resultData,
        currentPage: currentPage,
        totalPages: totalPages,
        layout:'layouts/main-layout',
        title:'Manages matkul',
        moment:moment
      });
    });
  });
  })

app.get('/delete-matkul/:id_matkul', (req,res)=>{
  let id_matkul = req.params.id_matkul;
  const deleteSql = `DELETE FROM matkul WHERE id_matkul = ${id_matkul}`
  db.query(deleteSql, (err, result)=>{
    if (err) throw err;
    console.log({result})
    res.redirect('/manages-matkul')
  })
})

app.get('/tambah-matkul', requireAuth, function (req, res) {
  res.render('tambah-matkul', {
    title: 'Tambah Matkul',
    layout: 'layouts/main-layout'
  })
})

app.post('/tambah-matkul', requireAuth, (req, res) => {
  const matkul = req.body.matkul; 
 
    const insertSql = `INSERT INTO matkul (matkul) VALUES (?)`;
    db.query(insertSql, matkul, (err, result) => {
      if (err) { 
        throw err;
      }
      console.log({ message: 'Submission complete!', result });
      res.redirect('/manages-matkul');
    })
  })

app.get('/edit-matkul/:id_matkul', requireAuth,function (req, res) {
  const id_matkul = req.params.id_matkul; 
  const matkulSql =  `SELECT *
  FROM matkul
  WHERE id_matkul = ?
  `;
  db.query(matkulSql, [id_matkul], (err, results) => {
    if (err) {
      throw err;
    }
    const datamatkulEdit = results[0];

    res.render('edit-matkul', {
      title: 'Edit matkul',
      layout: 'layouts/main-layout',
      datamatkulEdit
     })
    })
  })

  app.post('/edit-matkul', requireAuth, (req, res) => {
    const {id_matkul, matkul} = req.body;

      const updateSql = `UPDATE matkul SET matkul = ? WHERE id_matkul = ?`;
      const updateValues = [matkul, id_matkul];
      db.query(updateSql, updateValues, (err, result) => {
        if (err) {
          throw err;
        }
        console.log({ message: 'Update complete!', result });
        res.redirect('/manages-matkul');
      })
    })

app.get('/search-in-table-matkul', (req, res) => {
  const itemsPerPage = 10;
  const currentPage = parseInt(req.query.page) || 1;
  const searchQuery = req.query.search || '';

  const queryCount = 'SELECT COUNT(*) AS totalItems FROM matkul';
  const queryData = `
  SELECT matkul FROM matkul
  WHERE matkul LIKE '%${searchQuery}%'
  LIMIT ${itemsPerPage} OFFSET ${(currentPage - 1) * itemsPerPage}
  `;
  db.query(queryCount, (errCount, resultCount) => {
    if (errCount) throw errCount;

    const totalItems = resultCount[0].totalItems;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage < 1 || currentPage > totalPages) {
      res.redirect('/manages-matkul');
      return;
    }
    db.query(queryData, (errData, resultData) => {
      if (errData) throw errData;

      res.render('manages-matkul', {
        items: resultData,
        currentPage: currentPage,
        totalPages: totalPages,
        layout:'layouts/main-layout',
        title:'Manages Matkul',
        moment:moment
      });
    });
  });
})

  app.get('/search', requireAuth, (req, res) => {
    const query = req.query.query; // Ambil query pencarian dari URL parameter "query"
  
    // Lakukan pencarian di tabel "posts"
    const searchPostsSql = `
      SELECT posts.*, users.*, categori.categori, matkul.matkul FROM  posts
      JOIN users ON posts.id_user = users.id_user
      JOIN categori ON posts.id_categori = categori.id_categori
      JOIN matkul ON posts.id_matkul = matkul.id_matkul
      WHERE title LIKE ? OR excerpt LIKE ?
    `;
  
    // Lakukan pencarian di tabel "kuisioner" 
    const searchKuisionerSql = `
      SELECT kuisioner.*, users.*, matkul.matkul FROM  kuisioner
      JOIN users ON kuisioner.id_user = users.id_user
      JOIN matkul ON kuisioner.id_matkul = matkul.id_matkul
      WHERE title LIKE ? OR excerpt LIKE ?
    `;
  
    const searchQuery = `%${query}%`;
  
    db.query(searchPostsSql, [searchQuery, searchQuery], (err, postsResults) => {
      if (err) {
        throw err;
      }
  
      db.query(searchKuisionerSql, [searchQuery, searchQuery], (err, kuisionerResults) => {
        if (err) {
          throw err;
        }
  
        // Gabungkan hasil pencarian dari kedua tabel
        const searchResults = postsResults.concat(kuisionerResults);
  
        res.render('search-result', {
          title: 'Search Results',
          layout: 'layouts/main-layout',
          results: searchResults,
          moment:moment,
          query: query,
        });
      });
    });
  });

  app.get('/detail/:id_post', requireAuth,function (req, res) {
    const id_post = req.params.id_post;
  
    const postSql = `SELECT posts.*, users.username
      FROM posts
      JOIN users ON posts.id_user = users.id_user
      WHERE posts.id_post = ?`;
  
    db.query(postSql, [id_post], (err, results) => {
      if (err) {
        throw err;
      }
  
      const detailPost = results[0];
  
      // Mengambil ukuran berkas
      const fs = require('fs');
      const filePath = 'uploads/' + detailPost.uploaded_file; // Sesuaikan dengan path berkas di server Anda
      const stats = fs.statSync(filePath);
      const fileSizeInBytes = stats.size;
      const fileSizeInKilobytes = fileSizeInBytes / 1024;
  
      res.render('detail', {
        title: 'Detail', 
        layout: 'layouts/main-layout',
        detailPost: detailPost,
        moment,
        fileSizeInKilobytes: fileSizeInKilobytes.toFixed(2) + ' KB'
      });
    });
  })

  app.get('/detail-kuisioner/:id_kuisioner', requireAuth, function (req, res) {
    const id_kuisioner = req.params.id_kuisioner;
  
    const kuisionerSql = `SELECT kuisioner.*, users.username
    FROM kuisioner
    JOIN users ON kuisioner.id_user = users.id_user
    WHERE kuisioner.id_kuisioner = ?
    `;
  
    db.query(kuisionerSql, [id_kuisioner], (err, results) => {
      if (err) {
        throw err;
      }
  
      const detailKuisioner = results[0];
  
      res.render('detail-kuisioner', {
        title: 'Detail kuisioner',
        layout: 'layouts/main-layout',
        detailKuisioner: detailKuisioner,
        moment:moment
      });
    });
  });



  app.get('/detail-post-user/:id_post', requireAuth,function (req, res) {
    const id_post = req.params.id_post;
    const id_user = req.id_user;
  
     const postSql = 'SELECT * FROM posts WHERE id_post = ?';
    db.query(postSql, [id_post], function (err, postResult) {
      if (err) throw err;
  
      const detailPost = postResult[0];
  
      const userSql = `SELECT * FROM users WHERE id_user = ${id_user}`;
  
      const fs = require('fs');
      const filePath = 'uploads/' + detailPost.uploaded_file; // Sesuaikan dengan path berkas di server Anda
      const stats = fs.statSync(filePath);
      const fileSizeInBytes = stats.size;
      const fileSizeInKilobytes = fileSizeInBytes / 1024;
  
  
      db.query(userSql, [id_post], function (err, userResult) {
        if (err) throw err;
  
        res.render('detail-post-user', {
          detailPost: postResult[0],
          userPost: userResult[0],
          id_user : id_user,
          moment: moment,
          fileSizeInKilobytes, 
          title: 'Detail my post',
          layout: 'layouts/main-layout'
      
       });
      })
    });
  });

  app.get('/edit-post/:id_post', requireAuth,function (req, res) {
    const id_post = req.params.id_post; 
    const categoriSql = 'SELECT * FROM categori';
    const matkulSql = 'SELECT * FROM matkul';
    const postSql =  `SELECT posts.*, users.username, categori.categori, matkul.matkul
    FROM posts
    JOIN users ON posts.id_user = users.id_user
    JOIN categori ON posts.id_categori = categori.id_categori
    JOIN matkul ON posts.id_matkul = matkul.id_matkul
    WHERE posts.id_post = ?
    `;
    db.query(categoriSql, (err, categoriData) => {
      if (err) {
        throw err;
      }
    db.query(matkulSql, (err, matkulData) => {
      if (err) {
        throw err;
      }
    db.query(postSql, [id_post], (err, results) => {
      if (err) {
        throw err;
      }
  
      const dataPostEdit = results[0];
  
      res.render('edit-post', {
        title: 'Edit post',
        layout: 'layouts/main-layout',
        dataPostEdit,
        matkulData,
        categoriData
       })
      });
    });
  });
});
  
  app.get('/download/:id_user/:id_post', (req, res) => {
    const id_user = req.params.id_user;
    const id_post = req.params.id_post;
  
    const postSql = 'SELECT * FROM posts WHERE id_post = ?';
    db.query(postSql, [id_post], function(err, postResult) {
      if (err) throw err;
      if (postResult.length === 0) {
        res.status(404).send('post not found');
        return;
      }
  
      const postSql = 'SELECT * FROM posts WHERE id_user = ? AND id_post = ?';
      db.query(postSql, [id_user, id_post], function(err, postResult) {
        if (err) throw err;
        if (postResult.length === 0) {
          res.status(404).send('post not found');
          return;
        }
  
        const post = postResult[0];
        const filePath = `uploads/${post.uploaded_file}`;
  
        res.download(filePath, post.file_name, function(err) {
          if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
          }
        });
      });
    });
  });

  app.get('/accounts/:id_user', requireAuth,function (req, res) {
    const id_user = req.params.id_user;
    
    
     const postSql = `SELECT posts.*, users.*, categori.categori, matkul.matkul FROM  posts
     JOIN categori ON posts.id_categori = categori.id_categori
     JOIN matkul ON posts.id_matkul = matkul.id_matkul
     JOIN users ON posts.id_user = users.id_user
     WHERE users.id_user = ?`;
     
     
     const KuisSql = `SELECT kuisioner.*, users.*, matkul.matkul FROM  kuisioner
     JOIN matkul ON kuisioner.id_matkul = matkul.id_matkul
     JOIN users ON kuisioner.id_user = users.id_user
     WHERE users.id_user = ?`;
     const userSql = `SELECT * FROM users WHERE id_user = ?`;
    db.query(postSql, [id_user], function (err, postResult) {
      if (err) throw err;
     db.query(KuisSql, [id_user], function (err, kuisResult) {
      if (err) throw err;
      db.query(userSql, [id_user], function (err, userResult) {
         if (err) throw err;
  
        res.render('accounts', {
          userPost: postResult,
          userKuis: kuisResult,
          user: userResult[0],
          moment:moment,
          title: 'Detail my post',
          layout: 'layouts/main-layout'
          })
        })
      })
    });
  });
app.get('/search-page',function (req, res) {
        res.render('search-page', {
          title: 'Search',
          layout: 'layouts/main-layout'

    })
  })

  app.get('/post', requireAuth,function (req, res) {
    const categoriSql = 'SELECT * FROM categori';
    const matkulSql = 'SELECT * FROM matkul';
    db.query(categoriSql, (err, categoriData) => {
      if (err) {
        throw err;
      }
    db.query(matkulSql, (err, matkulData) => {
      if (err) {
        throw err;
      }
  
      res.render('post', {
        title: 'Post',
        layout: 'layouts/main-layout',
        categoriData: categoriData,
        matkul: matkulData
        });
      });
    });
  });
  
  app.get('/post-kuisioner', requireAuth, function (req, res) {
    const categoriSql = 'SELECT * FROM categori';
    const matkulSql = 'SELECT * FROM matkul';
    db.query(categoriSql, (err, categoriData) => {
      if (err) {
        throw err;
      }
    db.query(matkulSql, (err, matkulData) => {
      if (err) {
        throw err;
      }
  
      res.render('post-kuisioner', {
        title: 'Post kuisioner',
        layout: 'layouts/main-layout',
        categoriData: categoriData,
        matkul: matkulData  
       });
      });
    });
  });

  app.get('/edit-kuisioner/:id_kuisioner', requireAuth, function (req, res) {
    const id_kuisioner = req.params.id_kuisioner; 
    const kuisionerSql =  `SELECT kuisioner.*, users.username
    FROM kuisioner
    JOIN users ON kuisioner.id_user = users.id_user
    WHERE kuisioner.id_kuisioner = ?
    `;
    db.query(kuisionerSql, [id_kuisioner], (err, results) => {
      if (err) {
        throw err;
      }
  
      const datakuisioner = results[0];
  
      res.render('edit-kuisioner', {
        title: 'Edit kuisioner',
        layout: 'layouts/main-layout',
        datakuisioner
      });
    });
  });

  app.get('/detail-kuisioner-user/:id_kuisioner', requireAuth, function (req, res) {
    const id_kuisioner = req.params.id_kuisioner;
      const  id_user = req.id_user;
    const kuisionerSql = `SELECT kuisioner.*, users.username
    FROM kuisioner
    JOIN users ON kuisioner.id_user = users.id_user
    WHERE kuisioner.id_kuisioner = ?
    `;
  
    db.query(kuisionerSql, [id_kuisioner], (err, results) => {
      if (err) {
        throw err;
      }
  
      const detailKuisioner = results[0];
  
      res.render('detail-kuisioner-user', {
        title: 'Detail kuisioner for User',
        layout: 'layouts/main-layout',
        detailKuisioner: detailKuisioner,
        moment:moment,
        id_user : id_user,
      });
    });
  });

  app.get('/projects-home',function (req, res) {
    const projects = `SELECT posts.*, users.* FROM  posts
    JOIN users ON users.id_user = posts.id_user
    WHERE posts.id_categori = 2
    `;
    db.query(projects, (err, projects) => {
      if (err) {
        throw err;
      }
  
      res.render('projects-home', {
        projects : projects,
        moment:moment,
        title: 'Projects Home', 
        layout: 'layouts/basic-layout'
      }); 
    });
  });
  
  app.get('/moduls-home',function (req, res) {
    const moduls = `SELECT posts.*, users.* FROM  posts
    JOIN users ON users.id_user = posts.id_user
    WHERE posts.id_categori = 1
    `;
    db.query(moduls, (err, moduls) => {
      if (err) {
        throw err;
      }
  
      res.render('moduls-home', {
        moduls : moduls,
        moment:moment,
        title: 'Moduls Home',
        layout: 'layouts/basic-layout'
      });
    });
  });
  
  
  app.get('/kuisioners-home',function (req, res) {
    const kuisioners = `SELECT kuisioner.*, users.* FROM  kuisioner
    JOIN users ON users.id_user = kuisioner.id_user
    `;
    db.query(kuisioners, (err, kuisioners) => {
      if (err) {
        throw err;
      }
  
      res.render('kuisioners-home', {
        kuisioners : kuisioners,
        moment:moment,
        title: 'Kuisioners Home',
        layout: 'layouts/basic-layout'
      });
    });
  });

  app.post('/edit-kuisioner', requireAuth, (req, res) => {
    const { title, excerpt, description } = req.body;
    const id_user = req.id_user;
  
    const updateSql = `UPDATE kuisioner SET title = ?, excerpt = ?, description = ? WHERE id_user = ?`;
    const updateValues = [title, excerpt, description, id_user];
    db.query(updateSql, updateValues, (err, result) => {
      if (err) {
        throw err;
      }
      console.log({ message: 'Update complete!', updateValues });
      res.redirect('/account');
    });
  });

  app.get('/account', requireAuth, function (req, res) {
    let id_user = req.id_user;
    const selectSql = `SELECT * FROM users WHERE id_user = ${id_user}`;
    const selectPostSql = `SELECT posts.*, categori.categori, matkul.matkul FROM  posts
    JOIN categori ON categori.id_categori = posts.id_categori
    JOIN matkul ON matkul.id_matkul = posts.id_matkul
    WHERE posts.id_user = ${id_user}`;
    const selectKuisSql = `SELECT kuisioner.*, matkul.matkul FROM  kuisioner
    JOIN matkul ON matkul.id_matkul = kuisioner.id_matkul
    WHERE kuisioner.id_user = ${id_user}`;
    db.query(selectSql, (err,resultUser)=>{
      if (err) throw err;
    db.query(selectPostSql, (err,resultPost)=>{
      if (err) throw err;
    db.query(selectKuisSql, (err,resultKuis)=>{
      if (err) throw err;
        res.render('account',{
          user: resultUser[0],
          dataPost: resultPost,
          dataKuis : resultKuis,
          title:'Account', 
          moment:moment,
          layout:'layouts/main-layout'
          })
        })
      })
    })
  }) 

  app.get('/edit-account', requireAuth, function (req, res) {
    let id_user = req.id_user;
    const errorAccount = req.session.errorAccount;
    req.session.errorAccount = '';
    const selectUserSql = `SELECT * FROM users WHERE id_user = ${id_user}`;
    db.query(selectUserSql, (err,resultUser)=>{
      if (err) throw err;
        res.render('edit-account',{
          user: resultUser[0],
          errorAccount: errorAccount,
          title:'edit account',
          layout:'layouts/main-layout'
      })
    })
  })

  app.post('/post-edit-account', upload.single('avatar'), requireAuth, (req, res) => {
    const id_user = req.id_user;
    const { username, about, nim } = req.body;
    let avatar = null;
  
    if (req.file) {
      // Avatar file was uploaded
      avatar = req.file.filename;
  
      const avatarAllowedExtensions = ['.jpg', '.jpeg', '.png'];
      const avatarExtension = path.extname(req.file.originalname).toLowerCase();
  
      if (!avatarAllowedExtensions.includes(avatarExtension)) {
        req.session.errorAccount = 'File harus berupa jpg, jpeg atau png';
        return res.redirect('edit-account');
      }
  
      const avatarSource = path.join(__dirname, 'uploads', avatar);
      const avatarDestination = path.join(__dirname, 'assets', 'img', avatar);
      fs.renameSync(avatarSource, avatarDestination);
    }
  
    // Build the SQL query dynamically based on whether 'avatar' is provided
    let updateQuery = 'UPDATE users SET username=?, about=?, nim=?';
    const values = [username, about, nim];
  
    if (avatar) {
      updateQuery += ', avatar=?';
      values.push(avatar);
    }
  
    updateQuery += ' WHERE id_user=?';
    values.push(id_user);
  
    // Update data in MySQL
    db.query(updateQuery, values, (err, result) => {
      if (err) {
        console.error(err);
        res.redirect('/account');
        return;
      }
      console.log('Data updated in MySQL!');
      res.redirect('/account');
    });
  });

  app.post('/publish-kuisioner', requireAuth, (req, res) => {
    const { title, excerpt, id_matkul, description } = req.body;
    const id_user = req.id_user;
  
    // Check if user has already submitted for the post
    const submissionSql = `SELECT * FROM posts WHERE id_user = ?`;
    const submissionValues = [id_user];
    db.query(submissionSql, submissionValues, (err, submissionResult) => {
      if (err) {
        throw err;
      } 
  
      // Insert data to MySQL
      const insertSql = `INSERT INTO kuisioner ( id_user, title, excerpt, id_matkul, description) VALUES (?, ?, ?, ?, ?)`;
      const insertValues = [ id_user, title, excerpt, id_matkul, description];
      db.query(insertSql, insertValues, (err, result) => {
        if (err) { 
          throw err;
        }
        console.log({ message: 'Submission complete!', insertValues });
        res.redirect('/');
      });
    });
  });

  app.post('/publish', upload.single('uploaded_file'), requireAuth, (req, res) => {
    const { id_categori, id_matkul, title, excerpt, description } = req.body;
    const uploaded_file = req.file.filename;
    const id_user = req.id_user;
  
    // Check if user has already submitted for the form
    const submissionSql = `SELECT * FROM posts WHERE id_user = ? AND id_categori = ?`;
    const submissionValues = [id_user, id_categori];
    db.query(submissionSql, submissionValues, (err, submissionResult) => {
      if (err) {
        throw err;
      }
  
      // Insert data to MySQL
      const insertSql = `INSERT INTO posts (id_user, id_categori, id_matkul, title, excerpt, description, uploaded_file) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const insertValues = [id_user, id_categori, id_matkul,  title, excerpt, description, uploaded_file];
      db.query(insertSql, insertValues, (err, result) => {
        if (err) {
          throw err;
        }
        console.log({ message: 'Submission complete!', insertValues });
        res.redirect('/');
      });
    });
  });

  app.post('/edit-post', requireAuth, upload.single('uploaded_file'),  (req, res) => {
    const { id_post, id_categori, id_matkul, title, excerpt, description } = req.body;
    let uploaded_file = null;
    const id_user = req.id_user;
  
    if (req.file) {
      uploaded_file = req.file.filename;
  
      // Copy file to img directory
      const source = path.join(__dirname, 'uploads', uploaded_file);
      const destination = path.join(__dirname, 'public', 'img', uploaded_file);
      fs.copyFileSync(source, destination);
    }
  
    const selectUserSql = `SELECT uploaded_file FROM posts WHERE id_post = ${id_post}`;
    db.query(selectUserSql, (err, result) => {
      if (err) {
        throw err;
      }
      if (!uploaded_file) {
        uploaded_file = result[0].uploaded_file;
      }
    
      // Update data in MySQL
      const updateSql = `UPDATE posts SET id_matkul = ?,id_categori = ?, title = ?, excerpt = ?, description = ?, uploaded_file = ? WHERE id_user = ?`;
      const updateValues = [id_matkul, id_categori, title, excerpt, description, uploaded_file, id_user];
      db.query(updateSql, updateValues, (err, result) => {
        if (err) {
          throw err;
        }
        console.log({ message: 'Update complete!', updateValues });
        res.redirect('/account');
      });
    });
  });
  
  
  








app.listen(port,()=>{
  console.log(`listening on port ${port}`)
})