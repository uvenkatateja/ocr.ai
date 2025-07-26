'use client'

import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Upload, FileText, Sparkles } from 'lucide-react'

export default function HomePage() {
    const { isSignedIn } = useUser()

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="text-center max-w-3xl mx-auto">
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Sparkles className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>

                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        Convert Images to
                        <span className="text-blue-600"> Markdown</span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                        Upload any image with text and get clean, formatted Markdown in seconds.
                        Powered by AI for perfect results every time.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/upload">
                            <Button size="lg" className="px-8 py-3 text-lg">
                                <Upload className="mr-2 h-5 w-5" />
                                Try It Now
                            </Button>
                        </Link>

                        {!isSignedIn && (
                            <Link href="/sign-up">
                                <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                                    <FileText className="mr-2 h-5 w-5" />
                                    Sign Up Free
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Features Section */}
       

        </div>
    )
}