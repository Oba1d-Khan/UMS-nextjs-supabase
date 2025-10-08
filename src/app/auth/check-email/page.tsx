import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-gray-700 bg-gray-800">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-gray-400">
              We've sent a confirmation link to your email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300 mb-4">
              Please check your inbox and click the verification link to
              activate your account.
            </p>
            <p className="text-sm text-gray-500">
              The link will redirect you back to complete the registration
              process.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
