import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/user/entities/user.entity';
import { RuleType } from 'src/decorators/use-rule.decorator';

@Injectable()
export class UserRuleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user: { id: string; cardNumber: string } = context
      .switchToHttp()
      .getRequest().user;

    if (!user) return false;

    const rule = this.reflector.get<RuleType[]>(
      'useRule',
      context.getHandler(),
    );

    if (!rule) return false;

    const userRule = await User.findOne({
      select: ['rule'],
      where: {
        id: user.id,
        //rule: Like(`%${rule}%`),
      },
    });

    if (!userRule) {
      return false;
    }
    let auth = false;

    if (rule) {
      rule.map((r) => {
        if (userRule.rule.indexOf(String(r)) !== -1) {
          auth = true;
        }
      });
    }

    return auth;
  }
}
