import * as React from "react"

interface CodeResult {
  code: string
  description: string
  system: "NAMASTE" | "ICD-11"
  confidence?: number
}

interface EncounterData {
  patientId: string
  selectedCodes: CodeResult[]
  encounterDate: string
  providerId: string
  notes: string
}

interface EncounterContextType {
  encounterData: EncounterData
  addCode: (code: CodeResult) => void
  removeCode: (code: string) => void
  updateEncounter: (data: Partial<EncounterData>) => void
  clearEncounter: () => void
  generateFHIR: () => object
}

const EncounterContext = React.createContext<EncounterContextType | null>(null)

const initialEncounterData: EncounterData = {
  patientId: "",
  selectedCodes: [],
  encounterDate: new Date().toISOString().split('T')[0],
  providerId: "",
  notes: ""
}

export function EncounterProvider({ children }: { children: React.ReactNode }) {
  const [encounterData, setEncounterData] = React.useState<EncounterData>(initialEncounterData)

  const addCode = (code: CodeResult) => {
    setEncounterData(prev => ({
      ...prev,
      selectedCodes: [...prev.selectedCodes.filter(c => c.code !== code.code), code]
    }))
  }

  const removeCode = (codeToRemove: string) => {
    setEncounterData(prev => ({
      ...prev,
      selectedCodes: prev.selectedCodes.filter(c => c.code !== codeToRemove)
    }))
  }

  const updateEncounter = (data: Partial<EncounterData>) => {
    setEncounterData(prev => ({ ...prev, ...data }))
  }

  const clearEncounter = () => {
    setEncounterData(initialEncounterData)
  }

  const generateFHIR = () => {
    const fhirResource = {
      resourceType: "Encounter",
      id: `encounter-${Date.now()}`,
      status: "finished",
      class: {
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        code: "AMB",
        display: "ambulatory"
      },
      subject: {
        reference: `Patient/${encounterData.patientId}`,
        display: `Patient ${encounterData.patientId}`
      },
      period: {
        start: encounterData.encounterDate,
        end: encounterData.encounterDate
      },
      participant: [
        {
          individual: {
            reference: `Practitioner/${encounterData.providerId}`,
            display: `Provider ${encounterData.providerId}`
          }
        }
      ],
      reasonCode: encounterData.selectedCodes.map(code => ({
        coding: [
          {
            system: code.system === "NAMASTE" ? "http://namaste.gov.in/codes" : "http://id.who.int/icd/release/11/mms",
            code: code.code,
            display: code.description
          }
        ],
        text: code.description
      })),
      note: encounterData.notes ? [
        {
          text: encounterData.notes
        }
      ] : [],
      meta: {
        lastUpdated: new Date().toISOString(),
        tag: [
          {
            system: "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
            code: "DUAL_CODED",
            display: "Dual Coded (NAMASTE + ICD-11)"
          }
        ]
      }
    }

    return fhirResource
  }

  const value: EncounterContextType = {
    encounterData,
    addCode,
    removeCode,
    updateEncounter,
    clearEncounter,
    generateFHIR
  }

  return (
    <EncounterContext.Provider value={value}>
      {children}
    </EncounterContext.Provider>
  )
}

export function useEncounter() {
  const context = React.useContext(EncounterContext)
  if (!context) {
    throw new Error("useEncounter must be used within an EncounterProvider")
  }
  return context
}