import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import logo from '../../public/logo.png';
import { Globe } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('hi');

  // Load language preference from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('appLanguage');
    if (savedLang) {
      setLanguage(savedLang);
    } else {
      // Auto-select Hindi by default
      localStorage.setItem('appLanguage', 'hi');
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'hi' ? 'en' : 'hi';
    setLanguage(newLang);
    localStorage.setItem('appLanguage', newLang);
  };

  // Translations
  const t = {
    hi: {
      appName: "घर से करो",
      tagline: "जुड़ें",
      signInTitle: "अपने खाते में प्रवेश करें",
      or: "या",
      continueWithGoogle: "Google से जारी रखें",
      backToHome: "होम पर वापस जाएं",
      loginSuccess: "लॉगिन सफल",
      welcomeBack: "वापसी पर स्वागत है",
      googleAuthSuccess: "Google प्रमाणीकरण सफल",
      completeRegistration: "कृपया पता विवरण के साथ अपना पंजीकरण पूरा करें।"
    },
    en: {
      appName: "GharSeKro",
      tagline: "Connect",
      signInTitle: "Sign in to your account",
      or: "or",
      continueWithGoogle: "Continue with Google",
      backToHome: "Back to Home",
      loginSuccess: "Login Successful",
      welcomeBack: "Welcome back",
      googleAuthSuccess: "Google Authentication Successful",
      completeRegistration: "Please complete your registration with address details."
    }
  };

  const currentLang = t[language];

  // Demo login - no backend needed
  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('authToken');
    if (token) navigate('/');
  }, [navigate]);

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('authToken', 'demo-token-gharsekro');
      localStorage.setItem('userName', 'Rahul Sharma');
      localStorage.setItem('userEmail', 'rahul@gharsekro.com');
      localStorage.setItem('userType', 'RETAILER');
      window.dispatchEvent(new Event('auth-change'));
      toast({ title: currentLang.loginSuccess, description: `${currentLang.welcomeBack}, Rahul Sharma!` });
      navigate('/');
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Language Selector - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={toggleLanguage}
          variant="outline"
          className="flex items-center gap-2 bg-white shadow-md hover:shadow-lg transition-all duration-200 border-2 border-orange-200"
        >
          <Globe className="w-4 h-4" />
          <span className="font-semibold">{language === 'hi' ? 'हिंदी' : 'English'}</span>
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-2xl rounded-3xl border-0 bg-white overflow-hidden">
        {/* Header with Indian flag colors gradient */}
        <div className="h-2 bg-gradient-to-r from-orange-500 via-white to-green-500"></div>
        
        <CardHeader className="text-center flex flex-col items-center gap-3 pt-8 pb-6">
          <img src={logo} alt="GharSeKro logo" className="w-24 h-24 object-contain drop-shadow-lg" />
          
          <CardTitle className={`text-4xl font-black bg-gradient-to-r from-orange-600 via-orange-500 to-green-600 bg-clip-text text-transparent tracking-tight ${language === 'hi' ? 'font-sans' : ''}`}>
            {currentLang.appName}
          </CardTitle>
          
          <CardDescription className="text-orange-600 font-semibold text-lg -mt-1">
            {currentLang.tagline}
          </CardDescription>

          <CardDescription className={`text-gray-600 text-base mt-2 ${language === 'hi' ? 'font-sans text-lg' : ''}`}>
            {currentLang.signInTitle}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          {/* Google Sign-in Button - Large and prominent */}
          <div className="flex flex-col items-center">
            <Button
              className={`w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 shadow-lg hover:shadow-xl hover:bg-gray-50 text-gray-800 font-bold py-6 text-lg rounded-2xl transition-all duration-200 ${language === 'hi' ? 'font-sans' : ''}`}
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              <svg className="w-6 h-6" viewBox="0 0 48 48">
                <g>
                  <path fill="#4285F4" d="M24 9.5c3.54 0 6.36 1.22 8.3 2.97l6.18-6.18C34.64 2.61 29.74 0 24 0 14.82 0 6.88 5.82 2.69 14.09l7.19 5.58C12.01 13.13 17.56 9.5 24 9.5z" />
                  <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.58C43.98 37.13 46.1 31.3 46.1 24.55z" />
                  <path fill="#FBBC05" d="M9.88 28.67A14.48 14.48 0 0 1 9.5 24c0-1.62.28-3.19.78-4.67l-7.19-5.58A23.94 23.94 0 0 0 0 24c0 3.77.9 7.34 2.5 10.5l7.38-5.83z" />
                  <path fill="#EA4335" d="M24 48c6.48 0 11.92-2.15 15.89-5.85l-7.38-5.83c-2.05 1.38-4.67 2.2-8.51 2.2-6.44 0-11.99-3.63-14.12-8.67l-7.19 5.58C6.88 42.18 14.82 48 24 48z" />
                  <path fill="none" d="M0 0h48v48H0z" />
                </g>
              </svg>
              {currentLang.continueWithGoogle}
            </Button>

            {/* Simple info text */}
            <p className={`mt-6 text-sm text-gray-500 text-center ${language === 'hi' ? 'font-sans' : ''}`}>
              {language === 'hi' 
                ? 'सभी के लिए सरल और सुरक्षित' 
                : 'Simple and secure for everyone'}
            </p>
          </div>

          <div className="mt-8 text-center">
            <Button
              variant="link"
              className={`text-orange-600 hover:text-orange-800 font-semibold text-base ${language === 'hi' ? 'font-sans' : ''}`}
              onClick={() => navigate('/')}
            >
              {currentLang.backToHome}
            </Button>
          </div>
        </CardContent>

        {/* Footer with Indian flag colors gradient */}
        <div className="h-2 bg-gradient-to-r from-orange-500 via-white to-green-500"></div>
      </Card>

    </div>
  );
};

export default Login;