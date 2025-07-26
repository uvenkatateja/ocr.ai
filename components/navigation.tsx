'use client'

import Link from 'next/link'
import { useUser, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Upload, FileText, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navigation() {
    const { isSignedIn, user } = useUser()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-3 sm:px-4">
                <div className="flex justify-between items-center h-14 sm:h-16">
                    <div className="flex items-center space-x-4 sm:space-x-8">
                        <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2">
                            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                            <span className="font-bold text-base sm:text-lg lg:text-xl text-gray-900">
                                <span className="hidden sm:inline">OCR to Markdown</span>
                                <span className="sm:hidden">OCR</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden sm:flex items-center space-x-2 sm:space-x-4">
                        {isSignedIn ? (
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <span className="text-xs sm:text-sm text-gray-600 hidden xs:block">
                                    <span className="hidden sm:inline">Welcome, </span>
                                    {user?.firstName || 'User'}
                                </span>
                                <UserButton />
                            </div>
                        ) : (
                            <div className="flex space-x-1 sm:space-x-2">
                                <Link href="/sign-in">
                                    <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/sign-up">
                                    <Button size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="sm:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleMobileMenu}
                            className="p-2"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="sm:hidden border-t border-gray-200 py-3">
                        {isSignedIn ? (
                            <div className="flex flex-col space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Welcome, {user?.firstName || 'User'}
                                    </span>
                                    <UserButton />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-2">
                                <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="ghost" size="sm" className="w-full justify-start">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button size="sm" className="w-full">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}