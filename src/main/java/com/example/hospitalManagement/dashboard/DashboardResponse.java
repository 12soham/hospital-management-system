    package com.example.hospitalManagement.dashboard;



    public class DashboardResponse {

        private long patients;
        private long doctors;
        private long appointments;

        public DashboardResponse(long patients,
                                 long doctors,
                                 long appointments) {
            this.patients = patients;
            this.doctors = doctors;
            this.appointments = appointments;
        }

        public long getPatients() {
            return patients;
        }

        public long getDoctors() {
            return doctors;
        }

        public long getAppointments() {
            return appointments;
        }
    }
