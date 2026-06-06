import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addAddress, AddAddressData } from "@/lib/api"

interface AddAddressModalProps {
  isOpen: boolean
  onClose: () => void
  onAddressAdded: () => void
}

const AddAddressModal = ({ isOpen, onClose, onAddressAdded }: AddAddressModalProps) => {
  // Dropdowns and geolocation
  const IndiaStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];
  const UttarPradeshDistricts = [
    "Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kushinagar", "Lakhimpur Kheri", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
  ];
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [formData, setFormData] = useState<AddAddressData>({
    city: 'Gorakhpur',
    pincode: '',
    flatnumber: 0,
    state: 'Uttar Pradesh',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setFormData({
        city: 'Gorakhpur',
        pincode: '',
        flatnumber: 0,
        state: 'Uttar Pradesh',
        phone: ''
      })
      setLatitude(null)
      setLongitude(null)
      setError('')
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      setError('Pincode must be exactly 6 digits')
      setLoading(false)
      return
    }

    try {
      const result = await addAddress({
        ...formData,
        latitude,
        longitude
      })
      if (result.success) {
        setFormData({
          city: 'Gorakhpur',
          pincode: '',
          flatnumber: 0,
          state: 'Uttar Pradesh',
          phone: ''
        })
        onAddressAdded()
        onClose()
      } else {
        setError('Failed to add address')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add address')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof AddAddressData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePincodeChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6)
    handleInputChange('pincode', digits)
  }

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        alert(`Location detected: Lat ${pos.coords.latitude.toFixed(4)}, Lon ${pos.coords.longitude.toFixed(4)}`);
      },
      (err) => {
        alert('Location error: ' + (err.message || 'Failed to get location'));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <select
              id="state"
              value={formData.state}
              onChange={e => {
                const val = e.target.value
                handleInputChange('state', val)
                // auto-select Gorakhpur when Uttar Pradesh is picked
                if (val === 'Uttar Pradesh') handleInputChange('city', 'Gorakhpur')
                else handleInputChange('city', '')
              }}
              className="w-full rounded-md border p-2"
              required
            >
              {IndiaStates.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            {formData.state === 'Uttar Pradesh' ? (
              <select id="city" value={formData.city} onChange={e => handleInputChange('city', e.target.value)} className="w-full rounded-md border p-2" required>
                {UttarPradeshDistricts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            ) : (
              <Input
                id="city"
                value={formData.city}
                onChange={e => handleInputChange('city', e.target.value)}
                placeholder="Enter city"
                required
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              value={formData.pincode}
              onChange={(e) => handlePincodeChange(e.target.value)}
              placeholder="Enter pincode"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              autoComplete="postal-code"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={handleUseMyLocation}>Use my location</Button>
            <div className="text-sm text-muted-foreground">
              {latitude && longitude ? (
                <div>Lat: {latitude.toFixed(4)}, Lon: {longitude.toFixed(4)}</div>
              ) : (
                <div>No location</div>
              )}
            </div>
          </div>

	  <div className="space-y-2">
            <Label htmlFor="flatnumber">Flat/House Number</Label>
            <Input
              id="flatnumber"
              type="number"
              value={formData.flatnumber}
              onChange={(e) => handleInputChange('flatnumber', parseInt(e.target.value) || 0)}
              placeholder="Enter flat/house number"
              required
            />
          </div>

          {/* Service availability warning */}
          {formData.state === 'Uttar Pradesh' && formData.city === 'Gorakhpur' ? null : (
            <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
              Service not available in <strong>{formData.city || 'your city'}</strong>, <strong>{formData.state}</strong> yet. Coming soon — we'll notify you when we expand.
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter phone number"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Address'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddAddressModal
