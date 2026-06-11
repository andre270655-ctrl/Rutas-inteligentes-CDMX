import { useEffect, useState } from 'react'

export default function useLocation() {
  const [location, setLocation] = useState(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      })
    )
  }, [])

  return location
}