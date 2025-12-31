import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import { Appointment } from "../models/appointmentSchema.js";
import { Message } from "../models/messageSchema.js";

export const getDashboardStats = catchAsyncErrors(async (req, res, next) => {
  try {
    // Get counts for each entity
    const totalPatients = await User.countDocuments({ role: "Patient" });
    const totalDoctors = await User.countDocuments({ role: "Doctor" });
    const totalAdmins = await User.countDocuments({ role: "Admin" });
    const totalAppointments = await Appointment.countDocuments();
    
    // Get appointment status counts
    const pendingAppointments = await Appointment.countDocuments({ status: "Pending" });
    const acceptedAppointments = await Appointment.countDocuments({ status: "Accepted" });
    const rejectedAppointments = await Appointment.countDocuments({ status: "Rejected" });
    
    // Get total messages
    const totalMessages = await Message.countDocuments();
    
    // Get recent appointments (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentAppointments = await Appointment.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalPatients,
        totalDoctors,
        totalAdmins,
        totalAppointments,
        pendingAppointments,
        acceptedAppointments,
        rejectedAppointments,
        totalMessages,
        recentAppointments,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
});

