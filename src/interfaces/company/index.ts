import { FeatureInterface } from 'interfaces/feature';
import { FeedbackInterface } from 'interfaces/feedback';
import { GoalInterface } from 'interfaces/goal';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface CompanyInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  feature?: FeatureInterface[];
  feedback?: FeedbackInterface[];
  goal?: GoalInterface[];
  user?: UserInterface;
  _count?: {
    feature?: number;
    feedback?: number;
    goal?: number;
  };
}

export interface CompanyGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
