'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@pg/shared';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Placeholder: shows the React Hook Form + shared Zod schema pattern.
// Auth is not implemented, so submitting only validates the fields.
export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  return (
    <form
      onSubmit={(event) => void handleSubmit(() => undefined)(event)}
      noValidate
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby="email-error"
          {...register('email')}
        />
        <p id="email-error" role="alert" className="text-destructive text-sm">
          {errors.email?.message}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          aria-describedby="password-error"
          {...register('password')}
        />
        <p id="password-error" role="alert" className="text-destructive text-sm">
          {errors.password?.message}
        </p>
      </div>
      <Button type="submit">Sign in</Button>
      {isSubmitSuccessful && (
        <p role="status" className="text-muted-foreground text-sm">
          Sign-in is not implemented yet.
        </p>
      )}
    </form>
  );
}
