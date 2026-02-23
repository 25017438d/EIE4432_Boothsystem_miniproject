/*
 * Cheng Tsz Hung (25017438D)
 * Awwab Hamam (22103907D)
 */
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const fs = require('fs');
const QRCode = require('qrcode');
const { Parser } = require('json2csv');
const http = require('http');
const crypto = require('crypto');
const { loadData, updateData, buildDefaultBooths } = require('./data/store');

const PORT = process.env.PORT || 3000;
const SALT_ROUNDS = 10;

const app = express();

// Initialize Socket.IO (disable only for Vercel serverless)
let server, io;
if (process.env.VERCEL) {
  // For Vercel serverless, don't use Socket.IO
  server = http.createServer(app);
  io = null;
} else {
  // For all other environments (including Render), use Socket.IO
  const { Server } = require('socket.io');
  server = http.createServer(app);
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Trust proxy for Render deployment
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(session({
  secret: process.env.SESSION_SECRET || 'carnival-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  }
}));

// Global middleware to set up template variables
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.messages = req.session.messages || [];
  res.locals.rememberedId = req.cookies.rememberUserId || '';
  res.locals.pageTitle = '';
  next();
});

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(403).send('Access denied. Admin only.');
  }
};

// Analytics Dashboard Route
app.get('/admin/analytics', isAdmin, (req, res) => {
  const dbData = loadData();
  console.log('Analytics route hit; data summary:', {
    bookingsCount: (dbData.bookings || []).length,
    boothsCount: ((dbData.events || []).flatMap(e => e.booths || [])).length,
    users: (dbData.users || []).length
  });

  const analyticsData = generateAnalyticsData(dbData);
  res.render('admin-analytics', {
    pageTitle: 'Analytics Dashboard',
    analyticsData: JSON.stringify(analyticsData)
  });
});

function generateAnalyticsData(data) {
  const bookings = data.bookings || [];
  const booths = (data.events || []).flatMap(e => e.booths || []);

  // Determine the window end: ceil to the next full hour (so graph ends at next hour)
  const now = new Date();
  const end = new Date(now);
  if (now.getMinutes() !== 0 || now.getSeconds() !== 0 || now.getMilliseconds() !== 0) {
    end.setMinutes(0, 0, 0);
    end.setHours(end.getHours() + 1);
  } else {
    // if exactly on the hour, keep the current hour as end
    end.setMinutes(0, 0, 0);
  }

  // Prepare hourly buckets ending at 'end' (24 labels, last label == end)
  const hourlyRevenue = new Array(24).fill(0);
  const boothOccupancy = booths.map(booth => {
    return bookings.some(booking => (booking.booths || booking.boothId ? (booking.booths || [booking.boothId]).includes(booth.id) : false));
  }).map(Boolean).map(v => v ? 1 : 0);

  bookings.forEach(booking => {
    const bookingTimeRaw = booking.bookingTime || booking.createdAt;
    if (!bookingTimeRaw) return;
    const bookingTime = new Date(bookingTimeRaw);
    // difference in hours from bookingTime to window end
    const hoursDiff = Math.floor((end - bookingTime) / (1000 * 60 * 60));
    if (hoursDiff >= 0 && hoursDiff < 24) {
      const idx = 23 - hoursDiff; // idx 23 = most recent bucket ending at 'end'
      hourlyRevenue[idx] += parseFloat(booking.price) || 0;
    }
  });

  // Build labels: 24 labels ending at the 'end' hour (HH:00)
  const timeLabels = [];
  for (let offset = 23; offset >= 0; offset--) {
    const d = new Date(end);
    d.setHours(end.getHours() - offset);
    timeLabels.push(String(d.getHours()).padStart(2, '0') + ':00');
  }

  return {
    timeLabels,
    revenue: hourlyRevenue,
    boothLabels: booths.map(b => `Booth ${b.number}`),
    occupancy: boothOccupancy,
    totalRevenue: bookings.reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0),
    totalBookings: bookings.length,
    occupancyRate: booths.length ? Math.round((boothOccupancy.filter(o => o === 1).length / booths.length) * 100) : 0
  };
}

// generateTimeLabels kept for backward compatibility; uses same windowing as generateAnalyticsData
function generateTimeLabels() {
  const now = new Date();
  const end = new Date(now);
  if (now.getMinutes() !== 0 || now.getSeconds() !== 0 || now.getMilliseconds() !== 0) {
    end.setMinutes(0, 0, 0);
    end.setHours(end.getHours() + 1);
  } else {
    end.setMinutes(0, 0, 0);
  }

  const labels = [];
  for (let offset = 23; offset >= 0; offset--) {
    const d = new Date(end);
    d.setHours(end.getHours() - offset);
    labels.push(String(d.getHours()).padStart(2, '0') + ':00');
  }
  return labels;
}

// Token signing for cross-device QR validation
const SCAN_SECRET = process.env.SCAN_SECRET || 'dev-scan-secret-change-me';
const TOKEN_TTL_SECONDS = parseInt(process.env.SCAN_TOKEN_TTL || '3600', 10); // default 1 hour
const SCANNER_API_KEY = process.env.SCANNER_API_KEY || 'dev-scanner-key';

function base64UrlEncode(buffer) {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return Buffer.from(str, 'base64');
}

