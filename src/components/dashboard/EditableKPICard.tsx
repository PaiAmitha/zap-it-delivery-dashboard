
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Edit3, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EditableField {
  type: 'text' | 'number' | 'date' | 'select' | 'percentage';
  value: string | number;
  options?: string[];
  min?: number;
  max?: number;
}

interface EditableKPICardProps {
  title: string;
  fields: Record<string, EditableField>;
  icon?: React.ReactNode;
  className?: string;
  onSave?: (updatedFields: Record<string, any>) => void;
}

export const EditableKPICard = ({ 
  title, 
  fields, 
  icon, 
  className = "",
  onSave 
}: EditableKPICardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const handleEdit = () => {
    const initialValues: Record<string, any> = {};
    Object.entries(fields).forEach(([key, field]) => {
      initialValues[key] = field.value;
    });
    setEditValues(initialValues);
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave?.(editValues);
    setIsEditing(false);
    toast({
      title: "Updated",
      description: `${title} has been updated successfully.`,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValues({});
  };

  const renderField = (key: string, field: EditableField) => {
    if (!isEditing) {
      if (field.type === 'percentage') {
        return <span className="text-2xl font-bold">{field.value}%</span>;
      }
      if (field.type === 'date') {
        return <span className="text-sm text-muted-foreground">{field.value}</span>;
      }
      return <span className="text-2xl font-bold">{field.value}</span>;
    }

    const value = editValues[key] ?? field.value;

    switch (field.type) {
      case 'select':
        return (
          <Select value={value.toString()} onValueChange={(val) => setEditValues(prev => ({ ...prev, [key]: val }))}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'number':
      case 'percentage':
        return (
          <Input
            type="number"
            value={value}
            min={field.min}
            max={field.max}
            onChange={(e) => setEditValues(prev => ({ ...prev, [key]: parseInt(e.target.value) || 0 }))}
            className="text-center"
          />
        );
      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => setEditValues(prev => ({ ...prev, [key]: e.target.value }))}
          />
        );
      default:
        return (
          <Input
            value={value}
            onChange={(e) => setEditValues(prev => ({ ...prev, [key]: e.target.value }))}
          />
        );
    }
  };

  return (
    <Card className={`${className} relative group`}>
      <CardContent className="p-6">
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleEdit}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        )}

        {isEditing && (
          <div className="absolute top-2 right-2 flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleSave}>
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
            <div className="space-y-2">
              {Object.entries(fields).map(([key, field]) => (
                <div key={key} className="flex flex-col">
                  {Object.keys(fields).length > 1 && (
                    <span className="text-xs text-muted-foreground capitalize mb-1">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                  )}
                  {renderField(key, field)}
                </div>
              ))}
            </div>
          </div>
          {icon && (
            <div className="ml-4">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
