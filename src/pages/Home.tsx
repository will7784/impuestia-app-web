import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import HeroSection from '../sections/HeroSection'
import ServicesSection from '../sections/ServicesSection'
import ClientLogosSection from '../sections/ClientLogosSection'
import WhyChooseUsSection from '../sections/WhyChooseUsSection'
import HowItWorksSection from '../sections/HowItWorksSection'
import TestimonialsSection from '../sections/TestimonialsSection'
import FinalCTASection from '../sections/FinalCTASection'

export default function Home() {
  const navigate = useNavigate()

  const navigateToClaudia = useCallback(() => {
    navigate('/claudia')
  }, [navigate])

  return (
    <>
      <HeroSection onNavigateToClaudia={navigateToClaudia} />
      <ServicesSection />
      <ClientLogosSection />
      <WhyChooseUsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FinalCTASection onNavigateToClaudia={navigateToClaudia} />
    </>
  )
}
