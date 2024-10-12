import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const borderRadiusOptions = [
  { label: "rx", property: "rx" },
  { label: "ry", property: "ry" },
];

type Props = {
  rx: string;
  ry: string;
  isEditingRef: React.MutableRefObject<boolean>;
  handleInputChange: (property: string, value: string) => void;
};

const BorderRadius = ({ rx, ry, isEditingRef, handleInputChange }: Props) => (
  <section className='flex flex-col border-b border-primary-grey-200'>
    <div className='flex flex-col gap-4 px-6 py-3'>
      {borderRadiusOptions.map((item) => (
        <div
          key={item.label}
          className='flex flex-1 items-center gap-3 rounded-sm'
        >
          <Label htmlFor={item.property} className='text-[10px] font-bold'>
            {item.label}
          </Label>
          <Input
            type='number'
            id={item.property}
            placeholder='0'
            value={item.property === "rx" ? rx : ry}
            className='input-ring'
            min={0}
            onChange={(e) => handleInputChange(item.property, e.target.value)}
            onBlur={(e) => {
              isEditingRef.current = false
            }}
          />
        </div>
      ))}
    </div>
  </section>
);

export default BorderRadius;
