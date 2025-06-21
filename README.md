# 🛒 E-commerce Mobile Phone Website (Java Spring Boot + React)

This website is responsible for:
* Displaying and managing mobile phone products
* User authentication (login, register, Google OAuth2)
* Admin management (roles, permissions, user control)
* Product reviews and wishlists
* Shopping cart and order placement
* Integration with VNPay for payment processing
* Image upload and file handling

## 💻 Tech Stack

### 🔧 Backend
* **Build tool:** Maven >= 3.9.5
* **Language:** Java 21
* **Framework:** Spring Boot 3.2.x
* **Database:** MySQL

### 🌐 Frontend
* **Language:** JavaScript (ES6+)
* **Framework:** React 18+
* **UI Library:** Material UI (MUI)
* **Routing:** React Router DOM
* **API Handling:** Axios
* **State Management:** useState, useEffect, custom hooks

## 📋 Prerequisites

Before you begin, make sure the following tools are installed on your machine:

### 🖥️ Backend Requirements
* **Java Development Kit (JDK):** Version 21 or higher  
  👉 [Download OpenJDK](https://adoptium.net/)
* **Apache Maven:** Version 3.9.5 or higher  
  👉 [Download Maven](https://maven.apache.org/download.cgi)
* **MySQL Server:** Version 8.0 or higher recommended  
  👉 [Download MySQL](https://dev.mysql.com/downloads/mysql/)
* **Database Management Tool (optional but recommended):**  
  Tools like [DBeaver](https://dbeaver.io/), [MySQL Workbench](https://www.mysql.com/products/workbench/), or PhpMyAdmin

### 🌐 Frontend Requirements
* **Node.js:** Version 18 or higher  
  👉 [Download Node.js](https://nodejs.org/)
* **npm:** Comes bundled with Node.js

### 📁 General
* **Git:** For cloning the repository  
  👉 [Download Git](https://git-scm.com/downloads)



## 🛠️ Setup Instructions

### 1. 📦 Clone the Repository

Start by cloning the project repository to your local machine:

```bash
git clone https://github.com/TrantrungDuong/e-commerce-website.git
```

### 2. Configure Environment Variables
Create a .env file by copying the example file. Then, update the .env file with your specific configuration, especially database connection details.

```bash
cp .env.example
```
Now, open .env in a text editor and fill in your details (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, etc.)

### 3. Database Setup

* Ensure your MySQL server is running.
* Create the database specified in your `.env` file (e.g., `mobile-shop`). You can use a command like `CREATE DATABASE mobile-shop;` in a MySQL client.
* The application uses Spring Data JPA. Schema creation (tables, etc.) might be handled automatically based on your `spring.jpa.hibernate.ddl-auto` property in `application.properties` or `application.yml` (common values are `update`, `validate`, `create`, `create-drop`). Check this configuration.

### Accessing the Backend of Application

## Start application
`mvn spring-boot:run`

## Build application
`mvn clean package`

Once the application is running successfully, open your web browser and navigate to:

**[http://localhost:8080](http://localhost:8080)**



# 🌐 Frontend Setup (React)

This is the frontend of the E-commerce Website built with **React.js**. 
It handles the user interface for browsing products, 
user authentication, 
cart management, 
admin controls, and more.



## 🛠️ Setup Instructions

### 1. Move to the Frontend directory

From the project root:

```bash
cd e-commerce-website/FE
```

### 📦 Install Dependencies
```bash
npm install
```

### ▶️ Run the Frontend Application
To start the React development server:
```bash
npm start
```

Once the frontend application is running successfully, open your web browser and navigate to:

**[http://localhost:3000](http://localhost:3000)*




