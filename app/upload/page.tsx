'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { UploadButton } from '@/lib/uploadthing'
import { Download, Copy, Loader2, CheckCircle, AlertCircle, Sparkles, Upload, History, Menu, X } from 'lucide-react'
import Link from 'next/link'

export default function UploadPage() {
  const { user } = useUser()
  const [imageUrl, setImageUrl] = useState<string>('')
  const [markdown, setMarkdown] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)

  const [error, setError] = useState<string>('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)



  const handleOCR = async (url: string) => {
    setIsProcessing(true)
    setError('')

    try {
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: url }),
      })

      if (!response.ok) {
        throw new Error('Failed to process image')
      }

      const data = await response.json()
      setMarkdown(data.markdown)

      // Save to database if user is authenticated
      if (user) {
        await fetch('/api/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: url,
            markdown: data.markdown,
          }),
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdown)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ocr-result-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
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
                    className="w-full justify-start text-left bg-gray-100"
                  >
                    <Upload className="mr-3 h-4 w-4" />
                    Upload
                  </Button>
                </Link>

                <Link href="/dashboard" onClick={() => setMobileSidebarOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left"
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
                  className={`w-full ${sidebarOpen ? 'justify-start text-left' : 'justify-center'} bg-gray-100`}
                  title={!sidebarOpen ? 'Upload' : undefined}
                >
                  <Upload className={`h-4 w-4 ${sidebarOpen ? 'mr-3' : ''}`} />
                  {sidebarOpen && 'Upload'}
                </Button>
              </Link>

              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className={`w-full ${sidebarOpen ? 'justify-start text-left' : 'justify-center'}`}
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
        <div className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-w-0">
          <div className="w-full px-3 sm:px-4 lg:px-6 py-4 lg:py-8">
            {/* Header */}
            <div className="text-center mb-4 sm:mb-6 lg:mb-8">
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-600" />
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 px-2">
                Convert Image to Markdown
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto text-xs sm:text-sm lg:text-base px-3 sm:px-4">
                Upload any image containing text and get clean, formatted Markdown in seconds
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              {/* Upload Section */}
              <Card className="mb-4 sm:mb-6 lg:mb-8 border-0 shadow-lg w-full">
                <CardHeader className="text-center pb-3 sm:pb-4 px-4 sm:px-6">
                  <CardTitle className="text-base sm:text-lg lg:text-xl text-gray-800">
                    Step 1: Upload Your Image
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm lg:text-base">
                    JPG, PNG, WebP • Max 4MB
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 lg:p-12 text-center hover:border-blue-400 transition-colors">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-blue-100 p-3 sm:p-4 lg:p-5 rounded-full mb-4 sm:mb-6">
                          <Upload className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-blue-600" />
                        </div>
                        <div className="flex justify-center w-full">
                          <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                              const url = res[0]?.url
                              if (url) {
                                setImageUrl(url)
                                handleOCR(url)
                              }
                            }}
                            onUploadError={(error: Error) => {
                              setError(`Upload failed: ${error.message}`)
                            }}
                            className="ut-button:bg-blue-600 ut-button:hover:bg-blue-700 ut-button:text-white ut-button:font-semibold ut-button:py-3 ut-button:px-6 sm:ut-button:py-4 sm:ut-button:px-8 ut-button:rounded-lg ut-button:transition-colors ut-button:border-0 ut-button:text-sm sm:ut-button:text-base lg:ut-button:text-lg ut-button:shadow-lg ut-button:min-w-[140px] sm:ut-button:min-w-[160px]"
                            content={{
                              button({ ready }) {
                                if (ready) return "Choose File";
                                return "Getting ready...";
                              },
                              allowedContent: () => "",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-start gap-2 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-red-700 text-xs sm:text-sm break-words">{error}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Processing State */}
              {isProcessing && (
                <Card className="mb-4 sm:mb-6 lg:mb-8 border-0 shadow-lg w-full">
                  <CardContent className="py-6 sm:py-8 lg:py-12 px-4 sm:px-6">
                    <div className="text-center">
                      <div className="flex justify-center mb-3 sm:mb-4">
                        <div className="bg-blue-100 p-2 sm:p-3 lg:p-4 rounded-full">
                          <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-600 animate-spin" />
                        </div>
                      </div>
                      <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 mb-2">
                        AI is Processing Your Image
                      </h3>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-600 px-2 sm:px-4">
                        Extracting and formatting text... This usually takes 10-30 seconds
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Results Section */}
              {(imageUrl || markdown) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-8 w-full">
                  {/* Original Image */}
                  {imageUrl && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                        <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-green-600" />
                          Original Image
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 sm:px-6">
                        <div className="relative">
                          <img
                            src={imageUrl}
                            alt="Uploaded image"
                            className="w-full h-auto rounded-lg border shadow-sm max-h-48 sm:max-h-64 lg:max-h-96 object-contain bg-gray-50"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Extracted Markdown */}
                  {markdown && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
                          <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-green-600" />
                            Extracted Markdown
                          </CardTitle>
                          <div className="flex gap-1.5 sm:gap-2">
                            <Button
                              onClick={copyToClipboard}
                              variant="outline"
                              size="sm"
                              className="transition-all text-xs sm:text-sm flex-1 xs:flex-none"
                            >
                              {copySuccess ? (
                                <>
                                  <CheckCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                                  <span className="hidden xs:inline">Copied!</span>
                                  <span className="xs:hidden">✓</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="hidden xs:inline">Copy</span>
                                  <span className="xs:hidden">Copy</span>
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={downloadMarkdown}
                              variant="outline"
                              size="sm"
                              className="transition-all text-xs sm:text-sm flex-1 xs:flex-none"
                            >
                              <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="hidden xs:inline">Download</span>
                              <span className="xs:hidden">Save</span>
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 sm:px-6">
                        <div className="relative">
                          <Textarea
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            className="min-h-[250px] sm:min-h-[300px] lg:min-h-[400px] font-mono text-xs sm:text-sm resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Extracted markdown will appear here..."
                          />
                          <div className="absolute top-2 right-2 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs text-gray-500">
                            {markdown.length} chars
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Success Message for Signed-in Users */}
              {markdown && user && (
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg w-full">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-green-800 font-medium text-xs sm:text-sm">
                      Success! Your OCR result has been saved to your history.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}