function signToken(payloadObj) {
  const payload = JSON.stringify(payloadObj);
  const payloadB = Buffer.from(payload, 'utf8');
  const payloadB64 = base64UrlEncode(payloadB);
  const hmac = crypto.createHmac('sha256', SCAN_SECRET).update(payloadB64).digest('hex');
  return `${payloadB64}.${hmac}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;
  try {
    const expected = crypto.createHmac('sha256', SCAN_SECRET).update(payloadB64).digest('hex');
    // Use timingSafeEqual on buffers of equal length
    const expectedBuf = Buffer.from(expected, 'hex');
    const sigBuf = Buffer.from(sig, 'hex');
    if (expectedBuf.length !== sigBuf.length) return null;
    if (!crypto.timingSafeEqual(expectedBuf, sigBuf)) return null;
  } catch (err) {
    return null;
  }
  try {
    const payloadJson = base64UrlDecode(payloadB64).toString('utf8');
    const obj = JSON.parse(payloadJson);
    if (!obj.id || !obj.exp) return null;
    if (Date.now() > obj.exp) return null;
    return obj;
  } catch (err) {
    return null;
  }
}

// Socket.IO connection handling (only if Socket.IO is initialized)
if (io) {
  io.on('connection', (socket) => {
    console.log('Client connected to analytics');
    
    // Send initial data
    const data = loadData();
    const analyticsData = generateAnalyticsData(data);
    socket.emit('statsUpdate', analyticsData);
    
    // Update every minute
    const interval = setInterval(() => {
      const data = loadData();
      const analyticsData = generateAnalyticsData(data);
      socket.emit('statsUpdate', analyticsData);
    }, 60000);
    
    socket.on('disconnect', () => {
      clearInterval(interval);
      console.log('Client disconnected from analytics');
    });
  });
}

// Server initialization will occur later in the file

// Analytics API Routes
app.get('/api/analytics/data', isAdmin, (req, res) => {
  const data = loadData();
  const analyticsData = generateAnalyticsData(data);
  res.json(analyticsData);
});

// Admin Booths Editor Routes
app.get('/admin/booths/editor', isAdmin, (req, res) => {
  const eventId = req.query.eventId;
  const data = loadData();
  const event = data.events.find((e) => e.id === eventId) || data.events[0];
  res.render('admin-booth-editor', { pageTitle: 'Booth Map Editor', event, events: data.events });
});

// Save layout (positions + properties)
app.post('/admin/booths/save-layout', isAdmin, (req, res) => {
  try {
    const { eventId, booths } = req.body;
    const deletedIds = Array.isArray(req.body.deletedIds) ? req.body.deletedIds : [];
    const sections = Array.isArray(req.body.sections) ? req.body.sections : null;
    const deletedSections = Array.isArray(req.body.deletedSections) ? req.body.deletedSections : [];
    if (!eventId || !Array.isArray(booths)) return res.status(400).json({ success: false, error: 'Invalid payload' });

    // Basic validation: don't allow deleting a section that still has booths assigned
    const before = loadData();
    const eventBefore = before.events.find((e) => e.id === eventId);
    if (!eventBefore) return res.status(400).json({ success: false, error: 'Event not found' });
    if (deletedSections && deletedSections.length) {
      const conflict = eventBefore.booths.find((bb) => deletedSections.includes(String(bb.floor)));
      if (conflict) {
        return res.status(400).json({ success: false, error: 'Cannot delete section with existing booths. Reassign or remove booths first.' });
      }
    }

    updateData((data) => {
      const event = data.events.find((e) => e.id === eventId);
      if (!event) return data;

      // Persist sections if provided
      if (sections) {
        event.sections = sections.map((s) => ({ floor: String(s.floor), floorLabel: s.floorLabel || '' }));
        // propagate floorLabel to booths matching floor
        event.booths.forEach((bb) => {
          const sec = event.sections.find((ss) => String(ss.floor) === String(bb.floor));
          if (sec) bb.floorLabel = sec.floorLabel;
        });
      }

      // Handle updates and additions for booths
      booths.forEach((b) => {
        let booth = event.booths.find((bb) => bb.id === b.id);
        if (booth) {
          // update properties
          booth.x = typeof b.x === 'number' ? b.x : booth.x;
          booth.y = typeof b.y === 'number' ? b.y : booth.y;
          booth.label = typeof b.label === 'string' ? b.label : booth.label;
          booth.tier = typeof b.tier === 'string' ? b.tier : booth.tier;
          if (typeof b.price !== 'undefined' && b.price !== null && b.price !== '') {
            booth.price = Number(b.price) || booth.price;
          } else {
            delete booth.price;
          }
          booth.disabled = !!b.disabled;
          if (typeof b.floor !== 'undefined' && b.floor !== null) booth.floor = b.floor;
          if (typeof b.floorLabel !== 'undefined') booth.floorLabel = b.floorLabel;
        } else {
          // new booth: create minimal booth object (keep other fields optional)
          const newBooth = {
            id: b.id || `booth-${Date.now()}-${Math.round(Math.random() * 1e4)}`,
            label: b.label || `Booth ${Date.now()}`,
            tier: b.tier || 'standard',
            status: 'available',
            price: (typeof b.price !== 'undefined' && b.price !== null && b.price !== '') ? Number(b.price) : undefined,
            disabled: !!b.disabled,
            x: typeof b.x === 'number' ? b.x : undefined,
            y: typeof b.y === 'number' ? b.y : undefined,
            theme: b.theme || '',
            floor: (typeof b.floor !== 'undefined' && b.floor !== null) ? b.floor : (event.booths.length ? event.booths[0]?.floor : 1),
            floorLabel: b.floorLabel || (event.booths[0]?.floorLabel || '')
          };
          event.booths.push(newBooth);
        }
      });

      // Handle deletions of booths
      if (deletedIds && deletedIds.length) {
        event.booths = event.booths.filter((bb) => !deletedIds.includes(bb.id));
      }

      // Remove sections metadata if requested (already validated above)
      if (deletedSections && deletedSections.length) {
        event.sections = (event.sections || []).filter((s) => !deletedSections.includes(String(s.floor)));
      }

      event.updatedAt = new Date().toISOString();
      return data;
    });
    return res.json({ success: true });
  } catch (err) {
    console.error('Save layout error', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Admin helper: fix booths missing a status (sets them to 'available')
app.post('/admin/booths/fix-new-booths', isAdmin, (req, res) => {
  try {
    let updatedCount = 0;
    updateData((data) => {
      data.events.forEach((evt) => {
        evt.booths.forEach((b) => {
          if (!b.status) {
            b.status = 'available';
            updatedCount += 1;
          }
        });
      });
      return data;
    });
    res.json({ success: true, updated: updatedCount });
  } catch (err) {
    console.error('Fix new booths error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Reset manual positions for an event
app.post('/admin/booths/reset-layout', isAdmin, (req, res) => {
  try {
    const { eventId, reset } = req.body;
    if (!eventId) return res.status(400).json({ success: false });
    updateData((data) => {
      const event = data.events.find((e) => e.id === eventId);
      if (!event) return data;
      // remove x/y and price overrides so default layout/pricing applies
      event.booths.forEach((b) => {
        delete b.x;
        delete b.y;
        delete b.price;
      });
      event.updatedAt = new Date().toISOString();
      return data;
    });
    return res.json({ success: true });
  } catch (err) {
    console.error('Reset layout error', err);
    return res.status(500).json({ success: false });
  }
});

// CSV export for analytics
app.get('/api/analytics/export/csv', isAdmin, (req, res) => {
  try {
    const data = loadData();
    const analytics = generateAnalyticsData(data);

    // Build rows pairing time labels with revenue
    const rows = analytics.timeLabels.map((label, idx) => ({
      time: label,
      revenue: analytics.revenue[idx]
    }));

    const fields = ['time', 'revenue'];
    const parser = new Parser({ fields });
    const csv = parser.parse(rows);

    res.header('Content-Type', 'text/csv');
    res.attachment('booth-analytics.csv');
    res.send(csv);
  } catch (err) {
    console.error('CSV export error', err);
    res.status(500).send('Failed to generate CSV');
  }
});



function calculateRevenue(booths) {
  return booths.reduce((acc, booth) => {
    return acc + (booth.price || 0);
  }, 0);
}

function calculateOccupancy(booths) {
  return booths.map(booth => booth.isOccupied ? 1 : 0);
}



// Use memory storage for serverless, disk storage for local dev
const storage = process.env.VERCEL || process.env.NODE_ENV === 'production'
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
      }
    });

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP)'));
    }
  }
});

function addMessage(req, type, text) {
  if (!req.session.messages) {
    req.session.messages = [];
  }
  req.session.messages.push({ type, text });
}

function passwordMeetsPolicy(password) {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return minLength && hasUppercase && hasLowercase && hasNumber;
}

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'carnival-secret',
    resave: false,
    saveUninitialized: false
  })
);

function ensureAuthenticated(req, res, next) {
  if (!req.session.user) {
    addMessage(req, 'error', 'Please log in to continue.');
    return res.redirect('/login');
  }
  return next();
}

function ensureAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    addMessage(req, 'error', 'Administrator access required.');
    return res.redirect('/');
  }
  return next();
}

function getEventStats(event, bookings) {
  const eventBookings = bookings.filter((booking) => booking.eventId === event.id);
  const reservedBooths = event.booths.filter((booth) => booth.status === 'reserved').length;
  const availableBooths = event.booths.length - reservedBooths;
  const revenue = eventBookings.reduce((total, booking) => total + (booking.price || booking.totalPrice || 0), 0);

  return {
    totalBooths: event.booths.length,
    reservedBooths,
    availableBooths,
    revenue
  };
}

function findEvent(data, eventId) {
  return data.events.find((event) => event.id === eventId);
}

function normalize(text) {
  return (text || '').toLowerCase();
}

function matchesSearch(event, term) {
  if (!term) {
    return true;
  }
  const normalizedTerm = normalize(term);
  return [event.title, event.description, event.venue, event.time].some((field) =>
    normalize(field).includes(normalizedTerm)
  );
}

function filterEvents(events, filters) {
  const { q, date, venue } = filters;
  return events.filter((event) => {
    if (date && event.date !== date) {
      return false;
    }
    if (venue && normalize(event.venue) !== normalize(venue)) {
      return false;
    }
    if (q && !matchesSearch(event, q)) {
      return false;
    }
    return true;
  });
}

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.messages = req.session.messages || [];
  res.locals.rememberedId = req.cookies.rememberUserId || '';
  req.session.messages = [];
  res.locals.pageTitle = '';
  next();
});

async function ensureAdminUser() {
  try {
    const data = loadData();
    const adminExists = data.users.some((user) => user.userId === 'admin');

    if (!adminExists) {
      const passwordHash = await bcrypt.hash('adminpass', SALT_ROUNDS);
      data.users.push({
        userId: 'admin',
        passwordHash,
        nickname: 'Administrator',
        email: 'admin@example.com',
        gender: 'Other',
        birthdate: '1990-01-01',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      updateData(() => data);
    }
  } catch (error) {
    console.error('Error ensuring admin user:', error);
  }
}

app.get('/', (req, res) => {
  const data = loadData();
  const { q = '', date = '', venue = '' } = req.query;

  const eventsWithStats = data.events.map((event) => ({
    ...event,
    stats: getEventStats(event, data.bookings)
  }));

  const filteredEvents = filterEvents(eventsWithStats, { q, date, venue });

  const userBookings = req.session.user
    ? data.bookings
        .filter((booking) => booking.userId === req.session.user.userId)
        .map((booking) => ({
          ...booking,
          event: findEvent(data, booking.eventId)
        }))
    : [];

  const uniqueVenues = Array.from(new Set(data.events.map((event) => event.venue)));

  res.render('dashboard', {
    events: filteredEvents,
    filters: {
      q,
      date,
      venue
    },
    venues: uniqueVenues,
    bookings: userBookings
  });
});

app.get('/events/suggest', (req, res) => {
  const { term = '' } = req.query;
  const data = loadData();
  const normalizedTerm = normalize(term);

  const suggestions = data.events
    .map((event) => event.title)
    .filter((title, index, arr) => arr.indexOf(title) === index)
    .filter((title) => normalize(title).includes(normalizedTerm))
    .slice(0, 5);

  res.json({ suggestions });
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', upload.single('profileImage'), async (req, res) => {
  const { userId, password, confirmPassword, nickname, email, gender, birthdate, profileImageUrl } = req.body;

  if (!userId || !password || !confirmPassword || !nickname || !email) {
    addMessage(req, 'error', 'Please fill in all required fields.');
    return res.redirect('/register');
  }

  if (password !== confirmPassword) {
    addMessage(req, 'error', 'Passwords do not match.');
    return res.redirect('/register');
  }

  if (!passwordMeetsPolicy(password)) {
    addMessage(
      req,
      'error',
      'Password must be at least 8 characters and include uppercase, lowercase, and numbers.'
    );
    return res.redirect('/register');
  }

  const data = loadData();
  const duplicateUser = data.users.find((user) => user.userId === userId);

  if (duplicateUser) {
    addMessage(req, 'error', 'The chosen user ID is already taken.');
    return res.redirect('/register');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  let profileImage = profileImageUrl || null;
  if (req.file) {
    // In serverless, file is in memory buffer
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      // Convert buffer to base64 data URL for serverless environments
      const base64 = req.file.buffer.toString('base64');
      const mimeType = req.file.mimetype;
      profileImage = `data:${mimeType};base64,${base64}`;
    } else {
      // In local dev, use file path
      profileImage = `/uploads/${req.file.filename}`;
    }
  }

  data.users.push({
    userId,
    passwordHash,
    nickname,
    email,
    gender: gender || 'Prefer not to say',
    birthdate: birthdate || null,
    profileImage,
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  updateData(() => data);

  addMessage(req, 'success', 'Registration successful. Please log in.');
  return res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', {
    rememberedId: res.locals.rememberedId
  });
});

app.post('/login', async (req, res) => {
  const { userId, password, rememberId } = req.body;

  if (!userId || !password) {
    addMessage(req, 'error', 'Please provide both user ID and password.');
    return res.redirect('/login');
  }

  const data = loadData();
  const user = data.users.find((account) => account.userId === userId);

  if (!user) {
    addMessage(req, 'error', 'Invalid credentials.');
    return res.redirect('/login');
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    addMessage(req, 'error', 'Invalid credentials.');
    return res.redirect('/login');
  }

  req.session.user = {
    userId: user.userId,
    nickname: user.nickname,
    role: user.role
  };

  if (rememberId) {
    res.cookie('rememberUserId', userId, {
      httpOnly: false,
      maxAge: 30 * 24 * 60 * 60 * 1000
    });
  } else {
    res.clearCookie('rememberUserId');
  }

  // Save session before redirect to ensure it persists
  req.session.save((err) => {
    if (err) {
      console.error('Session save error:', err);
      addMessage(req, 'error', 'Login failed. Please try again.');
      return res.redirect('/login');
    }
    addMessage(req, 'success', `Welcome back, ${user.nickname}!`);
    return res.redirect('/');
  });
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.get('/profile', ensureAuthenticated, (req, res) => {
  const data = loadData();
  const user = data.users.find((item) => item.userId === req.session.user.userId);
  res.render('profile', { user });
});

app.post('/profile', ensureAuthenticated, async (req, res) => {
  const { nickname, email, gender, birthdate, profileImage, currentPassword, newPassword, confirmPassword } =
    req.body;

  updateData((data) => {
    const user = data.users.find((item) => item.userId === req.session.user.userId);

    if (!user) {
      return data;
    }

    if (!nickname || !email) {
      addMessage(req, 'error', 'Nickname and email are required.');
      return data;
    }

    user.nickname = nickname;
    user.email = email;
    user.gender = gender || user.gender;
    user.birthdate = birthdate || null;
    user.profileImage = profileImage || null;
    user.updatedAt = new Date().toISOString();

    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        addMessage(req, 'error', 'Current password is required to set a new password.');
        return data;
      }

      const validPassword = bcrypt.compareSync(currentPassword, user.passwordHash);

      if (!validPassword) {
        addMessage(req, 'error', 'Current password is incorrect.');
        return data;
      }

      if (newPassword !== confirmPassword) {
        addMessage(req, 'error', 'New passwords do not match.');
        return data;
      }

      if (!passwordMeetsPolicy(newPassword)) {
        addMessage(
          req,
          'error',
          'New password must be at least 8 characters and include uppercase, lowercase, and numbers.'
        );
        return data;
      }

      user.passwordHash = bcrypt.hashSync(newPassword, SALT_ROUNDS);
    }

    req.session.user.nickname = user.nickname;
    addMessage(req, 'success', 'Profile updated successfully.');
    return data;
  });

  res.redirect('/profile');
});

app.get('/booths', ensureAuthenticated, (req, res) => {
  const data = loadData();
  const firstEvent = data.events[0];

  if (!firstEvent) {
    addMessage(req, 'error', 'No event configured yet.');
    return res.redirect('/');
  }

  res.redirect(`/events/${firstEvent.id}/booths`);
});

app.get('/events/:eventId/booths', ensureAuthenticated, (req, res) => {
  const { eventId } = req.params;
  const data = loadData();
  const event = findEvent(data, eventId);

  if (!event) {
    addMessage(req, 'error', 'Unable to locate the requested event.');
    return res.redirect('/');
  }

  const pendingOrder = req.session.pendingOrder && req.session.pendingOrder.eventId === eventId ? req.session.pendingOrder : null;

  res.render('booths', {
    event,
    events: data.events,
    pendingOrder
  });
});

app.post('/booths/select', ensureAuthenticated, (req, res) => {
  const { eventId, boothIds } = req.body;
  const selectedIds = Array.isArray(boothIds)
    ? boothIds
    : (boothIds || '')
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);

  if (!eventId || selectedIds.length === 0) {
    addMessage(req, 'error', 'Please select at least one booth to continue.');
    return res.redirect('back');
  }

  const data = loadData();
  const event = findEvent(data, eventId);

  if (!event) {
    addMessage(req, 'error', 'Event not found for booking.');
    return res.redirect('/');
  }

  const booths = selectedIds
    .map((boothId) => event.booths.find((booth) => booth.id === boothId))
    .filter(Boolean);

  if (booths.length !== selectedIds.length) {
    addMessage(req, 'error', 'One or more selected booths could not be found.');
    return res.redirect(`/events/${event.id}/booths`);
  }

  const unavailable = booths.find((booth) => booth.status !== 'available' || booth.disabled);

  if (unavailable) {
    addMessage(req, 'error', `Booth ${unavailable.label} is not available. Please choose different booths.`);
    return res.redirect(`/events/${event.id}/booths`);
  }

  const pricingLookup = event.pricing || {
    premium: event.price || 800,
    standard: event.price || 600,
    economy: event.price || 480
  };

  const orderItems = booths.map((booth) => ({
    id: booth.id,
    label: booth.label,
    tier: booth.tier,
    price: pricingLookup[booth.tier] || pricingLookup.standard
  }));

  const totalPrice = orderItems.reduce((total, item) => total + item.price, 0);

  req.session.pendingOrder = {
    eventId: event.id,
    boothIds: selectedIds,
    items: orderItems,
    totalPrice
  };

  res.redirect('/payment');
});

app.get('/payment', ensureAuthenticated, (req, res) => {
  const pendingOrder = req.session.pendingOrder;

  if (!pendingOrder) {
    addMessage(req, 'error', 'Please select booths before proceeding to payment.');
    return res.redirect('/booths');
  }

  const data = loadData();
  const event = findEvent(data, pendingOrder.eventId);

  if (!event) {
    addMessage(req, 'error', 'Event not found for payment.');
    return res.redirect('/booths');
  }

  const booths = pendingOrder.boothIds
    .map((boothId) => event.booths.find((booth) => booth.id === boothId))
    .filter(Boolean);

  res.render('payment', {
    event,
    booths,
    order: pendingOrder
  });
});

app.post('/payment', ensureAuthenticated, (req, res) => {
  const pendingOrder = req.session.pendingOrder;

  if (!pendingOrder) {
    addMessage(req, 'error', 'No booths selected for payment.');
    return res.redirect('/booths');
  }

  const { cardNumber, nameOnCard, expiry, cvv } = req.body;

  if (!cardNumber || !nameOnCard || !expiry || !cvv) {
    addMessage(req, 'error', 'Please complete all payment fields.');
    return res.redirect('/payment');
  }

  const bookingId = `B${Date.now()}`;
  const ticketCode = `HKFC-${uuidv4().slice(0, 8).toUpperCase()}`;
  const userId = req.session.user.userId;
  const now = new Date().toISOString();

  let bookingCompleted = false;

  updateData((data) => {
    const event = findEvent(data, pendingOrder.eventId);

    if (!event) {
      return data;
    }

    const pricingLookup = event.pricing || {};

    const booths = pendingOrder.boothIds.map((boothId) => event.booths.find((booth) => booth.id === boothId));

    if (booths.some((booth) => !booth || booth.status !== 'available' || booth.disabled)) {
      return data;
    }

    booths.forEach((booth) => {
      booth.status = 'reserved';
    });

    const totalPrice = pendingOrder.items.reduce((total, item) => total + item.price, 0);

    data.bookings.push({
      id: bookingId,
      eventId: event.id,
      booths: pendingOrder.boothIds,
      userId,
      price: totalPrice,
      totalPrice,
      status: 'paid',
      ticketCode,
      createdAt: now,
      payment: {
        method: 'credit-card',
        maskedCard: `**** **** **** ${cardNumber.slice(-4)}`,
        nameOnCard,
        expiry
      },
      items: pendingOrder.items
    });

    if (!data.transactions) {
      data.transactions = [];
    }

    data.transactions.push({
      id: `txn-${Date.now()}`,
      bookingId,
      userId,
      eventId: event.id,
      amount: totalPrice,
      createdAt: now,
      details: {
        method: 'credit-card',
        maskedCard: `**** **** **** ${cardNumber.slice(-4)}`
      }
    });

    bookingCompleted = true;
    return data;
  });

  if (!bookingCompleted) {
    addMessage(req, 'error', 'Unable to complete payment. Please review your selection.');
    return res.redirect('/booths');
  }
  // Emit real-time analytics update so connected admin dashboards refresh immediately
  try {
    if (io) {
      io.emit('statsUpdate', generateAnalyticsData(loadData()));
    }
  } catch (err) {
    console.error('Failed to emit analytics update:', err);
  }

  delete req.session.pendingOrder;

  addMessage(req, 'success', 'Payment successful! Your booths are reserved.');
  res.redirect(`/ticket/${bookingId}`);
});

app.get('/ticket/:bookingId', ensureAuthenticated, (req, res) => {
  const { bookingId } = req.params;
  const data = loadData();
  const booking = data.bookings.find((item) => item.id === bookingId);

  if (!booking) {
    addMessage(req, 'error', 'Ticket not found.');
    return res.redirect('/');
  }

  if (req.session.user.role !== 'admin' && booking.userId !== req.session.user.userId) {
    addMessage(req, 'error', 'You do not have permission to view this ticket.');
    return res.redirect('/');
  }

  const event = findEvent(data, booking.eventId);
  const booths = booking.booths
    .map((boothId) => event?.booths.find((booth) => booth.id === boothId))
    .filter(Boolean);

  res.render('ticket', {
    event,
    booths,
    booking
  });
});

// Digital ticket QR view (shows QR code image for a booking)
app.get('/ticket/:bookingId/qr', ensureAuthenticated, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const data = loadData();
    const booking = data.bookings.find((b) => b.id === bookingId);
    if (!booking) {
      addMessage(req, 'error', 'Ticket not found.');
      return res.redirect('/');
    }

    if (req.session.user.role !== 'admin' && booking.userId !== req.session.user.userId) {
      addMessage(req, 'error', 'You do not have permission to view this ticket.');
      return res.redirect('/');
    }

    // Generate QR encoding the booking id (simple cross-device validation)
    const codeValue = booking.id;
    const qrCodeUrl = await QRCode.toDataURL(codeValue);

    const event = findEvent(data, booking.eventId);
    const user = data.users.find((u) => u.userId === booking.userId);

    console.log('Rendering digital-ticket:', {
      bookingId: booking.id,
      resLocalsPageTitle: res.locals ? res.locals.pageTitle : undefined
    });

    res.render('digital-ticket', {
      pageTitle: 'Digital Ticket',
      qrCodeUrl,
      boothNumber: (booking.booths || []).join(', '),
      eventDate: event?.date || '—',
      userName: user?.nickname || booking.userId
    });
  } catch (err) {
    console.error('Failed to render ticket QR:', err);
    addMessage(req, 'error', 'Unable to render digital ticket.');
    return res.redirect('/');
  }
});

app.get('/transactions', ensureAuthenticated, (req, res) => {
  const data = loadData();
  const userTransactions = (data.transactions || [])
    .filter((transaction) => transaction.userId === req.session.user.userId)
    .map((transaction) => {
      const booking = data.bookings.find((item) => item.id === transaction.bookingId);
      const event = findEvent(data, transaction.eventId);
      return {
        ...transaction,
        booking,
        event
      };
    });

  res.render('transactions', {
    transactions: userTransactions
  });
});

// DEV-only: return signed token and data URL for a booking (admin only)
app.get('/debug/token/:bookingId', ensureAdmin, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const data = loadData();
    const booking = data.bookings.find(b => b.id === bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    const payload = { id: booking.id, exp: Date.now() + TOKEN_TTL_SECONDS * 1000 };
    const token = signToken(payload);
    const dataUrl = await QRCode.toDataURL(token);
    res.json({ bookingId: booking.id, token, dataUrl });
  } catch (err) {
    console.error('debug token error', err);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/admin/transactions', ensureAdmin, (req, res) => {
  const data = loadData();
  const transactions = (data.transactions || []).map((transaction) => {
    const booking = data.bookings.find((item) => item.id === transaction.bookingId);
    const event = findEvent(data, transaction.eventId);
    const user = data.users.find((item) => item.userId === transaction.userId);
    return {
      ...transaction,
      booking,
      event,
      user
    };
  });

  res.render('admin-transactions', {
    transactions
  });
});

app.get('/admin/transactions/export', ensureAdmin, (req, res) => {
  const data = loadData();
  const transactions = (data.transactions || []).map((transaction) => {
    const booking = data.bookings.find((item) => item.id === transaction.bookingId);
    const event = findEvent(data, transaction.eventId);
    const user = data.users.find((item) => item.userId === transaction.userId);
    return {
      ...transaction,
      booking,
      event,
      user
    };
  });

  let csv = 'Transaction ID,Booking ID,Vendor ID,Vendor Name,Event,Date,Venue,Booths,Amount,Payment Method,Paid On\n';
  transactions.forEach((txn) => {
    const boothLabels = (txn.booking?.items || []).map((item) => item.label).join('; ') || (txn.booking?.booths || []).join('; ') || '—';
    const vendorName = txn.user?.nickname || txn.userId || 'Unknown';
    const eventTitle = txn.event?.title || 'Unknown Event';
    const eventDate = txn.event?.date || '—';
    const eventVenue = txn.event?.venue || '—';
    const amount = txn.amount || 0;
    const method = txn.details?.method || 'credit-card';
    const paidOn = new Date(txn.createdAt).toLocaleString();
    
    csv += `"${txn.id}","${txn.bookingId}","${txn.userId}","${vendorName}","${eventTitle}","${eventDate}","${eventVenue}","${boothLabels}","${amount}","${method}","${paidOn}"\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=transactions-export.csv');
  res.send(csv);
});

