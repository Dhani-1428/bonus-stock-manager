"use client"

import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setShowInstall(false)
    }
    
    setDeferredPrompt(null)
  }

  if (!showInstall) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 glass rounded-xl p-4 shadow-lg max-w-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
          <Download className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground mb-1">Install StockPulse</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Install our app for a better experience and offline access
          </p>
          <div className="flex gap-2">
            <Button onClick={handleInstall} size="sm" className="flex-1">
              Install
            </Button>
            <Button
              onClick={() => setShowInstall(false)}
              variant="outline"
              size="sm"
            >
              Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
