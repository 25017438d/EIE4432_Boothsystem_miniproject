/*
 * Cheng Tsz Hung (25017438D)
 * Awwab Hamam (22103907D)
 */
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, 'db.json');

const defaultThemes = {
  wellness: 'Health Preserving Zone',
  snacks: 'Leisure Food Zone',
  global: 'International Flavors',
  organic: 'Organic Delights',
  desserts: 'Dessert Boulevard',
  beverages: 'Beverage Hub'
};

const boothLayouts = [
  {
    floor: '1',
    floorLabel: 'Harbour View Hall',
    rows: ['A', 'B', 'C', 'D', 'E'],
    tierByRow: {
      A: 'premium',
      B: 'premium',
      C: 'standard',
      D: 'economy',
      E: 'economy'
    },
    themeByRow: {
      A: defaultThemes.wellness,
      B: defaultThemes.snacks,
      C: defaultThemes.global,
      D: defaultThemes.organic,
      E: defaultThemes.beverages
    }
  },
  {
    floor: '2',
    floorLabel: 'Sky Garden Pavilion',
    rows: ['F', 'G', 'H', 'J', 'K'],
    tierByRow: {
      F: 'premium',
      G: 'standard',
      H: 'standard',
      J: 'economy',
      K: 'economy'
    },
    themeByRow: {
      F: defaultThemes.desserts,
      G: defaultThemes.global,
      H: defaultThemes.snacks,
      J: defaultThemes.organic,
      K: defaultThemes.beverages
    }
  }
];

function buildDefaultBooths() {
  const booths = [];

  boothLayouts.forEach((layout) => {
    layout.rows.forEach((row) => {
      for (let i = 1; i <= 4; i += 1) {
        const id = `${row}${i}`;
        booths.push({
          id,
          label: id,
          status: 'available',
          disabled: false,
          tier: layout.tierByRow[row] || 'standard',
          floor: layout.floor,
          floorLabel: layout.floorLabel,
          section: `${row}-Section`,
          theme: layout.themeByRow[row] || defaultThemes.global
        });
      }
    });
  });

  return booths;
}

function applyBoothDefaults(booth) {
  return {
    ...booth,
    disabled: typeof booth.disabled === 'boolean' ? booth.disabled : false,
    tier: booth.tier || 'standard',
    floorLabel: booth.floorLabel || boothLayouts.find((layout) => layout.floor === booth.floor)?.floorLabel || 'Main Hall'
  };
}