app.get('/admin/users', ensureAdmin, (req, res) => {
  const data = loadData();
  const users = data.users.map((user) => {
    const userBookings = data.bookings.filter((booking) => booking.userId === user.userId);
    const totalSpent = userBookings.reduce((sum, booking) => sum + (booking.totalPrice || booking.price || 0), 0);
    return {
      ...user,
      bookingCount: userBookings.length,
      totalSpent
    };
  });

  res.render('admin-users', {
    users
  });
});

app.get('/api/booths/status', ensureAuthenticated, (req, res) => {
  const { eventId } = req.query;
  const data = loadData();
  const event = eventId ? findEvent(data, eventId) : data.events[0];

  if (!event) {
    return res.json({ error: 'Event not found' });
  }

  const boothStatus = event.booths.map((booth) => {
    let buyerInfo = null;
    if (booth.status === 'reserved') {
      const booking = data.bookings.find(
        (b) => b.eventId === event.id && (b.booths || []).includes(booth.id)
      );
      if (booking) {
        const user = data.users.find((u) => u.userId === booking.userId);
        buyerInfo = {
          userId: booking.userId,
          nickname: user?.nickname || booking.userId,
          email: user?.email || '—',
          ticketCode: booking.ticketCode,
          bookedAt: booking.createdAt
        };
      }
    }

    return {
      id: booth.id,
      label: booth.label,
      status: booth.status,
      disabled: booth.disabled,
      tier: booth.tier,
      buyerInfo
    };
  });

  res.json({ booths: boothStatus });
});

