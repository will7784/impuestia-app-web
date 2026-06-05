import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import HeroSection from '../sections/HeroSection'
import ScheduleSection from '../sections/ScheduleSection'

export default function Home() {
  const navigate = useNavigate()

  const navigateToClaudia = useCallback(() => {
    navigate('/claudia')
  }, [navigate])

  return (
    <>
      <HeroSection onNavigateToClaudia={navigateToClaudia} />
      <ScheduleSection />
    </>
  )
}
