import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { signup, SignupData } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  googleAuthData: {
    token: string;
    name?: string;
    email?: string;
    profile?: string;
  };
}

const AddressModal = ({ isOpen, onClose, googleAuthData }: AddressModalProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  // default to Uttar Pradesh / Gorakhpur since service available there
  const [city, setCity] = useState('Gorakhpur');
  const [pincode, setPincode] = useState('');
  const [flatnumber, setFlatnumber] = useState<number | ''>('');
  const [stateName, setStateName] = useState('Uttar Pradesh');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState<'RETAILER' | 'WHOLESALER'>('RETAILER');

  // Wholesaler fields
  const [shopname, setShopname] = useState('');
  const [shopnumber, setShopnumber] = useState('');
  const [gstnumber, setGstnumber] = useState('');
  const [adhaarnumber, setAdhaarnumber] = useState('');

  // Geolocation
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Lists for dropdowns
  const IndiaStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry"
  ]

  const UttarPradeshDistricts = [
    "Agra",
    "Aligarh",
    "Ambedkar Nagar",
    "Amethi",
    "Amroha",
    "Auraiya",
    "Ayodhya",
    "Azamgarh",
    "Baghpat",
    "Bahraich",
    "Ballia",
    "Balrampur",
    "Banda",
    "Barabanki",
    "Bareilly",
    "Basti",
    "Bhadohi",
    "Bijnor",
    "Budaun",
    "Bulandshahr",
    "Chandauli",
    "Chitrakoot",
    "Deoria",
    "Etah",
    "Etawah",
    "Farrukhabad",
    "Fatehpur",
    "Firozabad",
    "Gautam Buddha Nagar",
    "Ghaziabad",
    "Ghazipur",
    "Gonda",
    "Gorakhpur",
    "Hamirpur",
    "Hapur",
    "Hardoi",
    "Hathras",
    "Jalaun",
    "Jaunpur",
    "Jhansi",
    "Kannauj",
    "Kanpur Dehat",
    "Kanpur Nagar",
    "Kasganj",
    "Kaushambi",
    "Kushinagar",
    "Lakhimpur Kheri",
    "Lalitpur",
    "Lucknow",
    "Maharajganj",
    "Mahoba",
    "Mainpuri",
    "Mathura",
    "Mau",
    "Meerut",
    "Mirzapur",
    "Moradabad",
    "Muzaffarnagar",
    "Pilibhit",
    "Pratapgarh",
    "Raebareli",
    "Rampur",
    "Saharanpur",
    "Sambhal",
    "Sant Kabir Nagar",
    "Shahjahanpur",
    "Shamli",
    "Shravasti",
    "Siddharthnagar",
    "Sitapur",
    "Sonbhadra",
    "Sultanpur",
    "Unnao",
    "Varanasi"
  ]

  const isServiceAvailable = stateName === 'Uttar Pradesh' && city === 'Gorakhpur'

  const handleSubmit = async () => {
    // Client-side validation
    if (!city || !pincode || !flatnumber || !stateName || !phone) {
      toast({
        title: 'Missing fields',
        description: 'Please fill all address fields',
        variant: 'destructive'
      });
      return;
    }

    if (!/^[0-9]{6}$/.test(pincode)) {
      toast({
        title: 'Invalid pincode',
        description: 'Pincode must be exactly 6 digits',
        variant: 'destructive'
      });
      return;
    }

    if (!city || !stateName || stateName.toLowerCase() !== 'uttar pradesh' || city.toLowerCase() !== 'gorakhpur') {
      toast({
        title: 'Service Not Available',
        description: 'Sorry, currently we are not working in your city. We only support orders in Gorakhpur.',
        variant: 'destructive'
      });
      return;
    }

    if (userType === 'WHOLESALER') {
      if (!shopname || !shopnumber || !gstnumber || !adhaarnumber) {
        toast({ title: 'Missing fields', description: 'Please fill all wholesaler fields', variant: 'destructive' });
        return;
      }
    }

    setIsLoading(true);
    try {
      const signupData: SignupData = {
        city,
        pincode,
        flatnumber: Number(flatnumber),
        state: stateName,
        phone,
        type: userType,
        ...(userType === 'WHOLESALER' ? {
          shopname,
          shopnumber,
          gstnumber,
          adhaarnumber,
          latitude: latitude ?? undefined,
          longitude: longitude ?? undefined,
        } : {})
      };

      const response = await signup(signupData, googleAuthData.token);

      // Store all auth and user data
      if (response.token) localStorage.setItem('authToken', response.token);
      if (googleAuthData.name || response.name) localStorage.setItem('userName', googleAuthData.name || response.name || '');
      if (googleAuthData.email || response.email) localStorage.setItem('userEmail', googleAuthData.email || response.email || '');
      if (googleAuthData.profile) localStorage.setItem('userProfile', googleAuthData.profile);

      localStorage.setItem('userType', userType);

      // Dispatch custom event to update Header state immediately
      window.dispatchEvent(new Event('auth-change'));

      toast({
        title: 'Signup successful',
        description: 'Welcome! Redirecting to home.'
      });

      onClose();
      navigate('/');
    } catch (err: any) {
      console.error('Signup error', err);
      toast({
        title: 'Signup error',
        description: err?.message || 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: 'Geolocation not supported', description: 'Your browser does not support geolocation', variant: 'destructive' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        toast({ title: 'Location detected', description: `Lat: ${pos.coords.latitude.toFixed(4)}, Lon: ${pos.coords.longitude.toFixed(4)}` });
      },
      (err) => {
        console.error('Geolocation error', err);
        toast({ title: 'Location error', description: err.message || 'Failed to get location', variant: 'destructive' });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg sm:w-full justify-center scrollbar overflow-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Complete Your Registration</DialogTitle>
          <DialogDescription>
            {googleAuthData.name && `Welcome ${googleAuthData.name}! `}
            Please provide your address details to complete signup.
          </DialogDescription>
        </DialogHeader>
         <div>
            <Label htmlFor="modal-state">State</Label>
            <select
              id="modal-state"
              value={stateName}
              onChange={(e) => {
                const val = e.target.value
                setStateName(val)
                // auto-select Gorakhpur when Uttar Pradesh is picked
                if (val === 'Uttar Pradesh') setCity('Gorakhpur')
                else setCity('')
              }}
              className="w-full rounded-md border p-2"
            >
              {IndiaStates.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="modal-city">City</Label>
            {stateName === 'Uttar Pradesh' ? (
              <select id="modal-city" value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded-md border p-2">
                {UttarPradeshDistricts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            ) : (
              <Input
                id="modal-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., Gorakhpur"
              />
            )}
          </div>
          <div>
            <Label htmlFor="modal-pincode">Pincode</Label>
            <Input
              id="modal-pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="e.g., 273015"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              autoComplete="postal-code"
            />
          </div>
          <div>
            <Label htmlFor="modal-flatnumber">Flat Number</Label>
            <Input
              id="modal-flatnumber"
              type="number"
              value={flatnumber as any}
              onChange={(e) => setFlatnumber(Number(e.target.value) || '')}
              placeholder="e.g., 277"
            />
          </div>
         
          {!isServiceAvailable && (
            <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
              Service not available in <strong>{city || 'your city'}</strong>, <strong>{stateName}</strong> yet. Coming soon — we'll notify you when we expand.
            </div>
          )}
          <div>
            <Label htmlFor="modal-phone">Phone</Label>
            <Input
              id="modal-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., 9876543210"
            />
          </div>
          <div>
            <Label htmlFor="modal-usertype">User Type</Label>
            <select
              id="modal-usertype"
              value={userType}
              onChange={(e) => setUserType(e.target.value as 'RETAILER' | 'WHOLESALER')}
              className="w-full rounded-md border p-2"
            >
              <option value="RETAILER">Retailer</option>
              <option value="WHOLESALER">Wholesaler</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleUseMyLocation}>Use my location</Button>
            <div className="text-sm text-muted-foreground">
              {latitude && longitude ? (
                <div>Lat: {latitude.toFixed(4)}, Lon: {longitude.toFixed(4)}</div>
              ) : (
                <div>No location</div>
              )}
            </div>
          </div>

          {userType === 'WHOLESALER' && (
            <>
              <div>
                <Label htmlFor="modal-shopname">Shop Name</Label>
                <Input id="modal-shopname" value={shopname} onChange={(e) => setShopname(e.target.value)} placeholder="e.g., My Shop" />
              </div>
              <div>
                <Label htmlFor="modal-shopnumber">Shop Number</Label>
                <Input id="modal-shopnumber" value={shopnumber} onChange={(e) => setShopnumber(e.target.value)} placeholder="e.g., 9876543210" />
              </div>
              <div>
                <Label htmlFor="modal-gst">GST Number</Label>
                <Input id="modal-gst" value={gstnumber} onChange={(e) => setGstnumber(e.target.value)} placeholder="e.g., 29ABCDE1234F1Z5" />
              </div>
              <div>
                <Label htmlFor="modal-aadhaar">Aadhaar Number</Label>
                <Input id="modal-aadhaar" value={adhaarnumber} onChange={(e) => setAdhaarnumber(e.target.value)} placeholder="e.g., 123412341234" />
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Creating Account...' : 'Complete Registration'}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddressModal;