app.get('/admin/booths', ensureAdmin, (req, res) => {
  const { eventId } = req.query;
  const data = loadData();
  const selectedEvent = eventId ? findEvent(data, eventId) : data.events[0];

  if (!selectedEvent) {
    addMessage(req, 'error', 'No event configured.');
    return res.redirect('/');
  }

  res.render('admin-booths', {
    event: selectedEvent,
    events: data.events
  });
});

// Admin scanner page
app.get('/admin/scanner', ensureAdmin, (req, res) => {
  res.render('qr-scanner', { pageTitle: 'QR Scanner' });
});

// Ticket validation endpoint used by scanner
// Allow any authenticated user to validate (scanner may run on an authenticated admin device)
app.post('/api/tickets/validate', (req, res) => {
  try {
    const { token, ticketCode: rawTicketCode } = req.body || {};

    // If a signed token is provided, validate it (kept for backward compatibility)
    if (token) {
      const payload = verifyToken(token);
      if (!payload) return res.json({ valid: false, message: 'Invalid or expired token' });
      const data = loadData();
      const booking = (data.bookings || []).find(b => b.id === payload.id);
      if (!booking) return res.json({ valid: false, message: 'Ticket not found' });
      if (booking.checkedIn) return res.json({ valid: false, message: 'Ticket already used' });
      booking.checkedIn = true;
      updateData(() => data);
      const event = findEvent(data, booking.eventId);
      const user = data.users.find(u => u.userId === booking.userId);
      return res.json({
        valid: true,
        ticketInfo: {
          bookingId: booking.id,
          boothNumber: (booking.booths || []).join(', '),
          userName: user?.nickname || booking.userId,
          event: event?.title || 'Event'
        }
      });
    }

    // No token: simple booking-id or ticketCode flow — allow cross-device scans without auth.
    let { ticketCode } = { ticketCode: rawTicketCode };
    if (!ticketCode) return res.status(400).json({ valid: false, message: 'Missing ticket code' });

    // If a full URL was scanned, try to extract booking id or ticket code.
    // Common patterns: full URL ending with /ticket/:id/qr, query param like ?code=..., or containing the ticket code string (HKFC-...)
    // normalize scanned input: if it's a URL, pick last path segment or code query param
    if (typeof ticketCode === 'string') {
      try {
        const url = new URL(ticketCode);
        const qp = url.searchParams;
        const possible = qp.get('ticket') || qp.get('code') || qp.get('ticketCode') || qp.get('t');
        if (possible) {
          ticketCode = possible;
        } else {
          const parts = url.pathname.split('/').filter(Boolean);
          if (parts.length) ticketCode = parts[parts.length - 1];
        }
      } catch (err) {
        // not a full URL, keep original
      }
      // Trim whitespace
      ticketCode = ticketCode.trim();
    }

    const data = loadData();
    const booking = (data.bookings || []).find(b => ((b.ticketCode && b.ticketCode.toString() === ticketCode.toString()) || b.id === ticketCode.toString()));
    if (!booking) return res.json({ valid: false, message: 'Ticket not found' });

    if (booking.checkedIn) {
      return res.json({ valid: false, message: 'Ticket already used' });
    }

    // mark as checked-in
    booking.checkedIn = true;
    updateData(() => data);

    const event = findEvent(data, booking.eventId);
    const user = data.users.find(u => u.userId === booking.userId);

    return res.json({
      valid: true,
      ticketInfo: {
        bookingId: booking.id,
        boothNumber: (booking.booths || []).join(', '),
        userName: user?.nickname || booking.userId,
        event: event?.title || 'Event'
      }
    });
  } catch (err) {
    console.error('Ticket validation error', err);
    return res.status(500).json({ valid: false, message: 'Server error validating ticket' });
  }
});

