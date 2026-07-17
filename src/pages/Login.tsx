import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Globe, ArrowRight } from "lucide-react";
import AddressModal from "@/components/AddressModal";
import { sendOtp, verifyOtp } from "@/lib/api";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("hi");

  // Authentication mode: "signin" | "create"
  const [authMode, setAuthMode] = useState<"signin" | "create">("signin");
  // Verification step: "input" | "verify"
  const [step, setStep] = useState<"input" | "verify">("input");

  // Form fields
  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");

  // OTP State
  const [sentOtp, setSentOtp] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [needHelpOpen, setNeedHelpOpen] = useState(false);

  // Address Modal Registration States
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [registrationData, setRegistrationData] = useState<{
    token: string;
    name?: string;
    email?: string;
    profile?: string;
  } | null>(null);

  // Countdown timer for resending OTP
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Load language preference from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("appLanguage");
    if (savedLang) {
      setLanguage(savedLang);
    } else {
      localStorage.setItem("appLanguage", "hi");
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "hi" ? "en" : "hi";
    setLanguage(newLang);
    localStorage.setItem("appLanguage", newLang);
  };

  // Translations
  const t = {
    hi: {
      appName: "घर से करो",
      signInTitle: "लॉग इन करें",
      createAccountTitle: "खाता बनाएं",
      nameLabel: "आपका नाम",
      namePlaceholder: "पहला और आखिरी नाम",
      emailOrPhoneLabel: "मोबाइल नंबर",
      emailOrPhonePlaceholder: "10 अंकों का मोबाइल नंबर दर्ज करें",
      continueButton: "आगे बढ़ें",
      signInButton: "लॉग इन करें",
      verifyOtpTitle: "सत्यापन आवश्यक",
      enterOtpLabel: "ओटीपी दर्ज करें",
      otpPlaceholder: "6-अंकीय ओटीपी",
      verifyOtpButton: "सत्यापन कोड की पुष्टि करें",
      sending: "ओटीपी भेज रहे हैं...",
      verifying: "सत्यापित कर रहे हैं...",
      resendOtp: "ओटीपी पुनः भेजें",
      resendIn: "पुनः भेजें {timer}s में",
      changeInput: "बदलें",
      backToHome: "होम पर वापस जाएं",
      needHelp: "क्या आपको सहायता चाहिए?",
      forgotPasswordHelp: "अपना पासवर्ड भूल गए?",
      otherSigninIssues: "लॉग इन से जुड़ी अन्य समस्याएं",
      conditionsOfUse: "आगे बढ़ने पर, आप घर से करो की उपयोग की शर्तें और गोपनीयता सूचना से सहमत होते हैं।",
      conditionsLink: "उपयोग की शर्तें",
      privacyLink: "गोपनीयता सूचना",
      newToApp: "घर से करो पर नए हैं?",
      createAccountButtonText: "अपना घर से करो खाता बनाएं",
      alreadyHaveAccount: "पहले से ही एक खाता है?",
      loginSuccess: "लॉगिन सफल",
      welcomeBack: "वापसी पर स्वागत है",
      detailsRequired: "विवरण आवश्यक",
      completeRegistration: "कृपया अपना पंजीकरण पूरा करने के लिए पता विवरण प्रदान करें।"
    },
    en: {
      appName: "GharSeKro",
      signInTitle: "Sign in",
      createAccountTitle: "Create account",
      nameLabel: "Your name",
      namePlaceholder: "First and last name",
      emailOrPhoneLabel: "Mobile number",
      emailOrPhonePlaceholder: "Enter 10-digit mobile number",
      continueButton: "Continue",
      signInButton: "Sign in",
      verifyOtpTitle: "Verification required",
      enterOtpLabel: "Enter OTP",
      otpPlaceholder: "6-digit OTP",
      verifyOtpButton: "Verify OTP",
      sending: "Sending OTP...",
      verifying: "Verifying...",
      resendOtp: "Resend OTP",
      resendIn: "Resend OTP in {timer}s",
      changeInput: "Change",
      backToHome: "Back to Home",
      needHelp: "Need help?",
      forgotPasswordHelp: "Forgot your Password?",
      otherSigninIssues: "Other issues with Sign-In",
      conditionsOfUse: "By continuing, you agree to GharSeKro's Conditions of Use and Privacy Notice.",
      conditionsLink: "Conditions of Use",
      privacyLink: "Privacy Notice",
      newToApp: "New to GharSeKro?",
      createAccountButtonText: "Create your GharSeKro account",
      alreadyHaveAccount: "Already have an account?",
      loginSuccess: "Login Successful",
      welcomeBack: "Welcome back",
      detailsRequired: "Details Required",
      completeRegistration: "Please provide address details to complete your registration."
    }
  };

  const currentLang = t[language as "hi" | "en"] || t.en;

  // Send OTP handler
  const handleSendOtp = async (e: React.FormEvent) => {
    if (e) e.preventDefault();

    if (authMode === "create" && !name.trim()) {
      toast({
        title: language === "hi" ? "त्रुटि" : "Error",
        description: language === "hi" ? "कृपया अपना नाम दर्ज करें।" : "Please enter your name.",
        variant: "destructive"
      });
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!emailOrPhone.trim() || !phoneRegex.test(emailOrPhone.trim())) {
      toast({
        title: language === "hi" ? "त्रुटि" : "Error",
        description: language === "hi" ? "कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।" : "Please enter a valid 10-digit mobile number.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendOtp(emailOrPhone.trim());
      if (res.success) {
        setStep("verify");
        setTimer(30);
        if (res.otp) {
          setSentOtp(res.otp);
        }
        toast({
          title: language === "hi" ? "ओटीपी भेजा गया" : "OTP Sent",
          description: res.message
        });
      } else {
        toast({
          title: "Error",
          description: res.message,
          variant: "destructive"
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to send OTP",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP handler
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      toast({
        title: language === "hi" ? "अमान्य ओटीपी" : "Invalid OTP",
        description: language === "hi" ? "कृपया 6-अंकीय ओटीपी दर्ज करें।" : "Please enter a 6-digit OTP.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyOtp(
        emailOrPhone.trim(),
        otp.trim(),
        authMode === "create" ? name.trim() : undefined
      );

      if (res.success) {
        if (res.registered && res.token) {
          // User registered - standard login success
          localStorage.setItem("authToken", res.token);
          localStorage.setItem("userName", res.name || name.trim() || "User");
          localStorage.setItem("userEmail", res.email || "");
          localStorage.setItem("userProfile", res.profile || "");
          if (res.type) localStorage.setItem("userType", res.type);
          if ((res as any).gstnumber) {
            localStorage.setItem("userGST", (res as any).gstnumber);
            sessionStorage.setItem("wholesaleGST", (res as any).gstnumber);
          }
          if ((res as any).shopname) {
            localStorage.setItem("userShopName", (res as any).shopname);
            sessionStorage.setItem("wholesaleShopName", (res as any).shopname);
          }

          window.dispatchEvent(new Event("auth-change"));
          toast({
            title: currentLang.loginSuccess,
            description: `${currentLang.welcomeBack}, ${res.name || name.trim() || "User"}!`
          });

          const cart = localStorage.getItem("cart");
          if (cart && JSON.parse(cart).length > 0) {
            navigate("/cart");
          } else {
            navigate("/");
          }
        } else if (!res.registered && res.tempToken) {
          // Profile/address registration incomplete - proceed to address modal onboarding
          setRegistrationData({
            token: res.tempToken,
            name: name.trim() || res.name || undefined,
            email: res.email || undefined,
            profile: res.profile || undefined
          });
          setShowAddressModal(true);
          toast({
            title: currentLang.detailsRequired,
            description: currentLang.completeRegistration
          });
        }
      } else {
        toast({
          title: "Error",
          description: res.message || "OTP verification failed",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to verify OTP",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeSwitch = (mode: "signin" | "create") => {
    setAuthMode(mode);
    setStep("input");
    setOtp("");
    setSentOtp(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-slate-900 font-sans antialiased">
      
      {/* Language Selector Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-semibold rounded-full text-slate-700 shadow-sm outline-none focus:ring-1 focus:ring-[#e77600]"
        >
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <span>{language === "hi" ? "हिंदी" : "English"}</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* GharSeKro / BuildMart Logo */}
        <div 
          onClick={() => navigate("/")} 
          className="flex justify-center mb-5 cursor-pointer select-none"
        >
          <img 
            src="/logo.png" 
            alt="GharSeKro logo" 
            className="h-10 md:h-12 object-contain rounded-md" 
          />
        </div>

        {/* Amazon-style Card Wrapper */}
        <div className="w-full max-w-[350px] md:max-w-[365px] bg-white border border-[#ddd] rounded-lg p-6 shadow-sm">
          {step === "input" ? (
            /* STEP 1: Enter email/phone or name+email/phone */
            <form onSubmit={handleSendOtp} className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-normal tracking-tight text-slate-900 pb-1">
                {authMode === "signin" ? currentLang.signInTitle : currentLang.createAccountTitle}
              </h1>

              {authMode === "create" && (
                <div className="space-y-1">
                  <label htmlFor="name" className="text-[13px] font-bold text-slate-900">
                    {currentLang.nameLabel}
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder={currentLang.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-[31px] px-2.5 py-1 text-sm border border-slate-400 rounded-[3px] outline-none focus:border-[#e77600] focus:ring-[3px] focus:ring-[#e77600]/15 transition-all shadow-[0_1px_0_rgba(0,0,0,0.07)_inset]"
                    required
                  />
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="emailOrPhone" className="text-[13px] font-bold text-slate-900">
                  {currentLang.emailOrPhoneLabel}
                </label>
                <input
                  id="emailOrPhone"
                  type="tel"
                  maxLength={10}
                  placeholder={currentLang.emailOrPhonePlaceholder}
                  value={emailOrPhone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setEmailOrPhone(val);
                  }}
                  className="w-full h-[31px] px-2.5 py-1 text-sm border border-slate-400 rounded-[3px] outline-none focus:border-[#e77600] focus:ring-[3px] focus:ring-[#e77600]/15 transition-all shadow-[0_1px_0_rgba(0,0,0,0.07)_inset]"
                  required
                />
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] hover:from-[#f5d78e] hover:to-[#eeb933] active:from-[#f0c14b] active:to-[#f0c14b] active:border-[#846a29] text-slate-900 text-[13px] font-medium rounded-[3px] py-1.5 shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] focus:outline-none transition-all cursor-pointer text-center"
              >
                {isLoading ? currentLang.sending : currentLang.continueButton}
              </button>

              {/* Conditions Disclaimer */}
              <p className="text-[12px] text-slate-600 leading-relaxed font-medium pt-1">
                {currentLang.conditionsOfUse}
              </p>

              {/* Expandable Need Help Accordion */}
              <div className="border-t border-slate-100 pt-3 text-[13px]">
                <button
                  type="button"
                  onClick={() => setNeedHelpOpen(!needHelpOpen)}
                  className="text-[#0066c0] hover:text-[#c45500] hover:underline flex items-center gap-1.5 font-medium outline-none"
                >
                  <span className={`inline-block text-[9px] transition-transform duration-100 ${needHelpOpen ? "rotate-90" : ""}`}>
                    ▶
                  </span>
                  {currentLang.needHelp}
                </button>
                {needHelpOpen && (
                  <div className="pl-3.5 mt-1.5 space-y-1.5 text-[#0066c0] font-medium">
                    <p className="hover:text-[#c45500] hover:underline cursor-pointer">
                      {currentLang.forgotPasswordHelp}
                    </p>
                    <p className="hover:text-[#c45500] hover:underline cursor-pointer">
                      {currentLang.otherSigninIssues}
                    </p>
                  </div>
                )}
              </div>
            </form>
          ) : (
            /* STEP 2: Verify OTP */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-normal tracking-tight text-slate-900 pb-1">
                {currentLang.verifyOtpTitle}
              </h1>

              <div className="text-xs text-slate-700 font-medium pb-1">
                <span>We sent a verification code to </span>
                <strong className="text-slate-900 font-black">{emailOrPhone}</strong>.{" "}
                <button
                  type="button"
                  onClick={() => setStep("input")}
                  className="text-[#0066c0] hover:text-[#c45500] hover:underline font-bold"
                >
                  {currentLang.changeInput}
                </button>
              </div>

              <div className="space-y-1">
                <label htmlFor="otp" className="text-[13px] font-bold text-slate-900">
                  {currentLang.enterOtpLabel}
                </label>
                <input
                  id="otp"
                  type="text"
                  maxLength={6}
                  placeholder={currentLang.otpPlaceholder}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full h-[31px] px-2.5 py-1 text-sm border border-slate-400 rounded-[3px] outline-none text-center font-bold tracking-[6px] focus:border-[#e77600] focus:ring-[3px] focus:ring-[#e77600]/15 transition-all shadow-[0_1px_0_rgba(0,0,0,0.07)_inset]"
                  required
                />
              </div>

              {/* Dev Mode testing OTP indicator */}
              {sentOtp && (
                <div className="bg-[#fcf8e3] border border-[#faebcc] rounded-[4px] p-2.5 text-xs text-[#8a6d3b] font-medium text-center">
                  💡 Dev OTP: <strong className="text-slate-900 font-black text-sm">{sentOtp}</strong>
                </div>
              )}

              {/* Verify OTP Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] hover:from-[#f5d78e] hover:to-[#eeb933] active:from-[#f0c14b] active:to-[#f0c14b] active:border-[#846a29] text-slate-900 text-[13px] font-medium rounded-[3px] py-1.5 shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] focus:outline-none transition-all cursor-pointer text-center"
              >
                {isLoading ? currentLang.verifying : currentLang.verifyOtpButton}
              </button>

              {/* Resend OTP control */}
              <div className="text-xs font-semibold text-slate-600 text-center pt-1">
                {timer > 0 ? (
                  <span>
                    {currentLang.resendIn.replace("{timer}", timer.toString())}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-[#0066c0] hover:text-[#c45500] hover:underline font-bold focus:outline-none"
                  >
                    {currentLang.resendOtp}
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Under-card links for swapping between Register and Sign-in inside the card */}
          {authMode === "signin" && step === "input" && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
              <span className="text-slate-600">New customer?</span>
              <button 
                onClick={() => handleModeSwitch("create")}
                className="text-[#0066c0] hover:text-[#c45500] hover:underline font-bold flex items-center gap-0.5"
              >
                Start here <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {authMode === "create" && step === "input" && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
              <span className="text-slate-600">{currentLang.alreadyHaveAccount}</span>
              <button 
                onClick={() => handleModeSwitch("signin")}
                className="text-[#0066c0] hover:text-[#c45500] hover:underline font-bold flex items-center gap-0.5"
              >
                {currentLang.signInTitle} <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Separator / Divider below card (if signing in) */}
        {authMode === "signin" && step === "input" && (
          <div className="w-full max-w-[350px] md:max-w-[365px] mt-6">
            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-2 text-xs font-semibold text-slate-500">
                {currentLang.newToApp}
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Create account button - secondary Gray Styled */}
            <button
              onClick={() => handleModeSwitch("create")}
              className="w-full bg-gradient-to-b from-[#f7f8fa] to-[#e7e9ec] border border-[#adb1b8] hover:from-[#e7eafd] hover:to-[#d8dbdf] text-slate-900 text-[13px] font-medium rounded-[3px] py-1.5 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] focus:outline-none focus:ring-1 focus:ring-[#e77600] active:from-[#e7e9ec] active:to-[#d8dbdf] transition-all cursor-pointer text-center"
            >
              {currentLang.createAccountButtonText}
            </button>
          </div>
        )}

        {/* Back to Home action */}
        <button
          onClick={() => navigate("/")}
          className="text-xs font-bold text-slate-500 hover:text-slate-700 hover:underline mt-6 outline-none"
        >
          {currentLang.backToHome}
        </button>
      </div>

      {/* Footer Area with legal disclosures and copyright */}
      <footer className="w-full py-5 bg-gradient-to-t from-slate-50 to-white border-t border-slate-200 mt-8 text-center text-[11px] font-medium text-slate-500 shrink-0">
        <div className="flex justify-center gap-6 pb-2.5">
          <span className="text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer">
            {currentLang.conditionsLink}
          </span>
          <span className="text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer">
            {currentLang.privacyLink}
          </span>
          <span className="text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer">
            Help
          </span>
        </div>
        <p className="text-slate-400 select-none flex flex-wrap justify-center items-center gap-1 mt-1">
          <span>© 2020-{new Date().getFullYear()}, GharSeKro.com, Inc. or its affiliates</span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="text-slate-400 font-medium">Created by</span>
          <a 
            href="https://www.aayuptechnologies.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#0066c0] hover:text-[#c45500] font-bold hover:underline"
          >
            Aayup Technologies
          </a>
        </p>
      </footer>

      {/* Complete registration Address Modal */}
      {registrationData && (
        <AddressModal
          isOpen={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          googleAuthData={registrationData}
        />
      )}
    </div>
  );
};

export default Login;