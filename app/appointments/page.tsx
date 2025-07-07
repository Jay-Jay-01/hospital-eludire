"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Plus } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface Appointment {
  id: number
  appointment_date: string
  appointment_time: string
  status: string
  reason: string
  notes: string
  patients: {
    first_name: string
    last_name: string
    phone: string
  }
  doctors: {
    first_name: string
    last_name: string
    specialization: string
  }
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          patients (first_name, last_name, phone),
          doctors (first_name, last_name, specialization)
        `)
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true })

      if (error) throw error
      setAppointments(data || [])
    } catch (error) {
      console.error("Error fetching appointments:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      case "No Show":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "all") return true
    if (filter === "today") {
      const today = new Date().toISOString().split("T")[0]
      return appointment.appointment_date === today
    }
    return appointment.status === filter
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
              <p className="text-gray-600">Manage patient appointments</p>
            </div>
            <Link href="/appointments/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            All Appointments
          </Button>
          <Button variant={filter === "today" ? "default" : "outline"} size="sm" onClick={() => setFilter("today")}>
            Today
          </Button>
          <Button
            variant={filter === "Scheduled" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("Scheduled")}
          >
            Scheduled
          </Button>
          <Button
            variant={filter === "Completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("Completed")}
          >
            Completed
          </Button>
        </div>

        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <User className="h-5 w-5 mr-2 text-blue-600" />
                      <h3 className="text-lg font-semibold">
                        {appointment.patients.first_name} {appointment.patients.last_name}
                      </h3>
                      <Badge className={`ml-3 ${getStatusColor(appointment.status)}`}>{appointment.status}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(appointment.appointment_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {appointment.appointment_time}
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <strong>Doctor:</strong> Dr. {appointment.doctors.first_name} {appointment.doctors.last_name}
                        <span className="text-gray-500 ml-2">({appointment.doctors.specialization})</span>
                      </div>
                      {appointment.reason && (
                        <div className="col-span-1 md:col-span-2">
                          <strong>Reason:</strong> {appointment.reason}
                        </div>
                      )}
                      {appointment.notes && (
                        <div className="col-span-1 md:col-span-2">
                          <strong>Notes:</strong> {appointment.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6 flex flex-col space-y-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    {appointment.status === "Scheduled" && <Button size="sm">Complete</Button>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 mb-4">
              {filter === "all"
                ? "Get started by scheduling your first appointment"
                : `No ${filter === "today" ? "today's" : filter.toLowerCase()} appointments found`}
            </p>
            <Link href="/appointments/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