app.post('/admin/booths/reset', ensureAdmin, (req, res) => {
  const { eventId } = req.body;

  updateData((data) => {
    const event = findEvent(data, eventId) || data.events[0];
    if (event) {
      event.booths = buildDefaultBooths();
      data.bookings = data.bookings.filter((booking) => booking.eventId !== event.id);
      if (data.transactions) {
        data.transactions = data.transactions.filter((transaction) => transaction.eventId !== event.id);
      }
    }
    return data;
  });

  addMessage(req, 'success', 'Booth map has been reset and bookings cleared.');
  res.redirect(`/admin/booths${eventId ? `?eventId=${eventId}` : ''}`);
});

app.post('/admin/booths/toggle', ensureAdmin, (req, res) => {
  const { eventId, boothId, disabled } = req.body;

  updateData((data) => {
    const event = findEvent(data, eventId);
    if (!event) {
      return data;
    }

    const booth = event.booths.find((item) => item.id === boothId);
    if (!booth) {
      return data;
    }

    booth.disabled = disabled === 'true';
    if (booth.disabled) {
      booth.status = 'unavailable';
    } else if (booth.status === 'unavailable') {
      booth.status = 'available';
    }

    return data;
  });

  addMessage(req, 'success', `Booth ${boothId} updated successfully.`);
  res.redirect(`/admin/booths${eventId ? `?eventId=${eventId}` : ''}`);
});

