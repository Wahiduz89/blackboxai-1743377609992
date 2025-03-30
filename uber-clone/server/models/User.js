const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['rider', 'driver'],
    default: 'rider'
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please add a phone number'],
    match: [/^\+?[\d\s-]+$/, 'Please add a valid phone number']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String,
    default: 'default-avatar.png'
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
    default: 5
  },
  totalRides: {
    type: Number,
    default: 0
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  vehicleDetails: {
    type: {
      type: String,
      enum: ['car', 'bike', 'auto'],
      required: function() { return this.role === 'driver'; }
    },
    model: {
      type: String,
      required: function() { return this.role === 'driver'; }
    },
    number: {
      type: String,
      required: function() { return this.role === 'driver'; }
    }
  },
  documents: {
    license: {
      type: String,
      required: function() { return this.role === 'driver'; }
    },
    insurance: {
      type: String,
      required: function() { return this.role === 'driver'; }
    }
  }
}, {
  timestamps: true
});

// Create index for location-based queries
userSchema.index({ currentLocation: '2dsphere' });

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = mongoose.model('User', userSchema);