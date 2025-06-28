const mysql = require("mysql2/promise");
const dbWithDatabase = require("./db");
const bcrypt = require("bcryptjs");

const seedAdminUser = async () => {
  console.log("Starting admin user seeding process...");

  try {
    console.log("Connected to the database successfully.");

    const adminUser = {
      username: "admin",
      email: "admin@example.com",
      password: "securepassword",
      retypepassword: "securepassword",
      cnic_number: "42101-1234567-8",
      phone: "03001234567",
      role: "admin",
    };

    console.log("Checking if the admin user already exists...");

    const [rows] = await dbWithDatabase.execute(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [adminUser.email]
    );

    if (rows.length > 0) {
      console.log("Admin user already exists. Skipping seeding.");
      console.log("Existing admin user details:", rows[0]);
      return;
    }

    console.log(
      "No existing admin user found. Proceeding to seed admin user..."
    );

    const hashedPassword = await bcrypt.hash(adminUser.password, 10); // Salt rounds = 10
    const hashedRetypePassword = await bcrypt.hash(
      adminUser.retypepassword,
      10
    );

    // Insert admin user into the table
    const [result] = await dbWithDatabase.execute(
      `INSERT INTO users (username, email, password, retypepassword, cnic_number, phone, role) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        adminUser.username,
        adminUser.email,
        hashedPassword, // Use hashed password here
        hashedRetypePassword, // Use hashed password here
        adminUser.cnic_number,
        adminUser.phone,
        adminUser.role,
      ]
    );

    console.log("Admin user seeded successfully.");
    console.log("Inserted admin user ID:", result.insertId);
  } catch (error) {
    console.error("Error seeding admin user:", error.message);
  }
  // } finally {
  //   console.log("Closing the database connection.");
  // }

  console.log("Admin user seeding process completed.");
};

// Call the function
seedAdminUser();
