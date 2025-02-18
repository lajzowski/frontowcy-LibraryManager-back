import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import { UserRuleGuard } from 'src/guards/user-rules.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

export const allRules = [
  'a9', // ADMIN FULL
  'u0', // Standardowy użytkownik
] as const;

export type RuleType = (typeof allRules)[number];

export const UseRule = (rule?: RuleType[]): PropertyDecorator => {
  if (!rule) {
    return applyDecorators(
      SetMetadata('useRule', rule),
      UseGuards(JwtAuthGuard),
    );
  }

  return applyDecorators(
    SetMetadata('useRule', rule),
    UseGuards(JwtAuthGuard, UserRuleGuard),
  );
};

/*
 *
 * Używamy np. z naszym PasswordProtectGuard
 *
 * @UseGuards(PasswordProtectGuard)
 * @UsePassword('Password1')
 * jakasAkcja() {
 * //
 * }
 *
 * */
