import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            Join OCR to Markdown
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-sm mx-auto">
            Create an account to save your OCR history
          </p>
        </div>
        <div className="flex justify-center">
          <SignUp 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-xl border-0 rounded-xl",
                headerTitle: "text-lg sm:text-xl",
                headerSubtitle: "text-sm",
                socialButtonsBlockButton: "text-sm",
                formButtonPrimary: "text-sm sm:text-base py-2.5",
                formFieldInput: "text-sm sm:text-base py-2.5",
                footerActionLink: "text-sm"
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}