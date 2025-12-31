import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "..//middlewares/errorMiddleware.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already Registered!", 400));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Patient",
  });
  generateToken(user, "User Registered!", 200, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;
  if (!email || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password & Confirm Password Do Not Match!", 400)
    );
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }
  if (role !== user.role) {
    return next(new ErrorHandler(`User Not Found With This Role!`, 400));
  }
  generateToken(user, "Login Successfully!", 201, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("Admin With This Email Already Exists!", 400));
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Admin",
  });
  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }
  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    doctorDepartment,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password ||
    !doctorDepartment ||
    !docAvatar
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler("Doctor With This Email Already Exists!", 400)
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(
      new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
    );
  }
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Doctor",
    doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "New Doctor Registered",
    doctor,
  });
});

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// Logout function for dashboard admin
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully.",
    });
});

// Logout function for doctors
export const logoutDoctor = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Doctor Logged Out Successfully.",
    });
});

// Logout function for frontend patient
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Patient Logged Out Successfully.",
    });
});

// Get all patients (Admin only)
export const getAllPatients = catchAsyncErrors(async (req, res, next) => {
  const patients = await User.find({ role: "Patient" }).select("-password");
  res.status(200).json({
    success: true,
    patients,
  });
});

// Get single patient by ID (Admin only)
export const getPatientById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const patient = await User.findById(id).select("-password");
  if (!patient || patient.role !== "Patient") {
    return next(new ErrorHandler("Patient Not Found!", 404));
  }
  res.status(200).json({
    success: true,
    patient,
  });
});

// Update patient (Admin only)
export const updatePatient = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let patient = await User.findById(id);
  if (!patient || patient.role !== "Patient") {
    return next(new ErrorHandler("Patient Not Found!", 404));
  }
  
  // Don't allow role change through this endpoint
  const { role, password, ...updateData } = req.body;
  
  patient = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  }).select("-password");
  
  res.status(200).json({
    success: true,
    message: "Patient Updated Successfully!",
    patient,
  });
});

// Delete patient (Admin only)
export const deletePatient = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const patient = await User.findById(id);
  if (!patient || patient.role !== "Patient") {
    return next(new ErrorHandler("Patient Not Found!", 404));
  }
  await patient.deleteOne();
  res.status(200).json({
    success: true,
    message: "Patient Deleted Successfully!",
  });
});

// Get single doctor by ID (Admin only)
export const getDoctorById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const doctor = await User.findById(id).select("-password");
  if (!doctor || doctor.role !== "Doctor") {
    return next(new ErrorHandler("Doctor Not Found!", 404));
  }
  res.status(200).json({
    success: true,
    doctor,
  });
});

// Update doctor (Admin only)
export const updateDoctor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let doctor = await User.findById(id);
  if (!doctor || doctor.role !== "Doctor") {
    return next(new ErrorHandler("Doctor Not Found!", 404));
  }
  
  // Handle avatar update if provided
  if (req.files && req.files.docAvatar) {
    const { docAvatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
      return next(new ErrorHandler("File Format Not Supported!", 400));
    }
    
    // Delete old avatar from Cloudinary if exists
    if (doctor.docAvatar?.public_id) {
      await cloudinary.uploader.destroy(doctor.docAvatar.public_id);
    }
    
    // Upload new avatar
    const cloudinaryResponse = await cloudinary.uploader.upload(
      docAvatar.tempFilePath
    );
    req.body.docAvatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }
  
  // Don't allow role change through this endpoint
  const { role, password, ...updateData } = req.body;
  
  doctor = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  }).select("-password");
  
  res.status(200).json({
    success: true,
    message: "Doctor Updated Successfully!",
    doctor,
  });
});

// Delete doctor (Admin only)
export const deleteDoctor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const doctor = await User.findById(id);
  if (!doctor || doctor.role !== "Doctor") {
    return next(new ErrorHandler("Doctor Not Found!", 404));
  }
  
  // Delete avatar from Cloudinary if exists
  if (doctor.docAvatar?.public_id) {
    await cloudinary.uploader.destroy(doctor.docAvatar.public_id);
  }
  
  await doctor.deleteOne();
  res.status(200).json({
    success: true,
    message: "Doctor Deleted Successfully!",
  });
});

// Update own profile (for all roles)
export const updateMyProfile = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  let user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User Not Found!", 404));
  }

  // Handle avatar update if provided
  if (req.files && req.files.avatar) {
    const { avatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(avatar.mimetype)) {
      return next(new ErrorHandler("File Format Not Supported! Use PNG, JPEG, or WEBP", 400));
    }
    
    // Delete old avatar from Cloudinary if exists
    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }
    // Also delete docAvatar if it exists (for doctors)
    if (user.docAvatar?.public_id && user.role === "Doctor") {
      await cloudinary.uploader.destroy(user.docAvatar.public_id);
    }
    
    // Upload new avatar
    const cloudinaryResponse = await cloudinary.uploader.upload(
      avatar.tempFilePath
    );
    
    if (user.role === "Doctor") {
      // For doctors, update both docAvatar and avatar
      req.body.docAvatar = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    }
    
    req.body.avatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  // Don't allow role or password change through this endpoint
  const { role, password, ...updateData } = req.body;
  
  // Check if email is being changed and if it's already taken
  if (updateData.email && updateData.email !== user.email) {
    const emailExists = await User.findOne({ email: updateData.email });
    if (emailExists) {
      return next(new ErrorHandler("Email already exists!", 400));
    }
  }
  
  user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  }).select("-password");
  
  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully!",
    user,
  });
});

// Change own password (for all roles)
export const changeMyPassword = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(new ErrorHandler("Please provide all password fields!", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("New password and confirm password do not match!", 400));
  }

  if (newPassword.length < 8) {
    return next(new ErrorHandler("Password must be at least 8 characters long!", 400));
  }

  const user = await User.findById(userId).select("+password");
  if (!user) {
    return next(new ErrorHandler("User Not Found!", 404));
  }

  // Verify current password
  const isPasswordMatch = await user.comparePassword(currentPassword);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Current password is incorrect!", 400));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Changed Successfully!",
  });
});