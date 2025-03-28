# Parking Property Rental System

## Overview
The **Parking Property Rental System** is a platform that allows **property owners** to list their parking spaces for rent, while **customers** can search, book, and pay for parking spots. The system also includes **support ticket management**, **notifications**, and **dynamic pricing based on location tiers**.

## Features
- **User Management** (Admins, Property Owners, Customers)
- **Parking Property Listings** (with location, features, and pricing)
- **Vehicle Type Management** (Define supported vehicle types)
- **Dynamic Pricing Model** (Tier-based pricing for different city types)
- **Booking & Payment System** (Secure online transactions for reservations)
- **Support Ticket System** (Users can raise and track issues)
- **Notification System** (Alerts for bookings, payments, and updates)
- **General Settings Management** (Configure service charges, margins, etc.)
- **Image Storage with AWS S3** (Store and retrieve property images securely)
- **Razorpay Payment Integration** (Seamless payment processing for bookings)

## Technologies Used
- **Backend:** Node.js, NestJS, MongoDB
- **Cloud & Deployment:**  Vercel
- **Authentication:** JWT
- **Payments:** Integrated with Razorpay
- **Image Storage:** AWS S3 for storing property and user images

## Database Schema Summary
### 1. **Users** (`users` Collection)
Stores user data including profile, role, and addresses.

### 2. **Properties** (`properties` Collection)
Manages parking properties with location, features, and pricing based on city tiers.

### 3. **Vehicle Types** (`vehicle_types` Collection)
Defines different vehicle types allowed for parking.

### 4. **Bookings** (`bookings` Collection)
Handles customer reservations for parking spaces.

### 5. **Payments** (`payments` Collection)
Stores transaction details and payment status.

### 6. **Support Tickets** (`support_tickets` Collection)
Manages user-raised issues and their resolution status.

### 7. **Notifications** (`notifications` Collection)
Tracks and delivers system notifications.

### 8. **Features** (`features` Collection)
Master data defining parking-related features (e.g., CCTV, lighting, security guards).

### 9. **General Settings** (`general_settings` Collection)
Stores configurable service charges, margins, and other business rules.

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/srid5969/use-parking-appserver.git
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables (`.env` file):
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   AWS_S3_BUCKET=your_s3_bucket_name
   AWS_ACCESS_KEY=your_aws_access_key
   AWS_SECRET_KEY=your_aws_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_SECRET=your_razorpay_secret
   ```
4. Start the backend server:
   ```sh
   npm run start
   ```

## API Documentation
The API endpoints follow RESTful conventions and include:
- **User Authentication** (`/auth/signup`, `/auth/login`)
- **Property Management** (`/properties/create`, `/properties/:id`)
- **Booking & Payments** (`/bookings/create`, `/payments/verify`)
- **Support System** (`/support_tickets/create`, `/support_tickets/:id`)

## Future Enhancements
- Implement AI-based dynamic pricing suggestions
- Introduce blockchain-based smart contracts for secure bookings
- Expand to international locations with multi-currency support

---
For any queries, contact **sridharofficialmail@gmail.com**. 🚀

