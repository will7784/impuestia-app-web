import { useNavigate } from 'react-router'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50"
      style={{
        backgroundColor: '#0f0f1a',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-[5vw] h-16 flex items-center justify-between">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="flex items-center"
        >
          <img
            src="/logo.png"
            alt="ImpuestIA"
            className="h-8 w-auto"
          />
        </a>

        <button
          onClick={() => navigate('/claudia')}
          className="bg-[#ff3366] text-white text-sm font-bold uppercase tracking-wider px-6 py-2.5 rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(255,51,102,0.4)] transition-all duration-300"
          style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          Habla con ClaudiA
        </button>
      </div>
    </nav>
  )
}
