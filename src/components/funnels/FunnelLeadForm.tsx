import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useFunnel } from '@/contexts/FunnelContext';
import { useFunnelTracking } from '@/hooks/useFunnelTracking';

interface FieldOption {
  value: string;
  label: string;
}

interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'hidden';
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
}

interface FunnelLeadFormProps {
  fields?: FieldConfig[];
  submitLabel?: string;
  showPrivacyNote?: boolean;
  onSuccess?: (leadId: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  variant?: 'stacked' | 'inline';
}

const defaultFields: FieldConfig[] = [
  {
    name: 'full_name',
    label: 'Full Name',
    type: 'text',
    placeholder: 'Enter your full name',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    required: true,
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'phone',
    placeholder: '07xxx xxx xxx',
    required: false,
  },
];

// Build dynamic Zod schema based on fields
function buildSchema(fields: FieldConfig[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    if (field.type === 'hidden') return;

    let validator: z.ZodTypeAny;

    switch (field.type) {
      case 'email':
        validator = z.string().email('Please enter a valid email');
        break;
      case 'phone':
        validator = z.string();
        break;
      default:
        validator = z.string();
    }

    if (field.required) {
      validator = validator.pipe(z.string().min(1, `${field.label} is required`));
    } else {
      validator = validator.optional().or(z.literal(''));
    }

    shape[field.name] = validator;
  });

  return z.object(shape);
}

export function FunnelLeadForm({
  fields = defaultFields,
  submitLabel = 'Get Started',
  showPrivacyNote = true,
  onSuccess,
  onError,
  className,
  variant = 'stacked',
}: FunnelLeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { funnelSlug, utmParams, formData, updateFormData } = useFunnel();
  const { trackFormSubmit, trackConversion } = useFunnelTracking();

  const schema = buildSchema(fields);
  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: fields.reduce((acc, field) => {
      acc[field.name] = formData[field.name] || '';
      return acc;
    }, {} as Record<string, string>),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Save to landing_leads table
      const { data: lead, error } = await supabase
        .from('landing_leads')
        .insert({
          full_name: data.full_name || '',
          email: data.email || '',
          phone: data.phone || null,
          interest_type: funnelSlug || 'funnel',
          referrer_url: window.location.href,
        })
        .select('id')
        .single();

      if (error) throw error;

      // Track events
      await trackFormSubmit(data);
      await trackConversion('lead', lead.id);

      // Update context with form data
      updateFormData(data);

      setIsSuccess(true);

      if (onSuccess) {
        onSuccess(lead.id);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      if (onError) {
        onError(error as Error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'text-center py-8 px-6 rounded-xl bg-primary/5 border border-primary/20',
          className
        )}
      >
        <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Thank you!</h3>
        <p className="text-muted-foreground">
          We've received your information and will be in touch shortly.
        </p>
      </motion.div>
    );
  }

  const isInline = variant === 'inline';

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          isInline ? 'flex flex-wrap gap-3 items-end' : 'space-y-4',
          className
        )}
      >
        {fields.map((field) => {
          if (field.type === 'hidden') {
            return (
              <input
                key={field.name}
                type="hidden"
                {...form.register(field.name)}
              />
            );
          }

          return (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem className={isInline ? 'flex-1 min-w-[200px]' : ''}>
                  {!isInline && <FormLabel>{field.label}</FormLabel>}
                  <FormControl>
                    {field.type === 'select' ? (
                      <Select
                        onValueChange={formField.onChange}
                        defaultValue={formField.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={field.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={field.type === 'phone' ? 'tel' : field.type}
                        placeholder={field.placeholder || field.label}
                        {...formField}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className={cn(isInline ? '' : 'w-full', 'text-lg')}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            submitLabel
          )}
        </Button>

        {showPrivacyNote && !isInline && (
          <p className="text-xs text-muted-foreground text-center">
            By submitting, you agree to our{' '}
            <a href="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </a>
            . We'll never share your information.
          </p>
        )}
      </form>
    </Form>
  );
}
