import express from "express";
import {
  addNewAdmin,
  addNewDoctor,
  changeMyPassword,
  deleteDoctor,
  deletePatient,
  getAllDoctors,
  getAllPatients,
  getDoctorById,
  getPatientById,
  getUserDetails,
  login,
  logoutAdmin,
  logoutDoctor,
  logoutPatient,
  patientRegister,
  updateDoctor,
  updateMyProfile,
  updatePatient,
} from "../controller/userController.js";
import {
  isAdminAuthenticated,
  isDoctorAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.post("/patient/register", patientRegister);
router.post("/login", login);
router.get("/doctors", getAllDoctors);

// Patient routes
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);
router.put("/patient/profile", isPatientAuthenticated, updateMyProfile);
router.put("/patient/password", isPatientAuthenticated, changeMyPassword);

// Doctor routes
router.get("/doctor/me", isDoctorAuthenticated, getUserDetails);
router.get("/doctor/logout", isDoctorAuthenticated, logoutDoctor);
router.put("/doctor/profile", isDoctorAuthenticated, updateMyProfile);
router.put("/doctor/password", isDoctorAuthenticated, changeMyPassword);

// Admin routes
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);
router.put("/admin/profile", isAdminAuthenticated, updateMyProfile);
router.put("/admin/password", isAdminAuthenticated, changeMyPassword);

// Admin - Patient CRUD
router.get("/patients", isAdminAuthenticated, getAllPatients);
router.get("/patient/:id", isAdminAuthenticated, getPatientById);
router.put("/patient/:id", isAdminAuthenticated, updatePatient);
router.delete("/patient/:id", isAdminAuthenticated, deletePatient);

// Admin - Doctor CRUD
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);
router.get("/doctor/:id", isAdminAuthenticated, getDoctorById);
router.put("/doctor/:id", isAdminAuthenticated, updateDoctor);
router.delete("/doctor/:id", isAdminAuthenticated, deleteDoctor);

// Admin - Admin management
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);

export default router;