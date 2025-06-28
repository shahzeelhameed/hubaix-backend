// const mysql = require('mysql2/promise');

// const db = mysql.createPool({
//     host: 'localhost',
//     user: 'root', // Replace with your MySQL username
//     database: 'lyardb', // Replace with your MySQL database name
//     password: '', // Replace with your MySQL password
//     port: 3306, // Default MySQL port
// });

// // Test the connection
// db.getConnection()
//     .then(() => console.log('Connected to MySQL database'))
//     .catch(err => console.error('Error connecting to MySQL database', err));

// const createTable = async (tableName, columns) => {
//     await db.query(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`);
// };

// createTable(
//     'users',
//     `user_id INT AUTO_INCREMENT PRIMARY KEY,
//          username VARCHAR(255) NOT NULL,
//          email VARCHAR(255) NOT NULL UNIQUE,
//          password VARCHAR(255) NOT NULL,
//          retypepassword VARCHAR(255) NOT NULL,
//          cnic_number VARCHAR(50) NOT NULL,
//          role VARCHAR(50) NOT NULL DEFAULT 'user'`
// );

// createTable(
//     'complaints',
//     `complaint_id INT AUTO_INCREMENT PRIMARY KEY,
//          created_by VARCHAR(255) NOT NULL,
//          user_id INT,
//          complaint_description TEXT NOT NULL,
//          cnic_number VARCHAR(50) NOT NULL,
//          status VARCHAR(20) NOT NULL DEFAULT 'pending',
//          priority VARCHAR(10) DEFAULT 'medium',
//          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//          resolved_at TIMESTAMP NULL,
//          assigned_to VARCHAR(255) NULL,
//          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE`
// );

// createTable(
//     'payments',
//     `payment_id INT AUTO_INCREMENT PRIMARY KEY,
//          payment_link_id VARCHAR(255) NOT NULL,
//          payment_initiated_time TIMESTAMP NOT NULL,
//          payment_completed BOOLEAN DEFAULT FALSE,
//          payment_completed_time TIMESTAMP NULL,
//          user_id INT,
//          type VARCHAR(50) NOT NULL,
//          unique_id VARCHAR(255) NOT NULL,
//          amount DECIMAL(10, 2) NOT NULL,
//          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL`
// );

// module.exports = db;

// working

// const mysql = require('mysql2/promise');

// const db = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   port: 3306,
// });

// // Create database if not exists
// db.query('CREATE DATABASE IF NOT EXISTS lyaridb')
//   .then(() => console.log('Database created or already exists'))
//   .catch((err) => console.error('Error creating database', err));

// // Connect to the newly created or existing database
// const dbWithDatabase = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'lyaridb',
//   password: '',
//   port: 3306,
// });

// // Test the connection
// dbWithDatabase
//   .getConnection()
//   .then(() => console.log('Connected to MySQL database'))
//   .catch((err) => console.error('Error connecting to MySQL database', err));

// const createTable = async (tableName, columns) => {
//   await dbWithDatabase.query(
//     `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`
//   );
// };

// createTable(
//   'users',
//   `user_id INT AUTO_INCREMENT PRIMARY KEY,
//          username VARCHAR(255) NOT NULL,
//          email VARCHAR(255) NOT NULL UNIQUE,
//          password VARCHAR(255) NOT NULL,
//          retypepassword VARCHAR(255) NOT NULL,
//          cnic_number VARCHAR(50) NOT NULL,
//          phone VARCHAR(20) NOT NULL UNIQUE,
//          role VARCHAR(50) NOT NULL DEFAULT 'user'`
// );

// createTable(
//   'complaints',
//   `complaint_id INT AUTO_INCREMENT PRIMARY KEY,
//          created_by VARCHAR(255) NOT NULL,
//          user_id INT,
//          complaint_description TEXT NOT NULL,
//          cnic_number VARCHAR(50) NOT NULL,
//          status VARCHAR(20) NOT NULL DEFAULT 'pending',
//          priority VARCHAR(10) DEFAULT 'medium',
//          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//          resolved_at TIMESTAMP NULL,
//          assigned_to VARCHAR(255) NULL,
//          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE`
// );

