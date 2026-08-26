import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: string;
  formDob: string;
  setFormDob: (v: string) => void;
  formGender: string;
  setFormGender: (v: string) => void;
  formProfession: string;
  setFormProfession: (v: string) => void;
  formGoals: string;
  setFormGoals: (v: string) => void;
  formMaritalStatus: string;
  setFormMaritalStatus: (v: string) => void;
  formIsBusinessOwner: boolean;
  setFormIsBusinessOwner: (v: boolean) => void;
  formFullBirthName: string;
  setFormFullBirthName: (v: string) => void;
  formDisplayName: string;
  setFormDisplayName: (v: string) => void;
  formBirthTime: string;
  setFormBirthTime: (v: string) => void;
  formBirthPlace: string;
  setFormBirthPlace: (v: string) => void;
  formIndustry: string;
  setFormIndustry: (v: string) => void;
  formPhone?: string;
  setFormPhone?: (v: string) => void;
  onSave: () => void;
}

const ProfileEditModal = ({
  open,
  onOpenChange,
  language,
  formDob, setFormDob,
  formGender, setFormGender,
  formProfession, setFormProfession,
  formGoals, setFormGoals,
  formMaritalStatus, setFormMaritalStatus,
  formIsBusinessOwner, setFormIsBusinessOwner,
  formFullBirthName, setFormFullBirthName,
  formDisplayName, setFormDisplayName,
  formBirthTime, setFormBirthTime,
  formBirthPlace, setFormBirthPlace,
  formIndustry, setFormIndustry,
  formPhone, setFormPhone,
  onSave,
}: ProfileEditModalProps) => {
  const isHi = language === 'hi';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] sm:max-w-lg bg-[#110e21] border-white/10 text-white max-h-[85vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-display font-semibold text-white">
            {isHi ? 'अपनी प्रोफाइल अपडेट करें' : 'Update Profile Details'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-gray-400">
            {isHi ? 'दैनिक भविष्यफल और व्यक्तिगत रिपोर्टों को ट्यून करने के लिए अपनी जानकारी भरें।' : 'Fill in your details to tune your daily forecast, recommendations, and reports.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 text-left">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <Label htmlFor="prof-birthname" className="text-xs text-gray-300">Full Birth Name</Label>
              <Input
                id="prof-birthname"
                type="text"
                placeholder="Birth name (e.g. Aarav Kumar)"
                value={formFullBirthName}
                onChange={(e) => setFormFullBirthName(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder-gray-500 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="prof-dispname" className="text-xs text-gray-300">Display / Nickname</Label>
              <Input
                id="prof-dispname"
                type="text"
                placeholder="Preferred name (e.g. Aarav)"
                value={formDisplayName}
                onChange={(e) => setFormDisplayName(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder-gray-500 text-sm"
              />
            </div>
          </div>

          {setFormPhone && (
            <div className="space-y-1">
              <Label htmlFor="prof-modal-phone" className="text-xs text-gray-300">Phone Number *</Label>
              <Input
                id="prof-modal-phone"
                type="tel"
                placeholder="+91 9876543210"
                value={formPhone || ''}
                onChange={(e) => setFormPhone(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder-gray-500 text-sm"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="prof-dob" className="text-xs text-gray-300">Date of Birth</Label>
              <Input
                id="prof-dob"
                type="date"
                value={formDob}
                onChange={(e) => setFormDob(e.target.value)}
                className="bg-white/5 border-white/10 text-white text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="prof-birthtime" className="text-xs text-gray-300">Birth Time</Label>
              <Input
                id="prof-birthtime"
                type="time"
                value={formBirthTime}
                onChange={(e) => setFormBirthTime(e.target.value)}
                className="bg-white/5 border-white/10 text-white text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="prof-birthplace" className="text-xs text-gray-300">Birth Place</Label>
              <Input
                id="prof-birthplace"
                type="text"
                placeholder="City/State"
                value={formBirthPlace}
                onChange={(e) => setFormBirthPlace(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder-gray-500 text-sm"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <Label htmlFor="prof-gender" className="text-xs text-gray-300">Gender</Label>
              <select
                id="prof-gender"
                className="flex h-10 w-full rounded-md border border-white/10 bg-[#161326] px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
                value={formGender}
                onChange={(e) => setFormGender(e.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="prof-marital" className="text-xs text-gray-300">Relationship Status</Label>
              <select
                id="prof-marital"
                className="flex h-10 w-full rounded-md border border-white/10 bg-[#161326] px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
                value={formMaritalStatus}
                onChange={(e) => setFormMaritalStatus(e.target.value)}
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="separated">Separated</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <Label htmlFor="prof-job" className="text-xs text-gray-300">Profession / Occupation</Label>
              <Input
                id="prof-job"
                type="text"
                placeholder="e.g. Software Engineer"
                value={formProfession}
                onChange={(e) => setFormProfession(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder-gray-500 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="prof-industry" className="text-xs text-gray-300">Industry / Domain</Label>
              <Input
                id="prof-industry"
                type="text"
                placeholder="e.g. IT, Health, Retail"
                value={formIndustry}
                onChange={(e) => setFormIndustry(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder-gray-500 text-sm"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="prof-goals" className="text-xs text-gray-300">Primary Life Goal</Label>
            <Input
              id="prof-goals"
              type="text"
              placeholder="e.g. Expand business, find love, improve health"
              value={formGoals}
              onChange={(e) => setFormGoals(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder-gray-500 text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            <input
              id="prof-biz"
              type="checkbox"
              className="w-4 h-4 rounded text-primary focus:ring-primary bg-white/5 border-white/10 cursor-pointer"
              checked={formIsBusinessOwner}
              onChange={(e) => setFormIsBusinessOwner(e.target.checked)}
            />
            <Label htmlFor="prof-biz" className="cursor-pointer select-none text-xs sm:text-sm font-medium text-gray-300">
              I am a Business Owner / Founder
            </Label>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
          <Button variant="outline" className="w-full sm:w-auto border-white/10 text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white" onClick={onSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditModal;