function ensureDefaults(data) {
  const now = new Date().toISOString();

  if (!data.users) {
    data.users = [];
  }

  data.users = data.users.map((user) => ({
    ...user,
    nickname: user.nickname || user.userId,
    email: user.email || `${user.userId}@example.com`,
    gender: user.gender || 'Prefer not to say',
    birthdate: user.birthdate || null,
    role: user.role || 'user',
    profileImage: user.profileImage || null,
    createdAt: user.createdAt || now,
    updatedAt: user.updatedAt || now
  }));

  if (!data.events || data.events.length === 0) {
    data.events = [
      {
        id: 'event-1',
        title: 'Hong Kong Food Carnival 2025',
        description:
          'Discover themed culinary zones, wellness experiences, and artisanal treats across our harbour-view halls.',
        date: '2025-12-12',
        time: '10:00 - 21:00',
        venue: 'AsiaWorld-Expo Halls 5-7',
        coverImage:
          'https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=1200&q=80',
        pricing: {
          premium: 820,
          standard: 620,
          economy: 480
        },
        createdAt: now,
        updatedAt: now,
        booths: buildDefaultBooths()
      },
      {
        id: 'event-2',
        title: 'Night Bazaar Street Feast',
        description:
          'An evening showcase of fusion street food, live entertainment, and interactive culinary workshops.',
        date: '2026-03-18',
        time: '17:00 - 23:00',
        venue: 'West Kowloon Cultural District',
        coverImage:
          'https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1200&q=80',
        pricing: {
          premium: 760,
          standard: 560,
          economy: 420
        },
        createdAt: now,
        updatedAt: now,
        booths: buildDefaultBooths().map((booth, index) => ({
          ...booth,
          id: `${booth.id}-B`,
          label: `${booth.label}-B`,
          theme: index % 2 === 0 ? defaultThemes.desserts : defaultThemes.global
        }))
      }
    ];
  } else {
    data.events = data.events.map((event, eventIndex) => ({
      ...event,
      coverImage:
        event.coverImage ||
        (eventIndex === 0
          ? 'https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=1200&q=80'
          : 'https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1200&q=80'),
      pricing: event.pricing || {
        premium: event.price ? Math.round(event.price * 1.2) : 800,
        standard: event.price || 600,
        economy: event.price ? Math.round(event.price * 0.8) : 480
      },
      booths: (event.booths || buildDefaultBooths()).map(applyBoothDefaults),
      updatedAt: event.updatedAt || event.createdAt || now
    }));
  }

  if (!data.bookings) {
    data.bookings = [];
  }

  data.bookings = data.bookings.map((booking) => ({
    ...booking,
    booths: booking.booths || (booking.boothId ? [booking.boothId] : []),
    status: booking.status || 'paid'
  }));

  if (!data.transactions) {
    data.transactions = data.bookings.map((booking) => ({
      id: `txn-${booking.id}`,
      bookingId: booking.id,
      userId: booking.userId,
      amount: booking.price,
      createdAt: booking.createdAt,
      details: {
        method: booking.payment?.method || 'credit-card',
        maskedCard: booking.payment?.maskedCard || '****'
      },
      eventId: booking.eventId
    }));
  } else {
    data.transactions = data.transactions.map((transaction) => {
      const booking = data.bookings.find((item) => item.id === transaction.bookingId);
      return {
        ...transaction,
        amount:
          typeof transaction.amount === 'number'
            ? transaction.amount
            : booking?.price || booking?.totalPrice || transaction.amount || 0,
        eventId: transaction.eventId || booking?.eventId || null,
        details: transaction.details || {
          method: booking?.payment?.method || 'credit-card',
          maskedCard: booking?.payment?.maskedCard || '****'
        }
      };
    });
  }

  return data;
}

// In-memory data store for serverless environments
let memoryStore = null;

function loadData() {
  // For serverless (Vercel), use in-memory store
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    if (!memoryStore) {
      // Try to load initial data from db.json if it exists
      if (fs.existsSync(DATA_PATH)) {
        try {
          const fileContents = fs.readFileSync(DATA_PATH, 'utf-8');
          memoryStore = ensureDefaults(JSON.parse(fileContents || '{}'));
        } catch (error) {
          console.error('Failed to parse db.json, using defaults', error);
          memoryStore = ensureDefaults({});
        }
      } else {
        memoryStore = ensureDefaults({});
      }
    }
    return memoryStore;
  }

  // Local development - use file system
  if (!fs.existsSync(DATA_PATH)) {
    const initialData = ensureDefaults({});
    fs.writeFileSync(DATA_PATH, JSON.stringify(initialData, null, 2));
    return initialData;
  }

  const fileContents = fs.readFileSync(DATA_PATH, 'utf-8');
  try {
    const parsed = JSON.parse(fileContents || '{}');
    return ensureDefaults(parsed);
  } catch (error) {
    console.error('Failed to parse db.json, recreating with defaults', error);
    const initialData = ensureDefaults({});
    fs.writeFileSync(DATA_PATH, JSON.stringify(initialData, null, 2));
    return initialData;
  }
}

function saveData(data) {
  // For serverless, update in-memory store
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    memoryStore = data;
    return;
  }
  
  // Local development - write to file
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

function updateData(mutator) {
  const data = loadData();
  const updated = mutator(data) || data;
  saveData(updated);
  return updated;
}

module.exports = {
  loadData,
  saveData,
  updateData,
  DATA_PATH,
  buildDefaultBooths
};

