"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, FileText, Calendar, User, Stethoscope } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface MedicalRecord {
  id: number
  visit_date: string
  diagnosis: string
  symptoms: string
  treatment: string
  medications: string
  notes: string
  follow_up_date: string
  patients: {
    first_name: string
    last_name: string
    date_of_birth: string
  }
  doctors: {
    first_name: string
    last_name: string
    specialization: string
  }
}

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMedicalRecords()
  }, [])

  const fetchMedicalRecords = async () => {
    try {
      const { data, error } = await supabase
        .from("medical_records")
        .select(`
          *,
          patients (first_name, last_name, date_of_birth),
          doctors (first_name, last_name, specialization)
        `)
        .order("visit_date", { ascending: false })

      if (error) throw error
      setRecords(data || [])
    } catch (error) {
      console.error("Error fetching medical records:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRecords = records.filter(
    (record) =>
      `${record.patients.first_name} ${record.patients.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.symptoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${record.doctors.first_name} ${record.doctors.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading medical records...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
              <p className="text-gray-600">View and manage patient medical history</p>
            </div>
            <Link href="/medical-records/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Medical Record
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by patient name, diagnosis, symptoms, or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredRecords.map((record) => (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-600" />
                      {record.patients.first_name} {record.patients.last_name}
                    </CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      Visit Date: {new Date(record.visit_date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="flex items-center">
                    <Stethoscope className="h-3 w-3 mr-1" />
                    Dr. {record.doctors.first_name} {record.doctors.last_name}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {record.diagnosis && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">Diagnosis</h4>
                      <p className="text-sm text-gray-600">{record.diagnosis}</p>
                    </div>
                  )}

                  {record.symptoms && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">Symptoms</h4>
                      <p className="text-sm text-gray-600">{record.symptoms}</p>
                    </div>
                  )}

                  {record.treatment && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">Treatment</h4>
                      <p className="text-sm text-gray-600">{record.treatment}</p>
                    </div>
                  )}

                  {record.medications && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">Medications</h4>
                      <p className="text-sm text-gray-600">{record.medications}</p>
                    </div>
                  )}
                </div>

                {record.notes && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">Notes</h4>
                    <p className="text-sm text-gray-600">{record.notes}</p>
                  </div>
                )}

                {record.follow_up_date && (
                  <div className="flex items-center text-sm text-amber-600 bg-amber-50 p-2 rounded">
                    <Calendar className="h-4 w-4 mr-2" />
                    Follow-up scheduled: {new Date(record.follow_up_date).toLocaleDateString()}
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="text-xs text-gray-500">Specialization: {record.doctors.specialization}</div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Edit Record
                    </Button>
                    <Button variant="outline" size="sm">
                      Print
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No medical records found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first medical record"}
            </p>
            <Link href="/medical-records/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Medical Record
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
