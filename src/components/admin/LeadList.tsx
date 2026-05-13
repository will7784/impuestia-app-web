import { useState, useEffect } from 'react'
import {
  Users,
  Search,
  Filter,
  ChevronDown,
  Download,
  Mail,
  Phone,
  Building2,
  Calendar,
  Tag,
} from 'lucide-react'
import { getLeads } from '@/lib/airtable-service'
import type { LeadRecord } from '@/lib/airtable-service'
import { cn } from '@/lib/utils'

function exportToCSV(leads: LeadRecord[]): void {
  const headers = ['Nombre', 'Email', 'Empresa', 'Rubro', 'Ingresos', 'Rol', 'RangoEdad', 'CitacionSII', 'Preocupacion', 'Fase', 'Ebook', 'Plan', 'Pago', 'FechaCreacion']
  const rows = leads.map((lead) => [
    lead.name,
    lead.email,
    lead.companyType || '',
    lead.revenue || '',
    lead.role || '',
    lead.ageRange || '',
    lead.hasSIICitation ? 'Si' : 'No',
    lead.biggestWorry || '',
    String(lead.phase),
    lead.ebookSelected || '',
    lead.planSelected || '',
    lead.paymentStatus,
    lead.createdAt,
  ])

  const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `leads_impuestia_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export default function LeadList() {
  const [leads, setLeads] = useState<LeadRecord[]>([])
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    setLeads(getLeads())
  }, [])

  const sources = [...new Set(leads.map((l) => l.companyType).filter(Boolean))]

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase())
    const matchesSource = sourceFilter === 'all' || lead.companyType === sourceFilter
    const matchesStatus = statusFilter === 'all' || lead.paymentStatus === statusFilter
    return matchesSearch && matchesSource && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-amber-100 text-amber-700'
      case 'no_sale': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagado'
      case 'pending': return 'Pendiente'
      case 'no_sale': return 'No venta'
      default: return status
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filteredLeads.length} leads capturados</p>
        </div>
        <button
          onClick={() => exportToCSV(filteredLeads)}
          className={cn(
            'flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border',
            'hover:bg-gray-50 transition-colors'
          )}
          style={{ borderColor: '#e5e7eb', color: '#374151' }}
        >
          <Download size={16} />
          Exportar CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4" style={{ borderColor: '#e5e7eb' }}>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o email..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0073aa]"
              style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
            />
          </div>

          {/* Source filter */}
          <div className="relative">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="h-10 pl-9 pr-8 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0073aa] appearance-none cursor-pointer"
              style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
            >
              <option value="all">Todos los origenes</option>
              {sources.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 pl-9 pr-8 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0073aa] appearance-none cursor-pointer"
              style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="paid">Pagado</option>
              <option value="no_sale">No venta</option>
            </select>
            <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Users size={24} className="text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-medium mb-1">No hay leads</h3>
            <p className="text-sm text-gray-500">Los leads capturados apareceran aqui.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Telefono</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Empresa</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Origen</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: '#f0f2f5' }}>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#0073aa]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-[#0073aa]">
                            {lead.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <Mail size={12} />
                        {lead.email}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone size={12} />
                        ---
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <Building2 size={12} />
                        {lead.companyType || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(lead.createdAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Tag size={12} />
                        {lead.companyType || 'Web'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusColor(lead.paymentStatus))}>
                        {getStatusLabel(lead.paymentStatus)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
