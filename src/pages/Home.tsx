import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import HeroSection from '../sections/HeroSection'
import ServicesSection from '../sections/ServicesSection'
import ClientLogosSection from '../sections/ClientLogosSection'
import WhyChooseUsSection from '../sections/WhyChooseUsSection'
import HowItWorksSection from '../sections/HowItWorksSection'
import TestimonialsSection from '../sections/TestimonialsSection'
import FinalCTASection from '../sections/FinalCTASection'
import LeadCaptureModal from '../components/LeadCaptureModal'
import LeadCaptureFAB from '../components/LeadCaptureFAB'

export default function Home() {
  const [leadModalOpen, setLeadModalOpen] = useState(false)
  const navigate = useNavigate()

  const openLeadModal = useCallback(() => {
    setLeadModalOpen(true)
  }, [])

  const closeLeadModal = useCallback(() => {
    setLeadModalOpen(false)
  }, [])

  const handleLeadSubmit = useCallback((name: string, email: string) => {
    navigate(`/agent?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`)
  }, [navigate])

  return (
    <>
      <HeroSection onOpenLeadModal={openLeadModal} />
      <ServicesSection />
      <ClientLogosSection />
      <WhyChooseUsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FinalCTASection onOpenLeadModal={openLeadModal} />
      <LeadCaptureFAB onOpen={openLeadModal} />
      <LeadCaptureModal
        isOpen={leadModalOpen}
        onClose={closeLeadModal}
        onSubmit={handleLeadSubmit}
      />
    </>
  )
}