app.post('/admin/booths/status', ensureAdmin, (req, res) => {
  const { eventId, boothId, status } = req.body;

  updateData((data) => {
    const event = findEvent(data, eventId);
    if (!event) {
      return data;
    }

    const booth = event.booths.find((item) => item.id === boothId);
    if (!booth) {
      return data;
    }

    if (['available', 'reserved'].includes(status)) {
      booth.status = status;
    }

    return data;
  });

  addMessage(req, 'success', `Booth ${boothId} status updated.`);
  res.redirect(`/admin/booths${eventId ? `?eventId=${eventId}` : ''}`);
});

app.get('/admin/events', ensureAdmin, (req, res) => {
  const { q = '' } = req.query;
  const data = loadData();

  const filteredEvents = filterEvents(data.events, { q }).map((event) => ({
    ...event,
    stats: getEventStats(event, data.bookings)
  }));

  res.render('admin-events', {
    events: filteredEvents,
    searchTerm: q
  });
});

app.post('/admin/events', ensureAdmin, (req, res) => {
  const { title, description, date, time, venue, coverImage, premiumPrice, standardPrice, economyPrice } = req.body;

  if (!title || !description || !date || !time || !venue) {
    addMessage(req, 'error', 'All event fields are required.');
    return res.redirect('/admin/events');
  }

  updateData((data) => {
    data.events.push({
      id: `event-${Date.now()}`,
      title,
      description,
      date,
      time,
      venue,
      coverImage: coverImage || null,
      pricing: {
        premium: Number(premiumPrice) || 820,
        standard: Number(standardPrice) || 620,
        economy: Number(economyPrice) || 480
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      booths: buildDefaultBooths()
    });

    return data;
  });

  addMessage(req, 'success', 'New event added successfully.');
  res.redirect('/admin/events');
});

app.post('/admin/events/:eventId', ensureAdmin, (req, res) => {
  const { eventId } = req.params;
  const { title, description, date, time, venue, coverImage, premiumPrice, standardPrice, economyPrice } = req.body;

  updateData((data) => {
    const event = findEvent(data, eventId);
    if (!event) {
      return data;
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.venue = venue || event.venue;
    event.coverImage = coverImage || event.coverImage;
    event.pricing = {
      premium: Number(premiumPrice) || event.pricing.premium,
      standard: Number(standardPrice) || event.pricing.standard,
      economy: Number(economyPrice) || event.pricing.economy
    };
    event.updatedAt = new Date().toISOString();

    return data;
  });

  addMessage(req, 'success', 'Event updated successfully.');
  res.redirect('/admin/events');
});

// Initialize admin user
ensureAdminUser();

// Export for Vercel serverless
module.exports = app;

// Start server (skip only for Vercel serverless)
if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`Hong Kong Food Carnival system running at http://localhost:${PORT}`);
  });
}

