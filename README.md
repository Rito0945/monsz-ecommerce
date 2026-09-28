# MONSZ E-Commerce v4

Premium MERN clothing store with a real MongoDB-backed admin dashboard.

## Included in v4

- React + Vite storefront
- Express + MongoDB/Mongoose API
- JWT customer/admin authentication
- Admin dashboard
- Real product CRUD
- Product variant management by size/color/SKU
- Inventory management per SKU
- Local product image uploads (JPG/PNG/WebP/AVIF)
- Image deletion
- Order status management
- Dashboard statistics
- 40 seeded demo products
- Philippine PHP pricing and checkout structure
- Responsive MONSZ editorial design
- Journal removed from customer-facing navigation/routes

## Requirements

- Node.js 20+ recommended
- MongoDB 7/8 local OR MongoDB Atlas

## 1. Install dependencies

From this folder:

```powershell
npm install
npm run install-all
```

## 2. Configure MongoDB

### Option A — local MongoDB service

Create `server/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/monsz
JWT_SECRET=replace-with-a-long-random-secret
```

Make sure MongoDB is running.

### Option B — MongoDB Docker

If Docker Desktop is installed:

```powershell
docker compose up -d mongodb
```

Then use the same local `MONGO_URI` above.

### Option C — MongoDB Atlas

Create `server/.env` and set:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/monsz?retryWrites=true&w=majority
```

Replace the username, password and cluster host with the values from your Atlas connection string. Add your development IP address to Atlas Network Access.

## 3. Configure frontend

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 4. Seed MongoDB

```powershell
npm run seed
```

This creates:

### Admin

`admin@monsz.local`

`Admin123!`

### Customer

`customer@monsz.local`

`Customer123!`

These are development-only accounts. Change them before production.

## 5. Start the application

```powershell
npm run dev
```

Frontend:

`http://localhost:5173`

API:

`http://localhost:5000`

Health check:

`http://localhost:5000/api/health`

## 6. Admin Dashboard

Login with the admin account and visit:

`http://localhost:5173/admin`

Admin features:

- Dashboard statistics
- Product list
- Create product
- Edit product
- Delete product
- Publish/unpublish product
- Category and collection assignment
- Size and color configuration
- Automatic variant generation
- SKU management
- Variant prices
- Variant inventory
- Product image uploads
- Product image deletion
- Inventory search
- SKU stock editing
- Low-stock highlighting
- Order status management

## Image uploads

Uploaded product images are stored locally in:

`server/uploads/products/`

The API serves them through:

`http://localhost:5000/uploads/products/...`

For production, replace local storage with Cloudinary, S3, or another object-storage service. The product model already stores image URLs, so the migration can be done without changing the storefront model.

## MongoDB connection architecture

The server reads `MONGO_URI` from `server/.env`.

Default local URI:

`mongodb://127.0.0.1:27017/monsz`

The server connects before starting the API. If MongoDB is unavailable, the server reports the connection problem and starts the HTTP process so the error is visible in the terminal; database-dependent endpoints will not work until MongoDB is available.

## Important production changes

Before deploying:

- Change JWT_SECRET
- Change demo admin password
- Use HTTPS
- Move product images to object storage/CDN
- Configure a production MongoDB database
- Configure a real payment provider
- Configure transactional email
- Add backups
- Add audit logging for admin actions
- Add stricter production CORS
- Use secure cookies/token strategy appropriate to deployment
