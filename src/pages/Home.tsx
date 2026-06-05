import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import HeroSection from '../sections/HeroSection'
import FinalCTASection from '../sections/FinalCTASection'

export default function Home() {
  const navigate = useNavigate()

  const navigateToClaudia = useCallback(() => {
    navigate('/claudia')
  }, [navigate])

  return (
    <>
      <HeroSection onNavigateToClaudia={navigateToClaudia} />
      <FinalCTASection onNavigateToClaudia={navigateToClaudia} />
    </>
  )
}
