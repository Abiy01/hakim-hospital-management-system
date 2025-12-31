import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  });
  if (isConflict.length === 0) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  if (isConflict.length > 1) {
    return next(
      new ErrorHandler(
        "Doctors Conflict! Please Contact Through Email Or Phone!",
        400
      )
    );
  }
  const doctorId = isConflict[0]._id;
  const patientId = req.user._id;
  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited,
    address,
    doctorId,
    patientId,
  });
  res.status(200).json({
    success: true,
    appointment,
    message: "Appointment Send!",
  });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    appointments,
  });
});
export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found!", 404));
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      message: "Appointment Status Updated!",
    });
  }
);
export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found!", 404));
  }
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appointment Deleted!",
  });
});

// Get patient's own appointments
export const getPatientAppointments = catchAsyncErrors(async (req, res, next) => {
  const patientId = req.user._id;
  const appointments = await Appointment.find({ patientId }).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    appointments,
  });
});

// Get doctor's own appointments
export const getDoctorAppointments = catchAsyncErrors(async (req, res, next) => {
  const doctorId = req.user._id;
  const appointments = await Appointment.find({ doctorId }).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    appointments,
  });
});

// Update appointment status by doctor (accept/reject)
export const updateAppointmentStatusByDoctor = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    const doctorId = req.user._id;

    // Validate status
    if (!status || !["Accepted", "Rejected"].includes(status)) {
      return next(new ErrorHandler("Invalid status! Status must be 'Accepted' or 'Rejected'", 400));
    }

    // Find appointment and verify it belongs to this doctor
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found!", 404));
    }

    // Check if the appointment belongs to this doctor
    if (appointment.doctorId.toString() !== doctorId.toString()) {
      return next(new ErrorHandler("You are not authorized to update this appointment!", 403));
    }

    // Update appointment status
    appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
      message: `Appointment ${status} successfully!`,
      appointment,
    });
  }
);