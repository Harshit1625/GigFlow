const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const { User } = require("./models/User");
const { Gigs } = require("./models/Gigs");
const { Bids } = require("./models/Bids");
const { isAuth } = require("../backend/middlewares/isAuth");


const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connection established!");

  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
});

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(express.json(), cookieParser());

const signedKey = process.env.JWT_SECRET_KEY

//-------------------------- Routes ------------------------------

// Login/Signup

app.post("/api/auth/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, signedKey, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "Signup Successful" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, signedKey, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login Successful" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

//Logout
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  return res.status(200).json({ message: "Logged out successfully" });
});

//Profile
app.get("/api/auth/profile", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(500).json({ message: "User not logged-in!" });

    const decoded = jwt.verify(token, signedKey);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not exists!" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ======================== Gigs ==================================

app.get("/api/gigs", isAuth, async (req, res) => {
  try {
    const { search } = req.query;
    let gigs;
    if (search) {
      gigs = await Gigs.find({
        title: { $regex: search, $options: "i" },
      });
    } else {
      gigs = await Gigs.find();
    }

    res.status(200).json(gigs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/gigs", isAuth, async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = req.user;

    await Gigs.create({
      title,
      description,
      budget,
      ownerId: user._id,
    });

    const gigs = await Gigs.find();

    io.emit("gigs_added", gigs);

    res.status(200).json({ message: "Gig Created!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/appliedgigs", isAuth, async (req, res) => {
  try {
    const user = req.user;

    const bids = await Bids.find({ freelancerId: user._id });

    const gigIds = bids.map((bid) => bid.gigId);

    const gigs = await Gigs.find({ _id: { $in: gigIds } });

    if (!gigs.length) {
      return res.status(404).json({ message: "No applied gigs found" });
    }

    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/postedgigs", isAuth, async (req, res) => {
  try {
    const user = req.user;

    const gigs = await Gigs.find({ ownerId: user._id });

    if (!gigs.length) {
      return res.status(404).json({ message: "No gigs posted yet" });
    }

    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//========================================== Bids =========================================

app.get("/api/bids/:gigId", isAuth, async (req, res) => {
  try {
    const { gigId } = req.params;

    if (!gigId) return res.status(500).json({ message: "GidId is needed!" });

    const gig = await Gigs.findById(gigId);
    const bids = await Bids.find({ gigId });

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    res.status(200).json({ gig, bids });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/bids", isAuth, async (req, res) => {
  try {
    const { gigId, bidAmount, message } = req.body;
    console.log(gigId);
    const user = req.user;

    await Bids.create({
      gigId,
      freelancerId: user._id,
      bidAmount,
      message,
    });

    const bids = await Bids.find({ gigId });
    const data = { bids, gigId };
    io.emit("bids_updated", data);

    res.status(200).json({ message: "Bid Created!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Hire
app.patch("/api/bids/:bidId/hire", isAuth, async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { bidId } = req.params;

    const bid = await Bids.findById(bidId).session(session);
    if (!bid) {
      throw new Error("Bid not found");
    }

    const gig = await Gigs.findById(bid.gigId).session(session);
    if (!gig) {
      throw new Error("Gig not found");
    }

    if (gig.status === "assigned") {
      throw new Error("Gig already assigned");
    }

    await Bids.updateMany(
      { gigId: gig._id },
      { status: "rejected" },
      { session }
    );

    bid.status = "hired";
    await bid.save({ session });

    gig.status = "assigned";
    await gig.save({ session });

    const user = await User.findById(bid.freelancerId).session(session);
    const bids = await Bids.find({ gigId: gig._id }).session(session);
    console.log(bids);
    const dataBids = { bids, gigId: gig._id };

    //for Gig page when we update the status
    io.emit("bid_status", dataBids);

    const data = {
      user,
      gig,
    };

    //for NOTIFICATION
    io.emit("hired", data);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Request Completed" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({ message: error.message });
  }
});

//Server Listening

httpServer.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Db Connected"));
  console.log("Server Running on PORT: 4000");
});