// createTable(
//   'payments',
//   `payment_id INT AUTO_INCREMENT PRIMARY KEY,
//          payment_link_id VARCHAR(255) NOT NULL,
//          payment_initiated_time TIMESTAMP NOT NULL,
//          payment_completed BOOLEAN DEFAULT FALSE,
//          payment_completed_time TIMESTAMP NULL,
//          user_id INT,
//          type VARCHAR(50) NOT NULL,
//          unique_id VARCHAR(255) NOT NULL,
//          amount DECIMAL(10, 2) NOT NULL,
//          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL`
// );

// module.exports = dbWithDatabase;

const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  port: 3306,
});

// Create database if not exists
db.query('CREATE DATABASE IF NOT EXISTS lyaridb')
  .then(() => console.log('Database created or already exists'))
  .catch((err) => console.error('Error creating database', err));

// Connect to the newly created or existing database
const dbWithDatabase = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'lyaridb',
  password: '',
  port: 3306,
});

// Test the connection
dbWithDatabase
  .getConnection()
  .then(() => console.log('Connected to MySQL database'))
  .catch((err) => console.error('Error connecting to MySQL database', err));

const createTable = async (tableName, columns) => {
  await dbWithDatabase.query(
    `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`
  );
};

createTable(
  'users',
  `user_id INT AUTO_INCREMENT PRIMARY KEY,
   username VARCHAR(255) NOT NULL,
   email VARCHAR(255) NOT NULL UNIQUE,
   password VARCHAR(255) NOT NULL,
   retypepassword VARCHAR(255) NOT NULL,
   cnic_number VARCHAR(50) NOT NULL,
   phone VARCHAR(20) NOT NULL UNIQUE,
   role VARCHAR(50) NOT NULL DEFAULT 'user'`
);

createTable(
  'complaints',
  `complaint_id INT AUTO_INCREMENT PRIMARY KEY,
   created_by VARCHAR(255) NOT NULL,
   user_id INT,
   complaint_description TEXT NOT NULL,
   cnic_number VARCHAR(50) NOT NULL,
   status VARCHAR(20) NOT NULL DEFAULT 'pending',
   priority VARCHAR(10) DEFAULT 'medium',
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   resolved_at TIMESTAMP NULL,
   assigned_to VARCHAR(255) NULL,
   FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE`
);

createTable(
  'payments',
  `payment_id INT AUTO_INCREMENT PRIMARY KEY,
   payment_link_id VARCHAR(255) NOT NULL,
   payment_initiated_time TIMESTAMP NOT NULL,
   payment_completed BOOLEAN DEFAULT FALSE,
   payment_completed_time TIMESTAMP NULL,
   user_id INT NULL,
   type VARCHAR(50) NOT NULL,
   unique_id VARCHAR(255) NOT NULL,
   amount DECIMAL(10, 2) NOT NULL,
   FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL`
);

createTable(
  'population',
  `id INT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   malePopulation INT NOT NULL,
   femalePopulation INT NOT NULL,
   totalPopulation INT NOT NULL`
);

createTable(
  'location_services',
    `id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    category VARCHAR(100),
    contact VARCHAR(100),
    latitude DOUBLE,
    longitude DOUBLE,
    hours TEXT,
    services TEXT,
    website TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
);

createTable(
  'uc_members',
  `id INT AUTO_INCREMENT PRIMARY KEY,
   uc_id INT NOT NULL,
   member_name VARCHAR(255) NOT NULL,
   address TEXT NOT NULL,
   phone_no VARCHAR(50) NOT NULL,
   img_url TEXT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
);

module.exports = dbWithDatabase;