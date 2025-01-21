const calulcateBaseURl = () => {
  if (!import.meta.env.VITE_API_BASE_URL) {
    throw new Error('Env var missing')
  }

  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'
}

const baseUrl = calulcateBaseURl()

export default baseUrl
