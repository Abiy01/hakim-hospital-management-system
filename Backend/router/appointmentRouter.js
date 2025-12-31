import express from "express";
import {
  deleteAppointment,
  getAllAppointments,
  getDoctorAppointments,
  getPatientAppointments,
  postAppointment,
  updateAppointmentStatus,
  updateAppointmentStatusByDoctor,
} from "../controller/appointmentController.js";
import {
  isAdminAuthenticated,
  isDoctorAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isPatientAuthenticated, postAppointment);
router.get("/getall", isAdminAuthenticated, getAllAppointments);
router.get("/patient/myappointments", isPatientAuthenticated, getPatientAppointments);
router.get("/doctor/myappointments", isDoctorAuthenticated, getDoctorAppointments);
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);
router.put("/doctor/update/:id", isDoctorAuthenticated, updateAppointmentStatusByDoctor);
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);

export default router;