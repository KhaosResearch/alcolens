import { Label } from '@/components/ui/label';
import { Switch } from '@/components/animate-ui/components/radix/switch';

export function RadixSwitch() {
  return (
    <Label className="flex items-center gap-x-3">
      <Switch />
    </Label>
  );
}