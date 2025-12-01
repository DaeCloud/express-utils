# Express Utils

A lightweight utility toolkit for Express that provides:

- Consistent JSON response formatting  
- Unified success + error response helpers  
- Custom error classes  
- Automatic error mapping with a global handler  
- Async wrapper to avoid try/catch spam  
- Easy drop-in middleware

Perfect for keeping all your Express projects clean, consistent, and maintainable.

---

## 🚀 Features

- ✔️ Standardized API response structure  
- ✔️ Custom errors (`NotFoundError`, `ValidationError`, etc.)  
- ✔️ Response helpers (`res.data()` & `res.error()`)  
- ✔️ Global error handler with smart mapping  
- ✔️ Async handler wrapper (`asyncHandler`)  
- ✔️ Zero dependencies  
- ✔️ CommonJS compatible  

---

## 📦 Installation

Add this to your local `.npmrc`:

```
@DaeCloud:registry=https://npm.pkg.github.com
```

Then install:

```
npm install @DaeCloud/express-utils
```

---

## 🧩 Usage

### **Basic Setup**

```js
const express = require("express");
const {
    responseMiddleware,
    errorHandler
} = require("@DaeCloud/express-utils");

const app = express();

app.use(express.json());
app.use(responseMiddleware);
```

---

### **Sending Success Responses**

```js
app.get("/status", (req, res) => {
    res.data({ service: "ok" });
});
```

Produces:

```json
{
  "data": { "service": "ok" },
  "meta": {
    "timestamp": "2025-01-01T12:00:00.000Z",
    "endpoint": "/status",
    "method": "GET",
    "responseCode": 200
  }
}
```

---

### **Throwing Custom Errors**

```js
const { NotFoundError } = require("@DaeCloud/express-utils");

app.get("/user/:id", (req, res) => {
    throw new NotFoundError("User does not exist");
});
```

Mapped automatically by the global handler.

---

### **Async Handlers Without try/catch**

```js
const { asyncHandler } = require("@DaeCloud/express-utils");

app.get("/async", asyncHandler(async (req, res) => {
    const data = await someAsyncCall();
    res.data(data);
}));
```

---

### **Global Error Handler (Always Last)**

```js
app.use(errorHandler);
```

---

## 🛠️ Custom Errors Included

| Class              | Default Message        | Default Code          | Status |
|-------------------|------------------------|------------------------|--------|
| `ValidationError` | Invalid or missing data | `VALIDATION_ERROR`    | 422    |
| `NotFoundError`   | Resource not found      | `NOT_FOUND`           | 404    |
| `UnauthorizedError` | Authentication required | `UNAUTHORIZED`      | 401    |
| `ForbiddenError`  | Access denied           | `FORBIDDEN`           | 403    |

You can throw them directly:

```js
throw new ValidationError("Email is required");
```

---

## 📁 File Structure of This Package

```
express-utils/
│
├─ index.js
├─ package.json
└─ README.md
```

Everything is exposed cleanly:

```js
const {
  ApiResponse,
  responseMiddleware,
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  errorHandler,
  asyncHandler
} = require("@DaeCloud/express-utils");
```

---

## 🧪 Example Project Template

```js
const express = require("express");
const utils = require("@DaeCloud/express-utils");

const app = express();

app.use(express.json());
app.use(utils.responseMiddleware);

app.get("/", (req, res) => {
    res.data({ message: "Hello world" });
});

app.get("/error", () => {
    throw new utils.ForbiddenError("Not allowed here");
});

app.use(utils.errorHandler);

app.listen(3000, () => console.log("Server running on port 3000"));
```

---

## 🏷️ Versioning

Follow semantic versioning:

- `MAJOR`: Breaking changes  
- `MINOR`: New features  
- `PATCH`: Fixes  

Publishing to GitHub Packages is as simple as:

```
npm publish
```

---

## 📖 License

MIT License

---
