// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');

// const app = express();
// const PORT = process.env.PORT || 3001;

// app.use(bodyParser.json());
// app.use(cors({
//   origin: ["http://localhost:3000"],
//   credentials: true
// }));
// app.use(cookieParser());

// // MongoDB setup
// mongoose.connect('mongodb://localhost:27017/authentication', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => {
//   console.log("MongoDB connected");
// })
// .catch(err => {
//   console.error("MongoDB connection error:", err);
// });

// // Define User model
// const User = mongoose.model('User', {
//   username: String,
//   email: String,
//   password: String
// });

// // Signup route
// app.post('/auth/signup', async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     // Check if user with email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'User with this email already exists' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const newUser = new User({ username, email, password: hashedPassword });
//     await newUser.save();

//     return res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error('Error creating user:', error);
//     return res.status(500).json({ error: 'Server error' });
//   }
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(bodyParser.json());
// app.use(cors({
//   origin: ["http://localhost:3000"],
//   credentials: true
// }));
// app.use(cookieParser());

// // MongoDB setup
// mongoose.connect('mongodb://localhost:27017/authentication', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => {
//   console.log("MongoDB connected");
// })
// .catch(err => {
//   console.error("MongoDB connection error:", err);
// });

// // Define User model
// const User = mongoose.model('User', {
//   username: String,
//   email: String,
//   password: String
// });

// // Signup route
// app.post('/auth/signup', async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     // Check if user with email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'User with this email already exists' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const newUser = new User({ username, email, password: hashedPassword });
//     await newUser.save();

//     return res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error('Error creating user:', error);
//     return res.status(500).json({ error: 'Server error' });
//   }
// });

// // Login route
// app.post('/auth/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Check password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ error: 'Invalid password' });
//     }

//     // Set a cookie or JWT token here if needed
//     // For example: res.cookie('accessToken', generateAccessToken(user), { httpOnly: true });

//     return res.status(200).json({ message: 'Login successful' });
//   } catch (error) {
//     console.error('Error logging in:', error);
//     return res.status(500).json({ error: 'Server error' });
//   }
// });

// const handleSubmit = (e) => {
//   e.preventDefault();
//   Axios.post("http://localhost:3000/auth/forgot-password", {
//     email,
//   }).then(response => {
//       if(response.data.status) {
//         alert("Check your email for the reset password link.");
//         navigate('/login');
//       }
//   }).catch(err => {
//       console.log(err);
//   });
// };


// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:3001", // Allow requests from the frontend running on localhost:3001
  credentials: true
}));
app.use(cookieParser());

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/authentication', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB connected");
})
.catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1); // Exit the process if MongoDB connection fails
});

// Define User model
const userSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  role: String
});

const User = mongoose.model('User', userSchema);

// Handle preflight requests
app.options('/auth/signup', cors());

// Signup route
app.post('/auth/signup', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Login route
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Set a cookie or JWT token here if needed
    // For example: res.cookie('accessToken', generateAccessToken(user), { httpOnly: true });

    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Forgot password route
app.post('/auth/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Implement the logic to handle forgot password request here
    // Example: Send a reset password email to the user's email address
    // After successful sending, respond with a success message
    return res.status(200).json({ status: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending reset password email:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Signup page route (GET)
app.get('/signup', (req, res) => {
  res.send('Signup Page');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
