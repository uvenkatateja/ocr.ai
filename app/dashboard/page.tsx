'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Download, Copy, FileText, Upload, History, Menu, X } from 'lucide-react'
import Link from 'next/link'

interface OCRText {
  id: string
  imageUrl: string
  markdown: string
  createdAt: string
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const [ocrTexts, setOcrTexts] = useState<OCRText[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  useEffect(() => {
    if (isLoaded && user) {
      fetchOCRTexts()
    }
  }, [isLoaded, user])

  const fetchOCRTexts = async () => {
    try {
      const response = await fetch('/api/history')
      if (response.ok) {
        const data = await response.json()
        setOcrTexts(data)
      }
    } catch (error) {
      console.error('Failed to fetch OCR history:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadMarkdown = (markdown: string, id: string) => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ocr-result-${id}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to view your OCR history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/sign-in">
                <Button className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/upload">
                <Button variant="outline" className="w-full">
                  Continue Without Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header with Menu Button */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Dashboard</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2"
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50" 
            onClick={() => setMobileSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative flex flex-col w-64 bg-white border-r border-gray-200 shadow-xl">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Dashboard</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileSidebarOpen(false)}
                className="p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <nav className="flex-1 p-4">
              <div className="space-y-2">
                <Link href="/upload" onClick={() => setMobileSidebarOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left"
                  >
                    <Upload className="mr-3 h-4 w-4" />
                    Upload
                  </Button>
                </Link>

                <Link href="/dashboard" onClick={() => setMobileSidebarOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left bg-gray-100"
                  >
                    <History className="mr-3 h-4 w-4" />
                    History
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className={`hidden lg:flex ${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 flex-col min-h-screen transition-all duration-300`}>
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            {sidebarOpen && <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          <nav className="flex-1 p-4">
            <div className="space-y-2">
              <Link href="/upload">
                <Button
                  variant="ghost"
                  className={`w-full ${sidebarOpen ? 'justify-start text-left' : 'justify-center'}`}
                  title={!sidebarOpen ? 'Upload' : undefined}
                >
                  <Upload className={`h-4 w-4 ${sidebarOpen ? 'mr-3' : ''}`} />
                  {sidebarOpen && 'Upload'}
                </Button>
              </Link>

              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className={`w-full ${sidebarOpen ? 'justify-start text-left' : 'justify-center'} bg-gray-100`}
                  title={!sidebarOpen ? 'History' : undefined}
                >
                  <History className={`h-4 w-4 ${sidebarOpen ? 'mr-3' : ''}`} />
                  {sidebarOpen && 'History'}
                </Button>
              </Link>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 py-4 lg:py-8">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="mb-6 lg:mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Your OCR History
              </h1>
              <p className="text-sm lg:text-base text-gray-600">
                View and manage your converted documents
              </p>
            </div>

            {ocrTexts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 lg:py-16">
                  <FileText className="h-12 w-12 lg:h-16 lg:w-16 text-gray-400 mb-4" />
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">
                    No OCR history yet
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600 mb-6 text-center px-4">
                    Upload your first image to start building your OCR history
                  </p>
                  <Link href="/upload">
                    <Button size="sm" className="lg:text-base">
                      Upload Image
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 lg:gap-6">
                {ocrTexts.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div>
                          <CardTitle className="text-base lg:text-lg">
                            OCR Result
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {formatDate(new Date(item.createdAt))}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => copyToClipboard(item.markdown)}
                            variant="outline"
                            size="sm"
                            className="text-xs lg:text-sm"
                          >
                            <Copy className="h-3 w-3 lg:h-4 lg:w-4" />
                            <span className="ml-1 lg:ml-2 hidden sm:inline">Copy</span>
                          </Button>
                          <Button
                            onClick={() => downloadMarkdown(item.markdown, item.id)}
                            variant="outline"
                            size="sm"
                            className="text-xs lg:text-sm"
                          >
                            <Download className="h-3 w-3 lg:h-4 lg:w-4" />
                            <span className="ml-1 lg:ml-2 hidden sm:inline">Download</span>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                        <div>
                          <h4 className="font-semibold mb-2 text-sm lg:text-base">Original Image</h4>
                          <img
                            src={item.imageUrl}
                            alt="Original"
                            className="w-full h-32 lg:h-48 object-cover rounded-lg border"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-sm lg:text-base">Extracted Text</h4>
                          <div className="bg-gray-50 p-3 lg:p-4 rounded-lg h-32 lg:h-48 overflow-y-auto">
                            <pre className="text-xs lg:text-sm whitespace-pre-wrap">
                              {item.markdown.substring(0, 500)}
                              {item.markdown.length > 500 && '...'}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}